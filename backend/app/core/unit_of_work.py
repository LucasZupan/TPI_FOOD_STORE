from types import TracebackType

from sqlmodel import Session, SQLModel

from app.core.database import session_factory


class UnitOfWork:
    def __init__(
        self,
        session: Session | None = None,
    ):
        self.session = session
        self._owns_session = session is None

    def __enter__(self):
        if self.session is None:
            self.session = session_factory()

        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> bool:
        if self.session is None:
            return False

        if self._owns_session:
            try:
                if exc_type is None:
                    self.session.commit()
                else:
                    self.session.rollback()
            finally:
                self.session.close()

        elif exc_type is not None:
            self.session.rollback()

        return False

    def flush(self) -> None:
        if self.session is None:
            raise RuntimeError(
                "El UnitOfWork no tiene una sesión activa"
            )

        self.session.flush()

    def refresh(
        self,
        entity: SQLModel,
    ) -> None:
        if self.session is None:
            raise RuntimeError(
                "El UnitOfWork no tiene una sesión activa"
            )

        self.session.refresh(entity)

    def commit(self) -> None:
        if self.session is None:
            raise RuntimeError(
                "El UnitOfWork no tiene una sesión activa"
            )

        self.session.commit()