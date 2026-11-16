import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  cambiarEstadoPedido,
  cancelarPedido,
  crearPedido,
  obtenerPedido,
  obtenerPedidos,
  obtenerResumenPedidos,
} from '../api/pedidos'

import type {
  EstadoPedido,
  PedidoCreate,
} from '../types/pedido'


export function usePedidos(
  skip = 0,
  limit = 20,
  estado?: EstadoPedido,
) {
  return useQuery({
    queryKey: [
      'pedidos',
      skip,
      limit,
      estado,
    ],

    queryFn: () =>
      obtenerPedidos(
        skip,
        limit,
        estado,
      ),
  })
}


export function usePedido(
  id: number,
) {
  return useQuery({
    queryKey: [
      'pedido',
      id,
    ],

    queryFn: () =>
      obtenerPedido(id),

    enabled: id > 0,
  })
}


export function useCrearPedido() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (
      data: PedidoCreate,
    ) =>
      crearPedido(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      })

      queryClient.invalidateQueries({
        queryKey: ['productos'],
      })

      queryClient.invalidateQueries({
        queryKey: ['resumen-pedidos'],
      })
    },
  })
}


export function useCancelarPedido() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (
      id: number,
    ) =>
      cancelarPedido(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      })

      queryClient.invalidateQueries({
        queryKey: ['productos'],
      })

      queryClient.invalidateQueries({
        queryKey: ['resumen-pedidos'],
      })
    },
  })
}


export function useCambiarEstadoPedido() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      estado,
    }: {
      id: number
      estado: EstadoPedido
    }) =>
      cambiarEstadoPedido(
        id,
        estado,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      })

      queryClient.invalidateQueries({
        queryKey: ['productos'],
      })

      queryClient.invalidateQueries({
        queryKey: ['resumen-pedidos'],
      })
    },
  })
}


export function useResumenPedidos() {
  return useQuery({
    queryKey: [
      'resumen-pedidos',
    ],

    queryFn:
      obtenerResumenPedidos,
  })
}