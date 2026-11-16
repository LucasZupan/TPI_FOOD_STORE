import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useCartStore } from '@/store/cartStore'

import type { Producto } from '../types/producto'


interface ProductoCardProps {
  producto: Producto
}


export function ProductoCard({
  producto,
}: ProductoCardProps) {
  const agregar = useCartStore(
    (state) => state.agregar,
  )

  const cambiarCantidad =
    useCartStore(
      (state) =>
        state.cambiarCantidad,
    )

  const itemCarrito =
    useCartStore(
      (state) =>
        state.items.find(
          (item) =>
            item.producto_id ===
            producto.id,
        ),
    )

  const cantidad =
    itemCarrito?.cantidad ?? 0

  const sinStock =
    producto.stock <= 0 ||
    !producto.disponible

  const stockMaximoAlcanzado =
    cantidad >= producto.stock


  const handleAgregar = () => {
    agregar(
      {
        producto_id: producto.id,
        nombre: producto.nombre,
        precio_unitario:
          producto.precio_base,
      },
      producto.stock,
    )
  }


  const handleRestar = () => {
    cambiarCantidad(
      producto.id,
      cantidad - 1,
      producto.stock,
    )
  }


  const handleSumar = () => {
    cambiarCantidad(
      producto.id,
      cantidad + 1,
      producto.stock,
    )
  }


  return (
    <Card className="overflow-hidden">
      <div className="flex h-52 w-full items-center justify-center overflow-hidden bg-white p-3">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="h-full w-full object-contain transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl">
              🍽️
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <p className="text-sm font-medium text-orange-600">
            {producto.categoria.nombre}
          </p>

          <h2 className="text-xl font-semibold text-stone-900">
            {producto.nombre}
          </h2>
        </div>

        <p className="min-h-10 text-sm text-stone-600">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-stone-900">
            $
            {producto.precio_base.toLocaleString(
              'es-AR',
            )}
          </p>

          <p className="text-sm text-stone-500">
            Stock: {producto.stock}
          </p>
        </div>

        {cantidad === 0 ? (
          <Button
            type="button"
            fullWidth
            disabled={sinStock}
            onClick={handleAgregar}
          >
            {sinStock
              ? 'No disponible'
              : 'Agregar al carrito'}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleRestar}
              >
                -
              </Button>

              <span className="min-w-8 text-center text-lg font-semibold">
                {cantidad}
              </span>

              <Button
                type="button"
                variant="secondary"
                onClick={handleSumar}
                disabled={
                  stockMaximoAlcanzado ||
                  sinStock
                }
              >
                +
              </Button>
            </div>

            {stockMaximoAlcanzado && (
              <p className="text-center text-sm text-stone-500">
                Máximo disponible alcanzado
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}