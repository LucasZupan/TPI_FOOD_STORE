import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { useCartStore } from '@/store/cartStore'

import { useCrearPedido } from '../hooks/usePedidos'
import type {
  FormaPago,
  PedidoCreate,
} from '../types/pedido'


export function CheckoutPage() {
  const navigate = useNavigate()

  const items = useCartStore(
    (state) => state.items,
  )

  const vaciar = useCartStore(
    (state) => state.vaciar,
  )

  const total = useCartStore(
    (state) => state.total,
  )

  const crearPedido = useCrearPedido()

  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: {
      direccion_entrega: '',
      forma_pago: 'EFECTIVO' as FormaPago,
      notas: '',
    },

    onSubmit: async ({ value }) => {
      setError('')

      const data: PedidoCreate = {
        items: items.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
        })),

        direccion_entrega:
          value.direccion_entrega.trim(),

        forma_pago: value.forma_pago,

        notas:
          value.notas.trim() ||
          null,
      }

      try {
        await crearPedido.mutateAsync(
          data,
        )

        vaciar()

        navigate(
          '/mis-pedidos',
          { replace: true },
        )
      } catch (error: unknown) {
        setError(
          handleApiError(error),
        )
      }
    },
  })


  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">
          Confirmar pedido
        </h1>

        <p className="text-gray-600">
          No hay productos en el carrito.
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
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Confirmar pedido
        </h1>

        <p className="text-gray-600">
          Completá los datos de entrega.
        </p>
      </div>

      <Card className="p-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field
            name="direccion_entrega"
            validators={{
              onChange: ({ value }) => {
                const direccion =
                  value.trim()

                if (
                  direccion.length < 5
                ) {
                  return 'La dirección debe tener al menos 5 caracteres'
                }

                if (
                  direccion.length > 200
                ) {
                  return 'La dirección no puede superar los 200 caracteres'
                }

                return undefined
              },
            }}
          >
            {(field) => (
              <Input
                id="direccion_entrega"
                label="Dirección de entrega"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value,
                  )
                }
                error={
                  field.state.meta.errors[0]
                    ? String(
                        field.state.meta.errors[0],
                      )
                    : undefined
                }
              />
            )}
          </form.Field>

          <form.Field
            name="forma_pago"
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor="forma_pago"
                  className="block text-sm font-medium text-gray-700"
                >
                  Forma de pago
                </label>

                <select
                  id="forma_pago"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value as FormaPago,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="EFECTIVO">
                    Efectivo
                  </option>

                  <option value="TRANSFERENCIA">
                    Transferencia
                  </option>
                </select>
              </div>
            )}
          </form.Field>

          <form.Field
            name="notas"
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor="notas"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notas
                </label>

                <textarea
                  id="notas"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Opcional"
                />
              </div>
            )}
          </form.Field>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              Total
            </p>

            <p className="text-2xl font-bold">
              $
              {total().toLocaleString(
                'es-AR',
              )}
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={
              crearPedido.isPending
            }
          >
            {crearPedido.isPending
              ? 'Confirmando...'
              : 'Confirmar pedido'}
          </Button>
        </form>
      </Card>
    </section>
  )
}