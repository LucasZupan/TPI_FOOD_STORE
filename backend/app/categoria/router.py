from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)

from app.core.dependencies import require_role
from app.usuarios.model import Usuario

from .schema import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from .service import (
    CategoriaNoEncontrada,
    CategoriaService,
    NombreDuplicado,
    get_categoria_service,
)

router = APIRouter(
    prefix="/api/v1/categorias",
    tags=["Categorías"],
)


CategoriaServiceDep = Annotated[
    CategoriaService,
    Depends(get_categoria_service),
]


AdminUser = Annotated[
    Usuario,
    Depends(require_role(["admin"])),
]


@router.get(
    "",
    response_model=list[CategoriaRead],
)
def listar_categorias(
    service: CategoriaServiceDep,
):
    return service.obtener_todas()


@router.get(
    "/{id}",
    response_model=CategoriaRead,
)
def obtener_categoria(
    id: int,
    service: CategoriaServiceDep,
):
    try:
        return service.obtener_por_id(id)

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )


@router.post(
    "",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_categoria(
    data: CategoriaCreate,
    service: CategoriaServiceDep,
    _: AdminUser,
):
    try:
        return service.crear(data)

    except NombreDuplicado:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una categoría con ese nombre",
        )


@router.put(
    "/{id}",
    response_model=CategoriaRead,
)
def actualizar_categoria(
    id: int,
    data: CategoriaUpdate,
    service: CategoriaServiceDep,
    _: AdminUser,
):
    try:
        return service.actualizar(
            id,
            data,
        )

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )

    except NombreDuplicado:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una categoría con ese nombre",
        )


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_categoria(
    id: int,
    service: CategoriaServiceDep,
    _: AdminUser,
):
    try:
        service.eliminar(id)

    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )