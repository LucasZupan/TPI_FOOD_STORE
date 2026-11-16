from .model import Categoria
from .schema import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from .unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:
    def crear(
        self,
        data: CategoriaCreate,
    ) -> CategoriaRead:
        with CategoriaUnitOfWork() as uow:
            existente = (
                uow.categorias.get_by_nombre(
                    data.nombre
                )
            )

            if existente:
                raise NombreDuplicado()

            categoria = Categoria(
                **data.model_dump()
            )

            uow.categorias.add(categoria)
            uow.flush()

            return CategoriaRead.model_validate(
                categoria
            )

    def obtener_todas(
        self,
    ) -> list[CategoriaRead]:
        with CategoriaUnitOfWork() as uow:
            categorias = (
                uow.categorias.get_all()
            )

            return [
                CategoriaRead.model_validate(
                    categoria
                )
                for categoria in categorias
            ]

    def obtener_por_id(
        self,
        id: int,
    ) -> CategoriaRead:
        with CategoriaUnitOfWork() as uow:
            categoria = (
                uow.categorias.get_by_id(id)
            )

            if not categoria:
                raise CategoriaNoEncontrada()

            return CategoriaRead.model_validate(
                categoria
            )

    def actualizar(
        self,
        id: int,
        data: CategoriaUpdate,
    ) -> CategoriaRead:
        with CategoriaUnitOfWork() as uow:
            categoria = (
                uow.categorias.get_by_id(id)
            )

            if not categoria:
                raise CategoriaNoEncontrada()

            cambios = data.model_dump(
                exclude_unset=True
            )

            nuevo_nombre = cambios.get(
                "nombre"
            )

            if nuevo_nombre is not None:
                existente = (
                    uow.categorias.get_by_nombre(
                        nuevo_nombre
                    )
                )

                if (
                    existente
                    and existente.id != id
                ):
                    raise NombreDuplicado()

            for campo, valor in cambios.items():
                setattr(
                    categoria,
                    campo,
                    valor,
                )

            uow.categorias.add(categoria)
            uow.flush()

            return CategoriaRead.model_validate(
                categoria
            )

    def eliminar(
        self,
        id: int,
    ) -> None:
        with CategoriaUnitOfWork() as uow:
            categoria = (
                uow.categorias.get_by_id(id)
            )

            if not categoria:
                raise CategoriaNoEncontrada()

            categoria.activo = False
            uow.categorias.add(categoria)


def get_categoria_service() -> CategoriaService:
    return CategoriaService()