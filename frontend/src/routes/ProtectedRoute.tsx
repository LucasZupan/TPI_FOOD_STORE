import {
  Navigate,
  Outlet,
} from 'react-router-dom'

import {
  useAuth,
  type UserRole,
} from '@/features/auth'


interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}


function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const {
    user,
    checking,
  } = useAuth()


  if (checking) {
    return (
      <p className="p-6">
        Verificando sesión...
      </p>
    )
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    )
  }


  return <Outlet />
}

export default ProtectedRoute