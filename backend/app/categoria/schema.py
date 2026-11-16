from pydantic import (
    ConfigDict,
    field_validator,
)
from sqlmodel import Field, SQLModel


class CategoriaCreate(SQLModel):
    nombre: str = Field(
        min_length=2,
        max_length=100,
    )
    descripcion: str = ""

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(
        cls,
        value: str,
    ) -> str:
        return value.strip()

    @field_validator("descripcion")
    @classmethod
    def limpiar_descripcion(
        cls,
        value: str,
    ) -> str:
        return value.strip()


class CategoriaUpdate(SQLModel):
    nombre: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    descripcion: str | None = None

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(
        cls,
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return value.strip()

    @field_validator("descripcion")
    @classmethod
    def limpiar_descripcion(
        cls,
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        return value.strip()


class CategoriaRead(SQLModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    nombre: str
    descripcion: str
    activo: bool