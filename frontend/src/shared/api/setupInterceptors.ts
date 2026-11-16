import type { AxiosError } from 'axios'

import axiosInstance from '@/shared/api/axiosInstance'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'


interface ApiErrorResponse {
  detail?: string
}


axiosInstance.interceptors.response.use(
  (response) => response,

  (error: AxiosError<ApiErrorResponse>) => {
    const status =
      error.response?.status

    const detail =
      error.response?.data?.detail

    const url =
      error.config?.url ?? ''

    const esLogin =
      url.includes('/auth/token')

    const esMe =
      url.includes('/auth/me')


    if (
      status === 401 &&
      !esLogin &&
      !esMe
    ) {
      useAuthStore
        .getState()
        .clearSession()
    }


    if (
      status === 400 &&
      detail ===
        'Cuenta de usuario desactivada'
    ) {
      useAuthStore
        .getState()
        .clearSession()
    }


    if (status === 403) {
      useNotificationStore
        .getState()
        .showNotification(
          'Acceso denegado',
        )
    }


    return Promise.reject(error)
  },
)