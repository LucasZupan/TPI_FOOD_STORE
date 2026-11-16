from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
)

from app.core.database import SessionDep
from app.core.dependencies import require_role

from .model import Usuario
from .schema import UserPublic
from .service import (
    activar_usuario,
    desactivar_usuario,
    obtener_usuarios,
)

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Usuarios"],
)


AdminUser = Annotated[
    Usuario,
    Depends(require_role(["admin"])),
]


@router.get(
    "/usuarios",
    response_model=list[UserPublic],
)
def listar_usuarios(
    session: SessionDep,
    _: AdminUser,
):
    return obtener_usuarios(session)


@router.post(
    "/usuarios/{id}/activar",
    response_model=UserPublic,
)
def activar(
    id: int,
    session: SessionDep,
    _: AdminUser,
):
    return activar_usuario(
        session,
        id,
    )


@router.post(
    "/usuarios/{id}/desactivar",
    response_model=UserPublic,
)
def desactivar(
    id: int,
    session: SessionDep,
    current_admin: AdminUser,
):
    return desactivar_usuario(
        session,
        id,
        current_admin.id,
    )