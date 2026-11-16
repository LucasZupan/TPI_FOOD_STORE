from datetime import UTC, datetime

from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.core.repository import BaseRepository

from .model import DetallePedido, Pedido


class PedidoRepository(
    BaseRepository[Pedido]
):
    def __init__(
        self,
        session: Session,
    ):
        super().__init__(
            session,
            Pedido,
        )

    def get_by_id(
        self,
        id: int,
    ) -> Pedido | None:
        statement = (
            select(Pedido)
            .where(Pedido.id == id)
            .options(
                selectinload(Pedido.items)
            )
        )

        return self.session.exec(
            statement
        ).first()

    def list_by_usuario(
        self,
        usuario_id: int,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[int, list[Pedido]]:
        condiciones = [
            Pedido.usuario_id == usuario_id
        ]

        if estado is not None:
            condiciones.append(
                Pedido.estado == estado
            )

        count_statement = (
            select(func.count())
            .select_from(Pedido)
            .where(*condiciones)
        )

        total = self.session.exec(
            count_statement
        ).one()

        statement = (
            select(Pedido)
            .where(*condiciones)
            .options(
                selectinload(Pedido.items)
            )
            .order_by(
                Pedido.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
        )

        pedidos = list(
            self.session.exec(
                statement
            ).all()
        )

        return int(total), pedidos

    def list_all(
        self,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[int, list[Pedido]]:
        condiciones = []

        if estado is not None:
            condiciones.append(
                Pedido.estado == estado
            )

        count_statement = (
            select(func.count())
            .select_from(Pedido)
        )

        if condiciones:
            count_statement = (
                count_statement.where(
                    *condiciones
                )
            )

        total = self.session.exec(
            count_statement
        ).one()

        statement = (
            select(Pedido)
            .options(
                selectinload(Pedido.items)
            )
            .order_by(
                Pedido.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
        )

        if condiciones:
            statement = statement.where(
                *condiciones
            )

        pedidos = list(
            self.session.exec(
                statement
            ).all()
        )

        return int(total), pedidos

    def count_by_estado(
        self,
        estado: str,
    ) -> int:
        statement = (
            select(func.count())
            .select_from(Pedido)
            .where(
                Pedido.estado == estado
            )
        )

        return int(
            self.session.exec(
                statement
            ).one()
        )

    def count_hoy(
        self,
    ) -> int:
        hoy = datetime.now(
            UTC
        ).date()

        statement = (
            select(func.count())
            .select_from(Pedido)
            .where(
                func.date(
                    Pedido.created_at
                ) == hoy
            )
        )

        return int(
            self.session.exec(
                statement
            ).one()
        )

    def add_detalle(
        self,
        detalle: DetallePedido,
    ) -> DetallePedido:
        self.session.add(detalle)
        return detalle

    def ingresos_entregados(
        self,
    ) -> float:
        statement = (
            select(
                func.coalesce(
                    func.sum(Pedido.total),
                    0,
                )
            )
            .where(
                Pedido.estado
                == "ENTREGADO"
            )
        )

        total = self.session.exec(
            statement
        ).one()

        return float(total)