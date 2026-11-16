import { useState } from 'react'

import { handleApiError } from '@/shared/api/handleApiError'

import ProductoList from '../components/ProductoList'
import ProductoModal from '../components/ProductoModal'
import ProductoStockModal from '../components/ProductoStockModal'

import type {
  Producto,
  ProductoStockInput,
} from '../types/producto'

import type { ProductoFormData } from '../components/ProductoModal'

import {
  useProductos,
  useCrearProducto,
  useActualizarProducto,
  useActualizarStock,
  useEliminarProducto,
} from '../hooks/useProducts'


function ProductsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useProductos({
    limit: 100,
  })

  const productos =
    data?.items ?? []

  const crearMutation =
    useCrearProducto()

  const actualizarMutation =
    useActualizarProducto()

  const stockMutation =
    useActualizarStock()

  const eliminarMutation =
    useEliminarProducto()


  const [modalAbierto, setModalAbierto] =
    useState(false)

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState<Producto | null>(null)

  const [
    productoStock,
    setProductoStock,
  ] = useState<Producto | null>(null)


  const cerrarModal = () => {
    setModalAbierto(false)
    setProductoSeleccionado(null)

    crearMutation.reset()
    actualizarMutation.reset()
  }


  const abrirModalCrear = () => {
    crearMutation.reset()
    actualizarMutation.reset()

    setProductoSeleccionado(null)
    setModalAbierto(true)
  }


  const abrirModalEditar = (
    producto: Producto,
  ) => {
    crearMutation.reset()
    actualizarMutation.reset()

    setProductoSeleccionado(producto)
    setModalAbierto(true)
  }


  const abrirModalStock = (
    producto: Producto,
  ) => {
    stockMutation.reset()
    setProductoStock(producto)
  }


  const cerrarModalStock = () => {
    stockMutation.reset()
    setProductoStock(null)
  }


  const handleSubmit = (
    data: ProductoFormData,
  ) => {
    if (productoSeleccionado) {
      actualizarMutation.mutate(
        {
          id: productoSeleccionado.id,
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


  const handleStockSubmit = (
    data: ProductoStockInput,
  ) => {
    if (!productoStock) {
      return
    }

    stockMutation.mutate(
      {
        id: productoStock.id,
        data,
      },
      {
        onSuccess: cerrarModalStock,
      },
    )
  }


  const handleDelete = (
    id: number,
  ) => {
    const confirmar =
      window.confirm(
        '¿Está seguro de que desea eliminar este producto?',
      )

    if (confirmar) {
      eliminarMutation.mutate(id)
    }
  }


  const mutationError =
    productoSeleccionado
      ? actualizarMutation.error
      : crearMutation.error

  const modalError =
    mutationError
      ? handleApiError(mutationError)
      : undefined

  const stockError =
    stockMutation.error
      ? handleApiError(stockMutation.error)
      : undefined


  if (isLoading) {
    return (
      <p className="p-6">
        Cargando productos...
      </p>
    )
  }


  if (isError) {
    return (
      <p className="p-6 text-red-600">
        Error al cargar los productos.
      </p>
    )
  }


  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Productos
        </h2>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Nuevo producto
        </button>
      </div>

      <ProductoList
        productos={productos}
        onEdit={abrirModalEditar}
        onStock={abrirModalStock}
        onDelete={handleDelete}
        canManage
      />

      <ProductoModal
        isOpen={modalAbierto}
        producto={productoSeleccionado}
        onClose={cerrarModal}
        onSubmit={handleSubmit}
        error={modalError}
        isPending={
          crearMutation.isPending ||
          actualizarMutation.isPending
        }
      />

      {productoStock && (
        <ProductoStockModal
          key={productoStock.id}
          producto={productoStock}
          onClose={cerrarModalStock}
          onSubmit={handleStockSubmit}
          error={stockError}
          isPending={stockMutation.isPending}
        />
      )}
    </main>
  )
}


export default ProductsPage