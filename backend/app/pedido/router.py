from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from app.core.dependencies import (
    CurrentActiveUser,
    require_role,
)
from app.usuarios.model import Usuario

from .schema import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from .service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoNoEncontrado,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
    get_pedido_service,
)

router = APIRouter(
    prefix="/api/v1/pedidos",
    tags=["Pedidos"],
)


PedidoServiceDep = Annotated[
    PedidoService,
    Depends(get_pedido_service),
]


AdminUser = Annotated[
    Usuario,
    Depends(require_role(["admin"])),
]


def obtener_id_usuario(
    usuario: Usuario,
) -> int:
    if usuario.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inválido",
        )

    return usuario.id


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    data: PedidoCreate,
    service: PedidoServiceDep,
    current_user: CurrentActiveUser,
):
    try:
        return service.crear(
            data=data,
            usuario_id=obtener_id_usuario(
                current_user
            ),
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    except StockInsuficiente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock insuficiente",
        )

    except ProductoNoDisponible:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Producto no disponible",
        )

    except ProductoRepetido:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede repetir un producto",
        )


@router.get(
    "",
    response_model=PedidosPaginados,
)
def listar_pedidos(
    service: PedidoServiceDep,
    current_user: CurrentActiveUser,
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    estado: EstadoPedido | None = None,
):
    return service.listar(
        usuario_id=obtener_id_usuario(
            current_user
        ),
        role=current_user.role,
        skip=skip,
        limit=limit,
        estado=estado,
    )


@router.get(
    "/resumen",
    response_model=ResumenPedidos,
)
def obtener_resumen(
    service: PedidoServiceDep,
    _: AdminUser,
):
    return service.resumen()


@router.get(
    "/{id}",
    response_model=PedidoRead,
)
def obtener_pedido(
    id: int,
    service: PedidoServiceDep,
    current_user: CurrentActiveUser,
):
    try:
        return service.obtener_por_id(
            id=id,
            usuario_id=obtener_id_usuario(
                current_user
            ),
            role=current_user.role,
        )

    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado",
        )

    except PedidoAjeno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permiso para ver este pedido",
        )


@router.patch(
    "/{id}/estado",
    response_model=PedidoRead,
)
def cambiar_estado(
    id: int,
    data: CambioEstado,
    service: PedidoServiceDep,
    _: AdminUser,
):
    try:
        return service.cambiar_estado(
            id=id,
            data=data,
        )

    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado",
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    except TransicionInvalida:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transición de estado inválida",
        )


@router.patch(
    "/{id}/cancelar",
    response_model=PedidoRead,
)
def cancelar_pedido(
    id: int,
    service: PedidoServiceDep,
    current_user: CurrentActiveUser,
):
    try:
        return service.cancelar(
            id=id,
            usuario_id=obtener_id_usuario(
                current_user
            ),
        )

    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado",
        )

    except PedidoAjeno:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El pedido pertenece a otro usuario",
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    except TransicionInvalida:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se puede cancelar un pedido PENDIENTE",
        )