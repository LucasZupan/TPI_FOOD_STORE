from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.categoria.model import Categoria  # noqa: F401
from app.categoria.router import (
    router as categoria_router,
)
from app.core.config import settings
from app.core.database import create_all_tables
from app.pedido.model import DetallePedido, Pedido  # noqa: F401
from app.pedido.router import (
    router as pedido_router,
)
from app.producto.model import Producto  # noqa: F401
from app.producto.router import (
    router as producto_router,
)
from app.usuarios.model import Usuario  # noqa: F401
from app.usuarios.router import (
    router as usuario_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all_tables()
    yield


app = FastAPI(
    title="Food Store API",
    description=(
        "API REST del Trabajo Práctico "
        "Integrador de Programación 4"
    ),
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_ORIGIN
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(usuario_router)
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(pedido_router)


@app.get("/")
def root():
    return {
        "message": "Food Store API funcionando"
    }