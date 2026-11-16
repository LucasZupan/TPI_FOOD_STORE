from sqlalchemy import func
from sqlmodel import Session, select

from app.core.repository import BaseRepository

from .model import Producto


class ProductoRepository(
    BaseRepository[Producto]
):
    def __init__(
        self,
        session: Session,
    ):
        super().__init__(
            session,
            Producto,
        )

    def get_by_id(
        self,
        id: int,
    ) -> Producto | None:
        statement = select(Producto).where(
            Producto.id == id,
            Producto.activo.is_(True),
        )

        return self.session.exec(
            statement
        ).first()

    def get_by_id_including_inactive(
    self,
    id: int,
    ) -> Producto | None:
        statement = select(Producto).where(
            Producto.id == id
        )

        return self.session.exec(
            statement
        ).first()
    
    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[int, list[Producto]]:
        condiciones = [
            Producto.activo.is_(True)
        ]

        if search:
            termino = search.strip().lower()

            condiciones.append(
                func.lower(
                    Producto.nombre
                ).contains(termino)
            )

        if categoria_id is not None:
            condiciones.append(
                Producto.categoria_id
                == categoria_id
            )

        if disponible is not None:
            condiciones.append(
                Producto.disponible
                == disponible
            )

        count_statement = (
            select(func.count())
            .select_from(Producto)
            .where(*condiciones)
        )

        total = self.session.exec(
            count_statement
        ).one()

        statement = (
            select(Producto)
            .where(*condiciones)
            .offset(skip)
            .limit(limit)
            .order_by(Producto.id)
        )

        productos = list(
            self.session.exec(
                statement
            ).all()
        )

        return int(total), productos