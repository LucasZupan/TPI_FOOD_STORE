from sqlmodel import select

from app.categoria.model import Categoria
from app.core.database import (
    create_all_tables,
    session_factory,
)
from app.core.security import hash_password
from app.pedido.model import DetallePedido, Pedido  # noqa: F401
from app.producto.model import Producto
from app.usuarios.model import Usuario

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "Admin1234!"
ADMIN_EMAIL = "admin@foodstore.com"
ADMIN_FULL_NAME = "Administrador"


def seed() -> None:
    create_all_tables()

    with session_factory() as session:
        # ADMIN
        admin = session.exec(
            select(Usuario).where(
                Usuario.username == ADMIN_USERNAME
            )
        ).first()

        if not admin:
            admin = Usuario(
                username=ADMIN_USERNAME,
                full_name=ADMIN_FULL_NAME,
                email=ADMIN_EMAIL,
                hashed_password=hash_password(
                    ADMIN_PASSWORD
                ),
                role="admin",
                disabled=False,
            )

            session.add(admin)

        # CATEGORÍAS
        categorias_data = [
            {
                "nombre": "Pizzas",
                "descripcion": "Pizzas artesanales",
            },
            {
                "nombre": "Hamburguesas",
                "descripcion": "Hamburguesas completas",
            },
            {
                "nombre": "Bebidas",
                "descripcion": "Bebidas frías",
            },
        ]

        categorias: dict[str, Categoria] = {}

        for data in categorias_data:
            categoria = session.exec(
                select(Categoria).where(
                    Categoria.nombre
                    == data["nombre"]
                )
            ).first()

            if not categoria:
                categoria = Categoria(
                    **data
                )
                session.add(categoria)
                session.flush()

            categorias[data["nombre"]] = categoria

        # PRODUCTOS
        productos_data = [
            {
                "nombre": "Pizza Muzzarella",
                "descripcion": "Salsa de tomate y muzzarella",
                "precio_base": 12000,
                "imagen_url": "",
                "stock": 20,
                "disponible": True,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Pizza Napolitana",
                "descripcion": "Muzzarella, tomate y ajo",
                "precio_base": 14000,
                "imagen_url": "",
                "stock": 15,
                "disponible": True,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Pizza Fugazzeta",
                "descripcion": "Muzzarella y cebolla",
                "precio_base": 15000,
                "imagen_url": "",
                "stock": 12,
                "disponible": True,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Hamburguesa Clásica",
                "descripcion": "Carne, queso, lechuga y tomate",
                "precio_base": 10000,
                "imagen_url": "",
                "stock": 25,
                "disponible": True,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Hamburguesa Doble",
                "descripcion": "Doble carne y doble queso",
                "precio_base": 13000,
                "imagen_url": "",
                "stock": 18,
                "disponible": True,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Hamburguesa Bacon",
                "descripcion": "Carne, cheddar y bacon",
                "precio_base": 14500,
                "imagen_url": "",
                "stock": 15,
                "disponible": True,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Coca-Cola",
                "descripcion": "Botella 500 ml",
                "precio_base": 3000,
                "imagen_url": "",
                "stock": 50,
                "disponible": True,
                "categoria": "Bebidas",
            },
            {
                "nombre": "Agua Mineral",
                "descripcion": "Botella 500 ml",
                "precio_base": 2000,
                "imagen_url": "",
                "stock": 50,
                "disponible": True,
                "categoria": "Bebidas",
            },
        ]

        for data in productos_data:
            existente = session.exec(
                select(Producto).where(
                    Producto.nombre
                    == data["nombre"]
                )
            ).first()

            if existente:
                continue

            nombre_categoria = data.pop(
                "categoria"
            )

            producto = Producto(
                **data,
                categoria_id=categorias[
                    nombre_categoria
                ].id,
            )

            session.add(producto)

        session.commit()

    print("Seed ejecutado correctamente.")
    print(
        f"Admin: {ADMIN_USERNAME} / "
        f"{ADMIN_PASSWORD}"
    )


if __name__ == "__main__":
    seed()