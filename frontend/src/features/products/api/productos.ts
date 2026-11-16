import axiosInstance from '@/shared/api/axiosInstance'

import type {
  Producto,
  ProductoInput,
  ProductosPaginados,
  ProductoStockInput,
} from '../types/producto'

export interface ProductosFiltros {
  skip?: number
  limit?: number
  search?: string
  categoria_id?: number
  disponible?: boolean
}

export async function obtenerProductos(
  filtros: ProductosFiltros = {},
): Promise<ProductosPaginados> {
  const response =
    await axiosInstance.get<ProductosPaginados>(
      '/productos',
      {
        params: filtros,
      },
    )

  return response.data
}

export async function obtenerProducto(
  id: number,
): Promise<Producto> {
  const response =
    await axiosInstance.get<Producto>(
      `/productos/${id}`,
    )

  return response.data
}

export async function crearProducto(
  data: ProductoInput,
): Promise<Producto> {
  const response =
    await axiosInstance.post<Producto>(
      '/productos',
      data,
    )

  return response.data
}

export async function actualizarProducto(
  id: number,
  data: Partial<ProductoInput>,
): Promise<Producto> {
  const response =
    await axiosInstance.put<Producto>(
      `/productos/${id}`,
      data,
    )

  return response.data
}

export async function actualizarStock(
  id: number,
  data: ProductoStockInput,
): Promise<Producto> {
  const response =
    await axiosInstance.patch<Producto>(
      `/productos/${id}/stock`,
      data,
    )

  return response.data
}

export async function eliminarProducto(
  id: number,
): Promise<void> {
  await axiosInstance.delete(
    `/productos/${id}`,
  )
}