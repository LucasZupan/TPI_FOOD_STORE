import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'

import { EstadoError } from '@/shared/components/EstadoError'
import { Skeleton } from '@/shared/components/Skeleton'
import { handleApiError } from '@/shared/api/handleApiError'

import {
  useCambiarEstadoPedido,
  usePedidos,
} from '../hooks/usePedidos'

import type {
  EstadoPedido,
  Pedido,
} from '../types/pedido'


function AdminPedidosPage() {
  const [estado, setEstado] =
    useState<EstadoPedido | ''>('')

  const pedidosQuery = usePedidos(
    0,
    100,
    estado || undefined,
  )

  const cambiarEstado =
    useCambiarEstadoPedido()


  const columns =
    useMemo<ColumnDef<Pedido>[]>(
      () => [
        {
          accessorKey: 'id',
          header: 'Pedido',
          cell: ({ row }) =>
            `#${row.original.id}`,
        },
        {
          accessorKey: 'usuario_id',
          header: 'Usuario',
          cell: ({ row }) =>
            `#${row.original.usuario_id}`,
        },
        {
          accessorKey: 'created_at',
          header: 'Fecha',
          cell: ({ row }) =>
            new Date(
              row.original.created_at,
            ).toLocaleString('es-AR'),
        },
        {
          accessorKey: 'forma_pago',
          header: 'Pago',
        },
        {
          accessorKey: 'total',
          header: 'Total',
          cell: ({ row }) =>
            `$${row.original.total.toLocaleString(
              'es-AR',
            )}`,
        },
        {
          accessorKey: 'estado',
          header: 'Estado',
        },
        {
          id: 'acciones',
          header: 'Acciones',
          cell: ({ row }) => {
            const pedido = row.original

            if (
              pedido.estado === 'ENTREGADO' ||
              pedido.estado === 'CANCELADO'
            ) {
              return (
                <span className="text-sm text-gray-500">
                  Sin acciones
                </span>
              )
            }

            if (
              pedido.estado === 'PENDIENTE'
            ) {
              return (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={
                      cambiarEstado.isPending
                    }
                    onClick={() =>
                      cambiarEstado.mutate({
                        id: pedido.id,
                        estado:
                          'EN_PREPARACION',
                      })
                    }
                    className="rounded bg-blue-600 px-3 py-1 text-white disabled:opacity-50"
                  >
                    Preparar
                  </button>

                  <button
                    type="button"
                    disabled={
                      cambiarEstado.isPending
                    }
                    onClick={() =>
                      cambiarEstado.mutate({
                        id: pedido.id,
                        estado: 'CANCELADO',
                      })
                    }
                    className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              )
            }

            return (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={
                    cambiarEstado.isPending
                  }
                  onClick={() =>
                    cambiarEstado.mutate({
                      id: pedido.id,
                      estado: 'ENTREGADO',
                    })
                  }
                  className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-50"
                >
                  Entregado
                </button>

                <button
                  type="button"
                  disabled={
                    cambiarEstado.isPending
                  }
                  onClick={() =>
                    cambiarEstado.mutate({
                      id: pedido.id,
                      estado: 'CANCELADO',
                    })
                  }
                  className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            )
          },
        },
      ],
      [
        cambiarEstado.isPending,
        cambiarEstado.mutate,
      ],
    )


  const pedidos =
    pedidosQuery.data?.items ?? []

  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  if (pedidosQuery.isPending) {
    return <Skeleton />
  }


  if (pedidosQuery.isError) {
    return (
      <EstadoError
        mensaje="No se pudieron cargar los pedidos."
      />
    )
  }


  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Pedidos
        </h1>

        <p className="text-gray-600">
          Gestioná el estado de los pedidos.
        </p>
      </div>

      <div>
        <label
          htmlFor="estado"
          className="mb-1 block font-medium"
        >
          Filtrar por estado
        </label>

        <select
          id="estado"
          value={estado}
          onChange={(event) =>
            setEstado(
              event.target
                .value as EstadoPedido | '',
            )
          }
          className="rounded border border-gray-300 bg-white px-3 py-2"
        >
          <option value="">
            Todos
          </option>

          <option value="PENDIENTE">
            Pendiente
          </option>

          <option value="EN_PREPARACION">
            En preparación
          </option>

          <option value="ENTREGADO">
            Entregado
          </option>

          <option value="CANCELADO">
            Cancelado
          </option>
        </select>
      </div>

      {cambiarEstado.isError && (
        <p className="rounded bg-red-50 p-3 text-red-700">
          {handleApiError(
            cambiarEstado.error,
          )}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(
              (headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-semibold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ),
                  )}
                </tr>
              ),
            )}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(
              (row) => (
                <tr
                  key={row.id}
                  className="border-t"
                >
                  {row.getVisibleCells().map(
                    (cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ),
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>

        {pedidos.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No hay pedidos para este estado.
          </p>
        )}
      </div>
    </main>
  )
}


export default AdminPedidosPage