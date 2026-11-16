import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from '../api/categorias'

import type {
  CategoriaInput,
} from '../types/categoria'


export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategorias,
  })
}


export function useCategoria(
  id: number,
) {
  return useQuery({
    queryKey: [
      'categoria',
      id,
    ],

    queryFn: () =>
      obtenerCategoria(id),

    enabled: id > 0,
  })
}


export function useCrearCategoria() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: crearCategoria,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categorias'],
      })
    },
  })
}


export function useActualizarCategoria() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<CategoriaInput>
    }) =>
      actualizarCategoria(
        id,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categorias'],
      })

      queryClient.invalidateQueries({
        queryKey: ['productos'],
      })
    },
  })
}


export function useEliminarCategoria() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: eliminarCategoria,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categorias'],
      })
    },
  })
}