import { useState } from 'react'

import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Skeleton } from '@/shared/components/Skeleton'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

import {
  useCancelarPedido,
  usePedidos,
} from '../hooks/usePedidos'


export function MisPedidosPage() {
  const [pedidoAbierto, setPedidoAbierto] =
    useState<number | null>(null)

  const pedidosQuery = usePedidos()

  const cancelarPedido =
    useCancelarPedido()


  if (pedidosQuery.isPending) {
    return <Skeleton />
  }

  if (pedidosQuery.isError) {
    return (
      <EstadoError
        mensaje="No se pudieron cargar tus pedidos."
      />
    )
  }

  const pedidos =
    pedidosQuery.data?.items ?? []

  if (pedidos.length === 0) {
    return (
      <EstadoVacio
        mensaje="Todavía no realizaste ningún pedido."
      />
    )
  }


  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Mis pedidos
        </h1>

        <p className="text-gray-600">
          Consultá el estado y detalle de tus pedidos.
        </p>
      </div>

      <div className="space-y-4">
        {pedidos.map((pedido) => {
          const abierto =
            pedidoAbierto === pedido.id

          return (
            <Card
              key={pedido.id}
              className="p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    Pedido #{pedido.id}
                  </h2>

                  <p className="text-sm text-gray-600">
                    Estado: {pedido.estado}
                  </p>

                  <p className="text-sm text-gray-600">
                    Total: $
                    {pedido.total.toLocaleString(
                      'es-AR',
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPedidoAbierto(
                        abierto
                          ? null
                          : pedido.id,
                      )
                    }
                  >
                    {abierto
                      ? 'Ocultar detalle'
                      : 'Ver detalle'}
                  </Button>

                  {pedido.estado ===
                    'PENDIENTE' && (
                    <Button
                      variant="danger"
                      disabled={
                        cancelarPedido.isPending
                      }
                      onClick={() =>
                        cancelarPedido.mutate(
                          pedido.id,
                        )
                      }
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {abierto && (
                <div className="mt-5 space-y-3 border-t pt-4">
                  <p>
                    <strong>
                      Dirección:
                    </strong>{' '}
                    {pedido.direccion_entrega}
                  </p>

                  <p>
                    <strong>
                      Forma de pago:
                    </strong>{' '}
                    {pedido.forma_pago}
                  </p>

                  {pedido.notas && (
                    <p>
                      <strong>
                        Notas:
                      </strong>{' '}
                      {pedido.notas}
                    </p>
                  )}

                  <div className="space-y-2">
                    {pedido.items.map(
                      (item) => (
                        <div
                          key={item.producto_id}
                          className="flex justify-between border-b py-2 text-sm"
                        >
                          <span>
                            {item.nombre_producto}
                            {' '}x {item.cantidad}
                          </span>

                          <span>
                            $
                            {item.subtotal.toLocaleString(
                              'es-AR',
                            )}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}