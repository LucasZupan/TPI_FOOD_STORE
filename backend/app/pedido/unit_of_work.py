from app.core.unit_of_work import UnitOfWork
from app.producto.repository import ProductoRepository

from .repository import PedidoRepository


class PedidoUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()

        if self.session is None:
            raise RuntimeError(
                "No se pudo crear la sesión"
            )

        self.pedidos = PedidoRepository(
            self.session
        )

        self.productos = ProductoRepository(
            self.session
        )

        return self