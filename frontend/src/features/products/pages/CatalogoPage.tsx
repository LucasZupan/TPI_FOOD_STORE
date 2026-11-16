import { useState } from 'react'

import { useCategorias } from '@/features/categories/hooks/useCategories'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Paginacion } from '@/shared/components/Paginacion'
import { Skeleton } from '@/shared/components/Skeleton'
import { Input } from '@/shared/ui/Input'

import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProducts'


const LIMITE = 6


export function CatalogoPage() {
  const [pagina, setPagina] =
    useState(0)

  const [busqueda, setBusqueda] =
    useState('')

  const [categoriaId, setCategoriaId] =
    useState<number | undefined>(
      undefined,
    )


  const productosQuery =
    useProductos({
      skip: pagina * LIMITE,
      limit: LIMITE,
      search:
        busqueda || undefined,
      categoria_id:
        categoriaId,
    })


  const categoriasQuery =
    useCategorias()


  const totalPaginas =
    Math.ceil(
      (productosQuery.data?.total ?? 0) /
        LIMITE,
    )


  const handleBusqueda = (
    valor: string,
  ) => {
    setBusqueda(valor)
    setPagina(0)
  }


  const handleCategoria = (
    valor: string,
  ) => {
    setCategoriaId(
      valor
        ? Number(valor)
        : undefined,
    )

    setPagina(0)
  }


  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">
          Catálogo
        </h1>

        <p className="mt-1 text-stone-600">
          Elegí tus productos y agregalos al carrito.
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="search"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(event) =>
            handleBusqueda(
              event.target.value,
            )
          }
        />


        <select
          value={
            categoriaId ?? ''
          }
          onChange={(event) =>
            handleCategoria(
              event.target.value,
            )
          }
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 shadow-sm outline-none transition hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">
            Todas las categorías
          </option>

          {categoriasQuery.data?.map(
            (categoria) => (
              <option
                key={categoria.id}
                value={categoria.id}
              >
                {categoria.nombre}
              </option>
            ),
          )}
        </select>
      </div>


      {productosQuery.isPending && (
        <Skeleton />
      )}


      {productosQuery.isError && (
        <EstadoError />
      )}


      {productosQuery.data &&
        productosQuery.data.items
          .length === 0 && (
          <EstadoVacio
            mensaje="No se encontraron productos."
          />
        )}


      {productosQuery.data &&
        productosQuery.data.items
          .length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productosQuery.data.items.map(
                (producto) => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                  />
                ),
              )}
            </div>

            <Paginacion
              pagina={pagina}
              totalPaginas={
                totalPaginas
              }
              onAnterior={() =>
                setPagina(
                  (actual) =>
                    Math.max(
                      actual - 1,
                      0,
                    ),
                )
              }
              onSiguiente={() =>
                setPagina(
                  (actual) =>
                    actual + 1,
                )
              }
            />
          </>
        )}
    </section>
  )
}