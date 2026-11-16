from datetime import UTC, datetime
from typing import ClassVar

from .model import DetallePedido, Pedido
from .schema import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from .unit_of_work import PedidoUnitOfWork


class PedidoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class ProductoNoEncontrado(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class ProductoRepetido(Exception):
    pass


class TransicionInvalida(Exception):
    pass


class PedidoService:
    TRANSICIONES_VALIDAS: ClassVar[dict[str, set[str]]] = {
        "PENDIENTE": {
            "EN_PREPARACION",
            "CANCELADO",
        },
        "EN_PREPARACION": {
            "ENTREGADO",
            "CANCELADO",
        },
        "ENTREGADO": set(),
        "CANCELADO": set(),
    }

    def crear(
        self,
        data: PedidoCreate,
        usuario_id: int,
    ) -> PedidoRead:
        ids_productos = [
            item.producto_id
            for item in data.items
        ]

        if len(ids_productos) != len(
            set(ids_productos)
        ):
            raise ProductoRepetido()

        with PedidoUnitOfWork() as uow:
            pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=data.forma_pago,
                direccion_entrega=(
                    data.direccion_entrega
                ),
                notas=data.notas,
                total=0,
            )

            uow.pedidos.add(pedido)
            uow.flush()

            total = 0.0

            for item in data.items:
                producto = (
                    uow.productos.get_by_id(
                        item.producto_id
                    )
                )

                if not producto:
                    raise ProductoNoEncontrado()

                if not producto.disponible:
                    raise ProductoNoDisponible()

                if producto.stock < item.cantidad:
                    raise StockInsuficiente()

                producto.stock -= item.cantidad

                subtotal = (
                    producto.precio_base
                    * item.cantidad
                )

                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=(
                        producto.precio_base
                    ),
                    subtotal=subtotal,
                )

                uow.pedidos.add_detalle(
                    detalle
                )

                total += subtotal

            pedido.total = total
            pedido.updated_at = datetime.now(
                UTC
            )

            uow.flush()

            pedido_completo = (
                uow.pedidos.get_by_id(
                    pedido.id
                )
            )

            return PedidoRead.model_validate(
                pedido_completo
            )

    def listar(
        self,
        usuario_id: int,
        role: str,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> PedidosPaginados:
        with PedidoUnitOfWork() as uow:
            if role == "admin":
                total, pedidos = (
                    uow.pedidos.list_all(
                        skip=skip,
                        limit=limit,
                        estado=estado,
                    )
                )
            else:
                total, pedidos = (
                    uow.pedidos.list_by_usuario(
                        usuario_id=usuario_id,
                        skip=skip,
                        limit=limit,
                        estado=estado,
                    )
                )

            return PedidosPaginados(
                total=total,
                items=[
                    PedidoRead.model_validate(
                        pedido
                    )
                    for pedido in pedidos
                ],
            )

    def obtener_por_id(
        self,
        id: int,
        usuario_id: int,
        role: str,
    ) -> PedidoRead:
        with PedidoUnitOfWork() as uow:
            pedido = uow.pedidos.get_by_id(id)

            if not pedido:
                raise PedidoNoEncontrado()

            if (
                role != "admin"
                and pedido.usuario_id
                != usuario_id
            ):
                raise PedidoAjeno()

            return PedidoRead.model_validate(
                pedido
            )

    def cambiar_estado(
        self,
        id: int,
        data: CambioEstado,
    ) -> PedidoRead:
        with PedidoUnitOfWork() as uow:
            pedido = uow.pedidos.get_by_id(id)

            if not pedido:
                raise PedidoNoEncontrado()

            permitidos = (
                self.TRANSICIONES_VALIDAS[
                    pedido.estado
                ]
            )

            if data.estado not in permitidos:
                raise TransicionInvalida()

            if data.estado == "CANCELADO":
                self._restituir_stock(
                    pedido,
                    uow,
                )

            pedido.estado = data.estado
            pedido.updated_at = datetime.now(
                UTC
            )

            uow.flush()

            return PedidoRead.model_validate(
                pedido
            )

    def cancelar(
        self,
        id: int,
        usuario_id: int,
    ) -> PedidoRead:
        with PedidoUnitOfWork() as uow:
            pedido = uow.pedidos.get_by_id(id)

            if not pedido:
                raise PedidoNoEncontrado()

            if pedido.usuario_id != usuario_id:
                raise PedidoAjeno()

            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida()

            self._restituir_stock(
                pedido,
                uow,
            )

            pedido.estado = "CANCELADO"
            pedido.updated_at = datetime.now(
                UTC
            )

            uow.flush()

            return PedidoRead.model_validate(
                pedido
            )

    def resumen(
        self,
    ) -> ResumenPedidos:
        with PedidoUnitOfWork() as uow:
            return ResumenPedidos(
                pendientes=(
                    uow.pedidos.count_by_estado(
                        "PENDIENTE"
                    )
                ),
                en_preparacion=(
                    uow.pedidos.count_by_estado(
                        "EN_PREPARACION"
                    )
                ),
                entregados=(
                    uow.pedidos.count_by_estado(
                        "ENTREGADO"
                    )
                ),
                cancelados=(
                    uow.pedidos.count_by_estado(
                        "CANCELADO"
                    )
                ),
                pedidos_hoy=(
                    uow.pedidos.count_hoy()
                ),
                ingresos_entregados=(
                    uow.pedidos.ingresos_entregados()
                ),
            )

    def _restituir_stock(
        self,
        pedido: Pedido,
        uow: PedidoUnitOfWork,
    ) -> None:
        for detalle in pedido.items:
            producto = (
                uow.productos
                .get_by_id_including_inactive(
                    detalle.producto_id
                )
            )

            if not producto:
                raise ProductoNoEncontrado()

            producto.stock += detalle.cantidad


def get_pedido_service() -> PedidoService:
    return PedidoService()