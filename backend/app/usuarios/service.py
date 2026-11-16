from fastapi import HTTPException, status
from sqlmodel import Session

from app.core.security import (
    hash_password,
    verify_password,
)

from .model import Usuario
from .schema import UserCreate
from .unit_of_work import UsuarioUnitOfWork


def registrar_usuario(
    session: Session,
    data: UserCreate,
) -> Usuario:
    with UsuarioUnitOfWork(session) as uow:
        usuario_existente = (
            uow.usuarios.get_by_username(
                data.username
            )
        )

        if usuario_existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El nombre de usuario ya existe",
            )

        email_existente = (
            uow.usuarios.get_by_email(
                str(data.email)
            )
        )

        if email_existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El email ya existe",
            )

        usuario = Usuario(
            username=data.username,
            full_name=data.full_name,
            email=str(data.email),
            hashed_password=hash_password(
                data.password
            ),
            role="user",
            disabled=False,
        )

        uow.usuarios.add(usuario)
        uow.commit()
        uow.refresh(usuario)

        return usuario


def autenticar_usuario(
    session: Session,
    username: str,
    password: str,
) -> Usuario:
    with UsuarioUnitOfWork(session) as uow:
        usuario = (
            uow.usuarios.get_by_username(
                username
            )
        )

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos",
            )

        if not verify_password(
            password,
            usuario.hashed_password,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos",
            )

        if usuario.disabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Cuenta de usuario "
                    "desactivada"
                ),
            )

        return usuario


def obtener_usuario_por_username(
    session: Session,
    username: str,
) -> Usuario:
    with UsuarioUnitOfWork(session) as uow:
        usuario = (
            uow.usuarios.get_by_username(
                username
            )
        )

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado",
            )

        return usuario


def obtener_usuarios(
    session: Session,
) -> list[Usuario]:
    with UsuarioUnitOfWork(session) as uow:
        return uow.usuarios.get_all()


def activar_usuario(
    session: Session,
    id: int,
) -> Usuario:
    with UsuarioUnitOfWork(session) as uow:
        usuario = uow.usuarios.get_by_id(id)

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado",
            )

        usuario.disabled = False

        uow.usuarios.add(usuario)
        uow.commit()
        uow.refresh(usuario)

        return usuario


def desactivar_usuario(
    session: Session,
    id: int,
    current_admin_id: int,
) -> Usuario:
    if id == current_admin_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El administrador no puede desactivarse a sí mismo",
        )

    with UsuarioUnitOfWork(session) as uow:
        usuario = uow.usuarios.get_by_id(id)

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado",
            )

        usuario.disabled = True

        uow.usuarios.add(usuario)
        uow.commit()
        uow.refresh(usuario)

        return usuario