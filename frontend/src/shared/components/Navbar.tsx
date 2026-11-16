import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '@/features/auth'
import { Button } from '@/shared/ui/Button'
import { useCartStore } from '@/store/cartStore'


function Navbar() {
  const navigate = useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  const items = useCartStore(
    (state) => state.items,
  )

  const cantidadCarrito =
    items.reduce(
      (total, item) =>
        total + item.cantidad,
      0,
    )


  const cerrarSesion = async () => {
    await logout()

    navigate(
      '/login',
      { replace: true },
    )
  }


  const linkClass =
    'text-sm font-medium text-stone-600 transition hover:text-orange-600'


  return (
    <nav className="sticky top-0 z-40 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">

        <div className="flex flex-wrap items-center gap-5">
          <Link
            to="/"
            className="mr-2 text-2xl font-extrabold tracking-tight text-orange-600"
          >
            Food Store
          </Link>

          <Link
            to="/"
            className={linkClass}
          >
            Catálogo
          </Link>

          <Link
            to="/carrito"
            className={linkClass}
          >
            Carrito ({cantidadCarrito})
          </Link>

          {user && (
            <Link
              to="/mis-pedidos"
              className={linkClass}
            >
              Mis pedidos
            </Link>
          )}

          {user?.role === 'admin' && (
            <>
              <span className="hidden h-5 w-px bg-orange-200 lg:block" />

              <Link
                to="/admin/resumen"
                className={linkClass}
              >
                Resumen
              </Link>

              <Link
                to="/admin/categorias"
                className={linkClass}
              >
                Categorías
              </Link>

              <Link
                to="/admin/productos"
                className={linkClass}
              >
                Productos
              </Link>

              <Link
                to="/admin/pedidos"
                className={linkClass}
              >
                Pedidos
              </Link>

              <Link
                to="/admin/usuarios"
                className={linkClass}
              >
                Usuarios
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700">
                {user.full_name}
                {' · '}
                {user.role}
              </span>

              <Button
                type="button"
                variant="secondary"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={linkClass}
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}


export default Navbar