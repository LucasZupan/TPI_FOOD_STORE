import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import {
  AdminUsersPage,
  LoginPage,
  RegisterPage,
} from '@/features/auth'

import CategoriasPage from '@/features/categories/pages/CategoriasPage'
import  AdminPedidosPage  from '@/features/pedidos/pages/AdminPedidosPage'
import { AdminResumenPage } from '@/features/pedidos/pages/AdminResumenPage'
import { CarritoPage } from '@/features/pedidos/pages/CarritoPage'
import { CheckoutPage } from '@/features/pedidos/pages/CheckoutPage'
import { MisPedidosPage } from '@/features/pedidos/pages/MisPedidosPage'
import { CatalogoPage } from '@/features/products/pages/CatalogoPage'
import ProductsPage from '@/features/products/pages/ProductsPage'

import Navbar from '@/shared/components/Navbar'
import UnauthorizedPage from '@/shared/components/UnauthorizedPage'

import ProtectedRoute from './ProtectedRoute'


function AppRouter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-stone-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={<CatalogoPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/carrito"
            element={<CarritoPage />}
          />

          <Route
            path="/unauthorized"
            element={<UnauthorizedPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />

            <Route
              path="/mis-pedidos"
              element={<MisPedidosPage />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
              />
            }
          >
            <Route
              path="/admin/resumen"
              element={<AdminResumenPage />}
            />

            <Route
              path="/admin/categorias"
              element={<CategoriasPage />}
            />

            <Route
              path="/admin/productos"
              element={<ProductsPage />}
            />

            <Route
              path="/admin/pedidos"
              element={<AdminPedidosPage />}
            />

            <Route
              path="/admin/usuarios"
              element={<AdminUsersPage />}
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default AppRouter