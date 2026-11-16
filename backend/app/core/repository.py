from typing import Generic, TypeVar

from sqlmodel import SQLModel, Session, select


ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseRepository(Generic[ModelType]):
    def __init__(
        self,
        session: Session,
        model: type[ModelType],
    ):
        self.session = session
        self.model = model


    def get_by_id(self, id: int) -> ModelType | None:
        return self.session.get(self.model, id)


    def get_all(self) -> list[ModelType]:
        statement = select(self.model)
        return list(self.session.exec(statement).all())


    def add(self, entity: ModelType) -> ModelType:
        self.session.add(entity)
        return entity


    def delete(self, entity: ModelType) -> None:
        self.session.delete(entity)