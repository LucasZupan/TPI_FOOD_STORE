# Food Store

Trabajo Práctico Integrador de **Programación 4**  
Tecnicatura Universitaria en Programación — UTN

Food Store es una aplicación web para la gestión de pedidos de un negocio de comidas.

El sistema permite que los clientes puedan registrarse, iniciar sesión, navegar el catálogo, administrar un carrito, confirmar pedidos y consultar su estado.

Los usuarios con rol administrador cuentan además con un panel para gestionar categorías, productos, stock, pedidos y usuarios.

---

## Tecnologías utilizadas

### Backend

- Python 3.13
- FastAPI
- SQLModel
- SQLAlchemy
- PostgreSQL
- Psycopg
- JWT
- Cookies HttpOnly
- Pydantic Settings
- Passlib + bcrypt
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- TanStack Query
- TanStack Form
- TanStack Table
- Zustand
- React Router
- pnpm

---

## Estructura del proyecto

```text
TPI_FOOD_STORE/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── .env.example
│
└── README.md
```

El backend y el frontend son proyectos independientes y se comunican mediante una API REST.

---

# Backend

## Requisitos

- Python 3.11 a 3.13
- PostgreSQL 15 o superior
- pip

Se utilizó Python 3.13 durante el desarrollo.

---

## Crear el entorno virtual

Desde la carpeta `backend`:

```bash
py -3.13 -m venv .venv
```

En Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

Verificar la versión:

```bash
python --version
```

---

## Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## Variables de entorno

Crear el archivo:

```text
backend/.env
```

tomando como referencia:

```text
backend/.env.example
```

Variables necesarias:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/foodstore_db
SECRET_KEY=cambiar-esta-clave-de-al-menos-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173
```

La base de datos indicada en `DATABASE_URL` debe existir antes de ejecutar la aplicación.

---

## Seed inicial

Ejecutar desde `backend`:

```bash
python -m app.db.seed
```

El seed es idempotente y crea:

- usuario administrador;
- categorías iniciales;
- productos iniciales con stock.

### Usuario administrador

```text
Usuario: admin
Contraseña: Admin1234!
```

---

## Ejecutar el backend

Desde `backend`:

```bash
uvicorn app.main:app --reload
```

Servidor:

```text
http://localhost:8000
```

Documentación Swagger:

```text
http://localhost:8000/docs
```

Documentación ReDoc:

```text
http://localhost:8000/redoc
```

Todos los endpoints de la API utilizan el prefijo:

```text
/api/v1
```

---

# Frontend

## Requisitos

- Node.js 20.19 o superior
- pnpm 9 o superior

---

## Instalar dependencias

Desde la carpeta `frontend`:

```bash
pnpm install
```

---

## Variables de entorno

Crear:

```text
frontend/.env
```

tomando como referencia:

```text
frontend/.env.example
```

Contenido:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Ejecutar el frontend

```bash
pnpm dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

## Verificar el build

```bash
pnpm build
```

El proyecto utiliza TypeScript con `strict: true`.

---

# Funcionalidades

## Cliente

Un usuario puede:

- registrarse;
- iniciar y cerrar sesión;
- navegar el catálogo;
- buscar productos;
- filtrar productos por categoría;
- consultar disponibilidad y stock;
- agregar productos al carrito;
- modificar las cantidades sin superar el stock disponible;
- eliminar productos del carrito;
- confirmar un pedido;
- seleccionar forma de pago;
- indicar dirección de entrega;
- agregar notas opcionales;
- consultar sus pedidos;
- consultar el detalle de cada pedido;
- cancelar pedidos que todavía se encuentren en estado `PENDIENTE`.

El carrito se conserva en el navegador mediante Zustand Persist.

---

## Administrador

El administrador puede acceder a un panel desde el cual puede:

- consultar un resumen general;
- crear, editar y eliminar lógicamente categorías;
- crear, editar y eliminar lógicamente productos;
- modificar stock;
- modificar disponibilidad;
- consultar pedidos;
- filtrar pedidos por estado;
- avanzar pedidos según su máquina de estados;
- cancelar pedidos;
- listar usuarios;
- activar usuarios;
- desactivar usuarios.

El administrador no puede desactivarse a sí mismo.

---

# Estados de pedido

Los pedidos utilizan los siguientes estados:

```text
PENDIENTE
EN_PREPARACION
ENTREGADO
CANCELADO
```

Transiciones permitidas:

```text
PENDIENTE
├── EN_PREPARACION
└── CANCELADO

EN_PREPARACION
├── ENTREGADO
└── CANCELADO
```

`ENTREGADO` y `CANCELADO` son estados terminales.

Cuando un pedido es creado, el stock de los productos se descuenta dentro de la misma transacción.

Cuando un pedido es cancelado, el stock correspondiente se restituye.

---

# Autenticación y autorización

La autenticación utiliza JWT almacenado en una cookie:

```text
access_token
```

La cookie es `HttpOnly`, por lo que el frontend no accede ni almacena directamente el token.

Roles disponibles:

```text
user
admin
```

El backend realiza la protección efectiva de los endpoints según sesión y rol.

El frontend utiliza rutas protegidas para restringir las pantallas correspondientes.

---

# Arquitectura

## Backend

El backend utiliza arquitectura en capas por dominio:

```text
Router
  ↓
Service
  ↓
Unit of Work
  ↓
Repository
  ↓
Model
```

Los módulos principales son:

- autenticación;
- usuarios;
- categorías;
- productos;
- pedidos.

Las operaciones de categorías, productos y pedidos utilizan Unit of Work para administrar las transacciones.

El `commit`, `rollback` y cierre de sesión se gestionan desde el Unit of Work.

---

## Frontend

El frontend utiliza una arquitectura organizada por features.

```text
src/
├── features/
├── shared/
├── store/
└── routes/
```

TanStack Query administra el estado proveniente del servidor.

Zustand administra el estado del cliente, principalmente:

- sesión;
- carrito.

Axios se utiliza como cliente HTTP con:

```text
withCredentials: true
```

para permitir el envío de la cookie de autenticación.

---

# Ejecución completa

## Terminal 1 — Backend

```bash
cd backend
.venv\Scripts\Activate.ps1
python -m app.db.seed
uvicorn app.main:app --reload
```

## Terminal 2 — Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Abrir:

```text
http://localhost:5173
```

---

# Repositorio

Repositorio público de GitHub:

```text
<URL_DEL_REPOSITORIO>
```

---

# Video de demostración

Video de demostración del proyecto:

```text
https://drive.google.com/file/d/1tPtfT-ASq8Pnsfxaeycp8RaxTRzcQemR/view?usp=drive_link
```

El video muestra el funcionamiento general del sistema como cliente y como administrador.