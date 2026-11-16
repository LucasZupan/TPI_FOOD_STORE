import { useForm } from '@tanstack/react-form'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

import type {
  Producto,
  ProductoStockInput,
} from '../types/producto'


interface ProductoStockModalProps {
  producto: Producto | null
  onClose: () => void
  onSubmit: (
    data: ProductoStockInput,
  ) => void
  error?: string
  isPending?: boolean
}


export default function ProductoStockModal({
  producto,
  onClose,
  onSubmit,
  error,
  isPending = false,
}: ProductoStockModalProps) {
  const form = useForm({
    defaultValues: {
      stock:
        producto?.stock ?? 0,
      disponible:
        producto?.disponible ?? true,
    },

    onSubmit: async ({ value }) => {
      onSubmit({
        stock: value.stock,
        disponible: value.disponible,
      })
    },
  })


  if (!producto) {
    return null
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-xl font-bold">
          Stock y disponibilidad
        </h2>

        <p className="mb-4 text-gray-600">
          {producto.nombre}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="stock"
            validators={{
              onChange: ({ value }) => {
                if (value < 0) {
                  return 'El stock no puede ser negativo'
                }

                return undefined
              },
            }}
          >
            {(field) => (
              <Input
                id="stock"
                label="Stock"
                type="number"
                min="0"
                step="1"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(
                    Number(event.target.value),
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

          <form.Field name="disponible">
            {(field) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.checked,
                    )
                  }
                />

                Producto disponible
              </label>
            )}
          </form.Field>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <form.Subscribe
              selector={(state) =>
                state.canSubmit
              }
            >
              {(canSubmit) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    isPending
                  }
                >
                  {isPending
                    ? 'Guardando...'
                    : 'Guardar'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  )
}