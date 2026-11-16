from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlmodel import (
    Field,
    Relationship,
    SQLModel,
)

if TYPE_CHECKING:
    from app.producto.model import Producto
    from app.usuarios.model import Usuario


class Pedido(SQLModel, table=True):
    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    usuario_id: int = Field(
        foreign_key="usuario.id",
        index=True,
    )

    estado: str = Field(
        default="PENDIENTE"
    )

    forma_pago: str

    direccion_entrega: str = Field(
        min_length=5,
        max_length=200,
    )

    notas: str | None = None

    total: float = Field(
        default=0,
        ge=0,
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(
            UTC
        )
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(
            UTC
        )
    )

    usuario: "Usuario" = Relationship(
        back_populates="pedidos"
    )

    items: list["DetallePedido"] = Relationship(
        back_populates="pedido"
    )


class DetallePedido(SQLModel, table=True):
    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    pedido_id: int = Field(
        foreign_key="pedido.id",
        index=True,
    )

    producto_id: int = Field(
        foreign_key="producto.id",
        index=True,
    )

    cantidad: int = Field(
        ge=1,
    )

    nombre_producto: str

    precio_unitario: float = Field(
        ge=0,
    )

    subtotal: float = Field(
        ge=0,
    )

    pedido: "Pedido" = Relationship(
        back_populates="items"
    )

    producto: "Producto" = Relationship(
        back_populates="detalles"
    )