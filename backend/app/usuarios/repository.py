from sqlalchemy import func
from sqlmodel import Session, select

from app.core.repository import BaseRepository

from .model import Usuario


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def get_by_username(
        self,
        username: str,
    ) -> Usuario | None:
        statement = select(Usuario).where(
            func.lower(Usuario.username)
            == username.strip().lower()
        )

        return self.session.exec(
            statement
        ).first()

    def get_by_email(
        self,
        email: str,
    ) -> Usuario | None:
        statement = select(Usuario).where(
            func.lower(Usuario.email)
            == email.strip().lower()
        )

        return self.session.exec(
            statement
        ).first()