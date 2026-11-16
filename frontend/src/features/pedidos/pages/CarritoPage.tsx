import { Link } from 'react-router-dom'

import { useProducto } from '@/features/products/hooks/useProducts'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import {
  useCartStore,
  type CartItem,
} from '@/store/cartStore'


interface CarritoItemProps {
  item: CartItem
}


function CarritoItem({
  item,
}: CarritoItemProps) {
  const quitar = useCartStore(
    (state) => state.quitar,
  )

  const cambiarCantidad =
    useCartStore(
      (state) =>
        state.cambiarCantidad,
    )

  const productoQuery =
    useProducto(item.producto_id)

  const producto =
    productoQuery.data

  const stockActual =
    producto?.stock ?? 0

  const disponible =
    producto?.disponible ?? false

  const puedeSumar =
    !productoQuery.isPending &&
    !productoQuery.isError &&
    disponible &&
    item.cantidad < stockActual


  const handleRestar = () => {
    const nuevaCantidad =
      item.cantidad - 1

    cambiarCantidad(
      item.producto_id,
      nuevaCantidad,
      Math.max(
        nuevaCantidad,
        stockActual,
      ),
    )
  }


  const handleSumar = () => {
    if (!puedeSumar) {
      return
    }

    cambiarCantidad(
      item.producto_id,
      item.cantidad + 1,
      stockActual,
    )
  }


  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">
            {item.nombre}
          </h2>

          <p className="text-sm text-gray-600">
            $
            {item.precio_unitario.toLocaleString(
              'es-AR',
            )}{' '}
            c/u
          </p>

          {productoQuery.isPending && (
            <p className="mt-1 text-sm text-gray-500">
              Consultando stock...
            </p>
          )}

          {producto && (
            <p className="mt-1 text-sm text-gray-500">
              Stock disponible: {stockActual}
            </p>
          )}

          {productoQuery.isError && (
            <p className="mt-1 text-sm text-red-600">
              Producto no disponible.
            </p>
          )}

          {producto &&
            item.cantidad >= stockActual && (
              <p className="mt-1 text-sm text-amber-600">
                Máximo disponible alcanzado.
              </p>
            )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleRestar}
          >
            -
          </Button>

          <span className="min-w-8 text-center font-semibold">
            {item.cantidad}
          </span>

          <Button
            variant="secondary"
            onClick={handleSumar}
            disabled={!puedeSumar}
          >
            +
          </Button>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            $
            {(
              item.precio_unitario *
              item.cantidad
            ).toLocaleString(
              'es-AR',
            )}
          </p>

          <Button
            variant="danger"
            onClick={() =>
              quitar(item.producto_id)
            }
          >
            Quitar
          </Button>
        </div>
      </div>
    </Card>
  )
}


export function CarritoPage() {
  const items = useCartStore(
    (state) => state.items,
  )

  const vaciar = useCartStore(
    (state) => state.vaciar,
  )

  const total = useCartStore(
    (state) => state.total,
  )


  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">
          Carrito
        </h1>

        <p className="text-gray-600">
          Tu carrito está vacío.
        </p>

        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          Volver al catálogo
        </Link>
      </section>
    )
  }


  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Carrito
        </h1>

        <p className="text-gray-600">
          Revisá los productos antes de confirmar tu pedido.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <CarritoItem
            key={item.producto_id}
            item={item}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <Button
          variant="secondary"
          onClick={vaciar}
        >
          Vaciar carrito
        </Button>

        <div className="text-right">
          <p className="text-sm text-gray-600">
            Total
          </p>

          <p className="text-2xl font-bold">
            $
            {total().toLocaleString(
              'es-AR',
            )}
          </p>

          <Link
            to="/checkout"
            className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Continuar
          </Link>
        </div>
      </div>
    </section>
  )
}