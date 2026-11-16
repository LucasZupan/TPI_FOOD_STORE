from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Response,
    status,
)

from app.core.dependencies import require_role
from app.usuarios.model import Usuario

from .schema import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from .service import (
    CategoriaNoEncontrada,
    ProductoNoEncontrado,
    ProductoService,
    get_producto_service,
)

router = APIRouter(
    prefix="/api/v1/productos",
    tags=["Productos"],
)


ProductoServiceDep = Annotated[
    ProductoService,
    Depends(get_producto_service),
]


AdminUser = Annotated[
    Usuario,
    Depends(require_role(["admin"])),
]


@router.get(
    "",
    response_model=ProductosPaginados,
)
def listar_productos(
    service: ProductoServiceDep,
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
):
    return service.listar(
        skip=skip,
        limit=limit,
        search=search,
        categoria_id=categoria_id,
        disponible=disponible,
    )


@router.get(
    "/{id}",
    response_model=ProductoRead,
)
def obtener_producto(
    id: int,
    service: ProductoServiceDep,
):
    try:
        return service.obtener_por_id(id)

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )


@router.post(
    "",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_producto(
    data: ProductoCreate,
    service: ProductoServiceDep,
    _: AdminUser,
):
    try:
        return service.crear(data)

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )


@router.put(
    "/{id}",
    response_model=ProductoRead,
)
def actualizar_producto(
    id: int,
    data: ProductoUpdate,
    service: ProductoServiceDep,
    _: AdminUser,
):
    try:
        return service.actualizar(
            id,
            data,
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )


@router.patch(
    "/{id}/stock",
    response_model=ProductoRead,
)
def actualizar_stock(
    id: int,
    data: ProductoStockUpdate,
    service: ProductoServiceDep,
    _: AdminUser,
):
    try:
        return service.actualizar_stock(
            id,
            data,
        )

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_producto(
    id: int,
    service: ProductoServiceDep,
    _: AdminUser,
):
    try:
        service.eliminar(id)

    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )