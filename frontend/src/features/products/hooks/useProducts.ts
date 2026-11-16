import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  actualizarProducto,
  actualizarStock,
  crearProducto,
  eliminarProducto,
  obtenerProducto,
  obtenerProductos,
  type ProductosFiltros,
} from '../api/productos'

import type {
  ProductoInput,
  ProductoStockInput,
} from '../types/producto'


export function useProductos(
  filtros: ProductosFiltros = {},
) {
  return useQuery({
    queryKey: [
      'productos',
      filtros,
    ],

    queryFn: () =>
      obtenerProductos(filtros),
  })
}


export function useProducto(
  id: number,
) {
  return useQuery({
    queryKey: [
      'producto',
      id,
    ],

    queryFn: () =>
      obtenerProducto(id),

    enabled: id > 0,
  })
}


export function useCrearProducto() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: crearProducto,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'productos',
        ],
      })
    },
  })
}


export function useActualizarProducto() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<ProductoInput>
    }) =>
      actualizarProducto(
        id,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'productos',
        ],
      })
    },
  })
}


export function useActualizarStock() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: ProductoStockInput
    }) =>
      actualizarStock(
        id,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'productos',
        ],
      })
    },
  })
}


export function useEliminarProducto() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: eliminarProducto,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'productos',
        ],
      })
    },
  })
}