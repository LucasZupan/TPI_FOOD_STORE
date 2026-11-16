import axiosInstance from '@/shared/api/axiosInstance'

import type {
  EstadoPedido,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from '../types/pedido'


export async function crearPedido(
  data: PedidoCreate,
): Promise<Pedido> {
  const response =
    await axiosInstance.post<Pedido>(
      '/pedidos',
      data,
    )

  return response.data
}


export async function obtenerPedidos(
  skip = 0,
  limit = 20,
  estado?: EstadoPedido,
): Promise<PedidosPaginados> {
  const response =
    await axiosInstance.get<PedidosPaginados>(
      '/pedidos',
      {
        params: {
          skip,
          limit,
          estado,
        },
      },
    )

  return response.data
}


export async function obtenerPedido(
  id: number,
): Promise<Pedido> {
  const response =
    await axiosInstance.get<Pedido>(
      `/pedidos/${id}`,
    )

  return response.data
}


export async function cancelarPedido(
  id: number,
): Promise<Pedido> {
  const response =
    await axiosInstance.patch<Pedido>(
      `/pedidos/${id}/cancelar`,
    )

  return response.data
}


export async function cambiarEstadoPedido(
  id: number,
  estado: EstadoPedido,
): Promise<Pedido> {
  const response =
    await axiosInstance.patch<Pedido>(
      `/pedidos/${id}/estado`,
      {
        estado,
      },
    )

  return response.data
}


export async function obtenerResumenPedidos(): Promise<ResumenPedidos> {
  const response =
    await axiosInstance.get<ResumenPedidos>(
      '/pedidos/resumen',
    )

  return response.data
}