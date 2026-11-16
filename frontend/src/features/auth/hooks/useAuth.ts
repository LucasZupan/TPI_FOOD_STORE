import axiosInstance from '@/shared/api/axiosInstance'
import { useAuthStore } from '@/store/authStore'

import type {
  RegisterData,
} from '../types/auth.types'

export function useAuth() {
  const user = useAuthStore(
    (state) => state.user,
  )

  const checking = useAuthStore(
    (state) => state.checking,
  )

  const login = useAuthStore(
    (state) => state.login,
  )

  const logout = useAuthStore(
    (state) => state.logout,
  )

  const checkSession = useAuthStore(
    (state) => state.checkSession,
  )

  const register = async (
    data: RegisterData,
  ) => {
    await axiosInstance.post(
      '/auth/register',
      data,
    )
  }

  return {
    user,
    checking,
    login,
    logout,
    checkSession,
    register,
  }
}