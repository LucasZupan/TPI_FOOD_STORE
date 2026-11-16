import axiosInstance from '@/shared/api/axiosInstance'

import type {
  Categoria,
  CategoriaInput,
} from '../types/categoria'


export async function obtenerCategorias(): Promise<
  Categoria[]
> {
  const response =
    await axiosInstance.get<Categoria[]>(
      '/categorias',
    )

  return response.data
}


export async function obtenerCategoria(
  id: number,
): Promise<Categoria> {
  const response =
    await axiosInstance.get<Categoria>(
      `/categorias/${id}`,
    )

  return response.data
}


export async function crearCategoria(
  data: CategoriaInput,
): Promise<Categoria> {
  const response =
    await axiosInstance.post<Categoria>(
      '/categorias',
      data,
    )

  return response.data
}


export async function actualizarCategoria(
  id: number,
  data: Partial<CategoriaInput>,
): Promise<Categoria> {
  const response =
    await axiosInstance.put<Categoria>(
      `/categorias/${id}`,
      data,
    )

  return response.data
}


export async function eliminarCategoria(
  id: number,
): Promise<void> {
  await axiosInstance.delete(
    `/categorias/${id}`,
  )
}