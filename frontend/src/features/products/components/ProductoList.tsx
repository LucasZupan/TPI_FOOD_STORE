import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'

import type { Producto } from '../types/producto'


interface ProductoListProps {
  productos: Producto[]
  onEdit: (producto: Producto) => void
  onDelete: (id: number) => void
  onStock: (producto: Producto) => void
  canManage: boolean
}


function ProductoList({
  productos,
  onEdit,
  onDelete,
  onStock,
  canManage,
}: ProductoListProps) {
  const [sorting, setSorting] =
    useState<SortingState>([])

  const [globalFilter, setGlobalFilter] =
    useState('')

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })


  const columns =
    useMemo<ColumnDef<Producto>[]>(() => {
      const columnas: ColumnDef<Producto>[] = [
        {
          accessorKey: 'nombre',
          header: 'Nombre',
        },
        {
          accessorKey: 'categoria.nombre',
          header: 'Categoría',
          cell: ({ row }) =>
            row.original.categoria.nombre,
        },
        {
          accessorKey: 'descripcion',
          header: 'Descripción',
        },
        {
          accessorKey: 'precio_base',
          header: 'Precio',
          cell: ({ row }) =>
            `$${Number(
              row.original.precio_base,
            ).toFixed(2)}`,
        },
        {
          accessorKey: 'stock',
          header: 'Stock',
        },
        {
          accessorKey: 'disponible',
          header: 'Estado',
          cell: ({ row }) =>
            row.original.disponible
              ? 'Disponible'
              : 'No disponible',
        },
      ]

      if (canManage) {
        columnas.push({
          id: 'acciones',
          header: 'Acciones',
          enableSorting: false,

          cell: ({ row }) => (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onEdit(row.original)
                }
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  onStock(row.original)
                }
                className="rounded bg-amber-600 px-3 py-1 text-white"
              >
                Stock
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(row.original.id)
                }
                className="rounded bg-red-600 px-3 py-1 text-white"
              >
                Eliminar
              </button>
            </div>
          ),
        })
      }

      return columnas
    }, [
      canManage,
      onEdit,
      onDelete,
      onStock,
    ])


  const table = useReactTable({
    data: productos,
    columns,

    state: {
      sorting,
      globalFilter,
      pagination,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel:
      getPaginationRowModel(),
  })


  return (
    <div>
      <input
        value={globalFilter}
        onChange={(event) =>
          setGlobalFilter(event.target.value)
        }
        placeholder="Buscar producto..."
        className="mb-4 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 md:w-80 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />

      <div className="overflow-x-auto rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map(
              (headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left"
                      >
                        <button
                          type="button"
                          disabled={
                            !header.column.getCanSort()
                          }
                          onClick={() =>
                            header.column.toggleSorting()
                          }
                          className="font-semibold"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {header.column.getIsSorted() ===
                            'asc' && ' ↑'}

                          {header.column.getIsSorted() ===
                            'desc' && ' ↓'}
                        </button>
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
                  className="border-t dark:border-gray-700"
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

        {table.getRowModel().rows.length ===
          0 && (
          <p className="p-6 text-center text-gray-500">
            No se encontraron productos.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Página{' '}
          {table.getState().pagination.pageIndex +
            1}{' '}
          de{' '}
          {Math.max(
            table.getPageCount(),
            1,
          )}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              table.previousPage()
            }
            disabled={
              !table.getCanPreviousPage()
            }
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={() =>
              table.nextPage()
            }
            disabled={
              !table.getCanNextPage()
            }
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}


export default ProductoList