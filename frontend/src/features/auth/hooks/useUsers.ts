import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import axiosInstance from '@/shared/api/axiosInstance'
import { useNotificationStore } from '@/store/notificationStore'

import type { UsuarioAuth } from '../types/auth.types'


export function useUsers() {
  const queryClient = useQueryClient()

  const showNotification =
    useNotificationStore(
      (state) => state.showNotification,
    )

  const usuariosQuery = useQuery({
    queryKey: ['usuarios'],

    queryFn: async (): Promise<
      UsuarioAuth[]
    > => {
      const response =
        await axiosInstance.get<UsuarioAuth[]>(
          '/admin/usuarios',
        )

      return response.data
    },
  })

  const activarMutation = useMutation({
    mutationFn: async (id: number) => {
      const response =
        await axiosInstance.post<UsuarioAuth>(
          `/admin/usuarios/${id}/activar`,
        )

      return response.data
    },

    onSuccess: async () => {
      showNotification(
        'Usuario activado correctamente',
      )

      await queryClient.invalidateQueries({
        queryKey: ['usuarios'],
      })
    },
  })

  const desactivarMutation = useMutation({
    mutationFn: async (id: number) => {
      const response =
        await axiosInstance.post<UsuarioAuth>(
          `/admin/usuarios/${id}/desactivar`,
        )

      return response.data
    },

    onSuccess: async () => {
      showNotification(
        'Usuario desactivado correctamente',
      )

      await queryClient.invalidateQueries({
        queryKey: ['usuarios'],
      })
    },
  })

  return {
    usuarios:
      usuariosQuery.data ?? [],

    isLoading:
      usuariosQuery.isLoading,

    isError:
      usuariosQuery.isError,

    activarUsuario:
      activarMutation.mutate,

    desactivarUsuario:
      desactivarMutation.mutate,

    activarPendiente:
      activarMutation.isPending,

    desactivarPendiente:
      desactivarMutation.isPending,
  }
}