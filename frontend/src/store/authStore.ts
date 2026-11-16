import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import axiosInstance from '@/shared/api/axiosInstance'
import type { UsuarioAuth } from '@/features/auth/types/auth.types'

interface AuthState {
  user: UsuarioAuth | null
  checking: boolean

  login: (
    username: string,
    password: string,
  ) => Promise<void>

  logout: () => Promise<void>

  checkSession: () => Promise<void>

  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      checking: true,

      login: async (
        username,
        password,
      ) => {
        const formData =
          new URLSearchParams()

        formData.append(
          'username',
          username,
        )

        formData.append(
          'password',
          password,
        )

        await axiosInstance.post(
          '/auth/token',
          formData,
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },
          },
        )

        const response =
          await axiosInstance.get<UsuarioAuth>(
            '/auth/me',
          )

        set({
          user: response.data,
          checking: false,
        })
      },

      logout: async () => {
        try {
          await axiosInstance.post(
            '/auth/logout',
          )
        } finally {
          set({
            user: null,
            checking: false,
          })
        }
      },

      checkSession: async () => {
        set({
          checking: true,
        })

        try {
          const response =
            await axiosInstance.get<UsuarioAuth>(
              '/auth/me',
            )

          set({
            user: response.data,
            checking: false,
          })
        } catch {
          set({
            user: null,
            checking: false,
          })
        }
      },

      clearSession: () => {
        set({
          user: null,
          checking: false,
        })
      },
    }),
    {
      name: 'food-store-auth',

      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
)