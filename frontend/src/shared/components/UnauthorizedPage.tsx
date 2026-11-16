import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <main className="p-8 text-center">
      <h1 className="mb-3 text-2xl font-bold">
        Acceso denegado
      </h1>

      <p className="mb-4">
        No tenés permisos para acceder a esta página.
      </p>

      <Link
        to="/"
        className="text-blue-600 underline"
      >
        Volver
      </Link>
    </main>
  )
}

export default UnauthorizedPage