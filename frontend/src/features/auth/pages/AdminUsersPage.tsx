import { useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'

import { useAuth, useUsers } from '@/features/auth'

import type { UsuarioAuth } from '../types/auth.types'


function AdminUsersPage() {
  const { user: currentUser } = useAuth()

  const {
    usuarios,
    isLoading,
    isError,
    activarUsuario,
    desactivarUsuario,
    activarPendiente,
    desactivarPendiente,
  } = useUsers()


  const columns =
    useMemo<ColumnDef<UsuarioAuth>[]>(
      () => [
        {
          accessorKey: 'username',
          header: 'Usuario',
        },
        {
          accessorKey: 'full_name',
          header: 'Nombre',
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'role',
          header: 'Rol',
        },
        {
          accessorKey: 'disabled',
          header: 'Estado',
          cell: ({ row }) =>
            row.original.disabled
              ? 'Desactivado'
              : 'Activo',
        },
        {
          id: 'acciones',
          header: 'Acciones',
          cell: ({ row }) => {
            const usuario = row.original

            if (usuario.id === currentUser?.id) {
              return (
                <span className="text-sm text-gray-500">
                  Usuario actual
                </span>
              )
            }

            if (usuario.disabled) {
              return (
                <button
                  type="button"
                  onClick={() =>
                    activarUsuario(usuario.id)
                  }
                  disabled={activarPendiente}
                  className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-50"
                >
                  Activar
                </button>
              )
            }

            return (
              <button
                type="button"
                onClick={() =>
                  desactivarUsuario(usuario.id)
                }
                disabled={desactivarPendiente}
                className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
              >
                Desactivar
              </button>
            )
          },
        },
      ],
      [
        currentUser?.id,
        activarUsuario,
        desactivarUsuario,
        activarPendiente,
        desactivarPendiente,
      ],
    )


  const table = useReactTable({
    data: usuarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  if (isLoading) {
    return (
      <p className="p-6">
        Cargando usuarios...
      </p>
    )
  }


  if (isError) {
    return (
      <p className="p-6 text-red-600">
        Error al cargar los usuarios.
      </p>
    )
  }


  return (
    <main className="mx-auto max-w-6xl p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Usuarios
      </h2>

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
      </div>
    </main>
  )
}


export default AdminUsersPage