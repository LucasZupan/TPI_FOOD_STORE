from typing import Annotated

from fastapi import Depends
from sqlmodel import (
    Session,
    SQLModel,
    create_engine,
)

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
)


def create_all_tables() -> None:
    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    return Session(engine)


def get_session():
    with session_factory() as session:
        yield session


SessionDep = Annotated[
    Session,
    Depends(get_session),
]