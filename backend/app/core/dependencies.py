from collections.abc import Callable
from typing import Annotated

from fastapi import (
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from app.core.database import SessionDep
from app.core.security import decode_access_token
from app.usuarios.model import Usuario
from app.usuarios.service import (
    obtener_usuario_por_username,
)


class OAuth2PasswordBearerCookie(
    OAuth2PasswordBearer
):
    async def __call__(
        self,
        request: Request,
    ) -> str:
        token = request.cookies.get(
            "access_token"
        )

        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No autenticado",
            )

        return token


oauth2_scheme = OAuth2PasswordBearerCookie(
    tokenUrl="/api/v1/auth/token"
)


TokenDep = Annotated[
    str,
    Depends(oauth2_scheme),
]


def get_current_user(
    session: SessionDep,
    token: TokenDep,
) -> Usuario:
    try:
        payload = decode_access_token(token)
        username = payload.get("sub")

        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )

    try:
        usuario = obtener_usuario_por_username(
            session,
            username,
        )

    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        )

    return usuario


CurrentUser = Annotated[
    Usuario,
    Depends(get_current_user),
]


def get_current_active_user(
    current_user: CurrentUser,
) -> Usuario:
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )

    return current_user


CurrentActiveUser = Annotated[
    Usuario,
    Depends(get_current_active_user),
]


def require_role(
    roles: list[str],
) -> Callable:
    def verificar_rol(
        current_user: CurrentActiveUser,
    ) -> Usuario:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos suficientes",
            )

        return current_user

    return verificar_rol