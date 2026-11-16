from app.core.unit_of_work import UnitOfWork

from .repository import CategoriaRepository


class CategoriaUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()

        if self.session is None:
            raise RuntimeError(
                "No se pudo crear la sesión"
            )

        self.categorias = CategoriaRepository(
            self.session
        )

        return self