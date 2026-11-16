from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.database import SessionDep
from app.core.dependencies import CurrentActiveUser
from app.core.security import create_access_token
from app.usuarios.schema import (
    UserCreate,
    UserPublic,
)

from .schema import MessageResponse
from .service import (
    autenticar_usuario,
    registrar_usuario,
)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Autenticación"],
)


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: UserCreate,
    session: SessionDep,
):
    return registrar_usuario(
        session,
        data,
    )


@router.post(
    "/token",
    response_model=MessageResponse,
)
def login(
    response: Response,
    session: SessionDep,
    form_data: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
):
    usuario = autenticar_usuario(
        session,
        form_data.username,
        form_data.password,
    )

    token = create_access_token(
        usuario.username
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {
        "message": "Login exitoso"
    }


@router.post(
    "/logout",
    response_model=MessageResponse,
)
def logout(
    response: Response,
):
    response.delete_cookie(
        key="access_token"
    )

    return {
        "message": "Sesión cerrada"
    }


@router.get(
    "/me",
    response_model=UserPublic,
)
def me(
    current_user: CurrentActiveUser,
):
    return current_user