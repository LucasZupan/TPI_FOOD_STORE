import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

import type { Categoria } from '../types/categoria'


interface CategoriaListProps {
  categorias: Categoria[]
  onEdit: (categoria: Categoria) => void
  onDelete: (id: number) => void
}


export default function CategoriaList({
  categorias,
  onEdit,
  onDelete,
}: CategoriaListProps) {
  const [sorting, setSorting] =
    useState<SortingState>([])

  const [globalFilter, setGlobalFilter] =
    useState('')

  const columns =
    useMemo<ColumnDef<Categoria>[]>(
      () => [
        {
          accessorKey: 'nombre',
          header: 'Nombre',
        },
        {
          accessorKey: 'descripcion',
          header: 'Descripción',
        },
        {
          id: 'acciones',
          header: 'Acciones',
          enableSorting: false,

          cell: ({ row }) => (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() =>
                  onEdit(row.original)
                }
              >
                Editar
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={() =>
                  onDelete(row.original.id)
                }
              >
                Eliminar
              </Button>
            </div>
          ),
        },
      ],
      [onEdit, onDelete],
    )

  const table = useReactTable({
    data: categorias,
    columns,

    state: {
      sorting,
      globalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel:
      getCoreRowModel(),

    getSortedRowModel:
      getSortedRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })


  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Buscar categoría..."
        value={globalFilter}
        onChange={(event) =>
          setGlobalFilter(
            event.target.value,
          )
        }
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table
              .getHeaderGroups()
              .map((headerGroup) => (
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
                          onClick={
                            header.column.getToggleSortingHandler()
                          }
                          className="font-semibold"
                        >
                          {flexRender(
                            header.column
                              .columnDef
                              .header,
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
              ))}
          </thead>

          <tbody>
            {table
              .getRowModel()
              .rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t"
                >
                  {row
                    .getVisibleCells()
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3"
                      >
                        {flexRender(
                          cell.column
                            .columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Página{' '}
          {table.getState().pagination
            .pageIndex + 1}{' '}
          de {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={
              !table.getCanPreviousPage()
            }
            onClick={() =>
              table.previousPage()
            }
          >
            Anterior
          </Button>

          <Button
            variant="secondary"
            disabled={
              !table.getCanNextPage()
            }
            onClick={() =>
              table.nextPage()
            }
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}