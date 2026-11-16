from datetime import datetime

from pydantic import (
    ConfigDict,
    EmailStr,
    field_validator,
)
from sqlmodel import Field, SQLModel


class UserCreate(SQLModel):
    username: str
    full_name: str
    email: EmailStr
    password: str = Field(
        min_length=8
    )

    @field_validator(
        "username",
        "full_name",
    )
    @classmethod
    def validar_texto(
        cls,
        value: str,
    ) -> str:
        value = value.strip()

        if not value:
            raise ValueError(
                "El campo no puede estar vacío"
            )

        return value


class UserPublic(SQLModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    username: str
    full_name: str
    email: EmailStr
    role: str
    disabled: bool
    created_at: datetime