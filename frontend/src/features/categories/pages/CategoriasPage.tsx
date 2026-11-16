import { useState } from 'react'

import { handleApiError } from '@/shared/api/handleApiError'

import CategoriaList from '../components/CategoriaList'
import CategoriaModal from '../components/CategoriaModal'

import type { Categoria } from '../types/categoria'
import type { CategoriaFormData } from '../components/CategoriaModal'

import {
  useCategorias,
  useCrearCategoria,
  useActualizarCategoria,
  useEliminarCategoria,
} from '../hooks/useCategories'


function CategoriasPage() {
  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useCategorias()

  const crearMutation =
    useCrearCategoria()

  const actualizarMutation =
    useActualizarCategoria()

  const eliminarMutation =
    useEliminarCategoria()

  const [modalAbierto, setModalAbierto] =
    useState(false)

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] = useState<Categoria | null>(null)


  const cerrarModal = () => {
    setModalAbierto(false)
    setCategoriaSeleccionada(null)

    crearMutation.reset()
    actualizarMutation.reset()
  }


  const abrirModalCrear = () => {
    crearMutation.reset()
    actualizarMutation.reset()

    setCategoriaSeleccionada(null)
    setModalAbierto(true)
  }


  const abrirModalEditar = (
    categoria: Categoria,
  ) => {
    crearMutation.reset()
    actualizarMutation.reset()

    setCategoriaSeleccionada(categoria)
    setModalAbierto(true)
  }


  const handleSubmit = (
    data: CategoriaFormData,
  ) => {
    if (categoriaSeleccionada) {
      actualizarMutation.mutate(
        {
          id: categoriaSeleccionada.id,
          data,
        },
        {
          onSuccess: cerrarModal,
        },
      )

      return
    }

    crearMutation.mutate(
      data,
      {
        onSuccess: cerrarModal,
      },
    )
  }


  const handleDelete = (
    id: number,
  ) => {
    const confirmar = window.confirm(
      '¿Está seguro de que desea eliminar esta categoría?',
    )

    if (confirmar) {
      eliminarMutation.mutate(id)
    }
  }


  const mutationError =
    categoriaSeleccionada
      ? actualizarMutation.error
      : crearMutation.error

  const modalError =
    mutationError
      ? handleApiError(mutationError)
      : undefined


  if (isLoading) {
    return (
      <p className="p-6">
        Cargando categorías...
      </p>
    )
  }


  if (isError) {
    return (
      <p className="p-6 text-red-600">
        Error al cargar las categorías.
      </p>
    )
  }


  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Categorías
        </h2>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Nueva categoría
        </button>
      </div>

      <CategoriaList
        categorias={categorias}
        onEdit={abrirModalEditar}
        onDelete={handleDelete}
      />

      <CategoriaModal
        isOpen={modalAbierto}
        categoria={categoriaSeleccionada}
        onClose={cerrarModal}
        onSubmit={handleSubmit}
        error={modalError}
        isPending={
          crearMutation.isPending ||
          actualizarMutation.isPending
        }
      />
    </main>
  )
}


export default CategoriasPage