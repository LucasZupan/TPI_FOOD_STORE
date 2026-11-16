from .model import Producto
from .schema import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from .unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class CategoriaNoEncontrada(Exception):
    pass


class ProductoService:
    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> ProductosPaginados:
        with ProductoUnitOfWork() as uow:
            total, productos = uow.productos.search(
                skip=skip,
                limit=limit,
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
            )

            items = [
                ProductoRead.model_validate(producto)
                for producto in productos
            ]

            return ProductosPaginados(
                total=total,
                items=items,
            )

    def obtener_por_id(
        self,
        id: int,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.get_by_id(id)

            if not producto:
                raise ProductoNoEncontrado()

            return ProductoRead.model_validate(
                producto
            )

    def crear(
        self,
        data: ProductoCreate,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            categoria = uow.categorias.get_by_id(
                data.categoria_id
            )

            if not categoria:
                raise CategoriaNoEncontrada()

            producto = Producto(
                **data.model_dump()
            )

            uow.productos.add(producto)
            uow.flush()

            return ProductoRead.model_validate(
                producto
            )

    def actualizar(
        self,
        id: int,
        data: ProductoUpdate,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.get_by_id(id)

            if not producto:
                raise ProductoNoEncontrado()

            cambios = data.model_dump(
                exclude_unset=True
            )

            nueva_categoria_id = cambios.get(
                "categoria_id"
            )

            if nueva_categoria_id is not None:
                categoria = (
                    uow.categorias.get_by_id(
                        nueva_categoria_id
                    )
                )

                if not categoria:
                    raise CategoriaNoEncontrada()

            for campo, valor in cambios.items():
                setattr(
                    producto,
                    campo,
                    valor,
                )

            uow.productos.add(producto)
            uow.flush()

            return ProductoRead.model_validate(
                producto
            )

    def actualizar_stock(
        self,
        id: int,
        data: ProductoStockUpdate,
    ) -> ProductoRead:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.get_by_id(id)

            if not producto:
                raise ProductoNoEncontrado()

            producto.stock = data.stock
            producto.disponible = data.disponible

            uow.productos.add(producto)
            uow.flush()

            return ProductoRead.model_validate(
                producto
            )

    def eliminar(
        self,
        id: int,
    ) -> None:
        with ProductoUnitOfWork() as uow:
            producto = uow.productos.get_by_id(id)

            if not producto:
                raise ProductoNoEncontrado()

            producto.activo = False
            uow.productos.add(producto)


def get_producto_service() -> ProductoService:
    return ProductoService()