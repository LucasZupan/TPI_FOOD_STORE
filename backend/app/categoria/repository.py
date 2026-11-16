from sqlalchemy import func
from sqlmodel import Session, select

from app.core.repository import BaseRepository

from .model import Categoria


class CategoriaRepository(
    BaseRepository[Categoria]
):
    def __init__(
        self,
        session: Session,
    ):
        super().__init__(
            session,
            Categoria,
        )

    def get_by_id(
        self,
        id: int,
    ) -> Categoria | None:
        statement = select(Categoria).where(
            Categoria.id == id,
            Categoria.activo.is_(True),
        )

        return self.session.exec(
            statement
        ).first()

    def get_all(
        self,
    ) -> list[Categoria]:
        statement = select(Categoria).where(
            Categoria.activo.is_(True)
        )

        return list(
            self.session.exec(statement).all()
        )

    def get_by_nombre(
        self,
        nombre: str,
    ) -> Categoria | None:
        statement = select(Categoria).where(
            func.lower(Categoria.nombre)
            == nombre.strip().lower()
        )

        return self.session.exec(
            statement
        ).first()