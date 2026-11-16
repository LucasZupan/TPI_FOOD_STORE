import { useForm } from '@tanstack/react-form'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useCategorias } from '@/features/categories/hooks/useCategories'

import type {
  Producto,
  ProductoInput,
} from '../types/producto'


export type ProductoFormData =
  ProductoInput


interface ProductoModalProps {
  isOpen: boolean
  producto: Producto | null
  onClose: () => void
  onSubmit: (
    data: ProductoFormData,
  ) => void
  error?: string
  isPending?: boolean
}


interface ProductoFormProps {
  producto: Producto | null
  onClose: () => void
  onSubmit: (
    data: ProductoFormData,
  ) => void
  isPending: boolean
}


function ProductoForm({
  producto,
  onClose,
  onSubmit,
  isPending,
}: ProductoFormProps) {
  const {
    data: categorias = [],
    isLoading: cargandoCategorias,
  } = useCategorias()

  const form = useForm({
    defaultValues: {
      categoria_id:
        producto?.categoria_id ?? 0,
      nombre:
        producto?.nombre ?? '',
      descripcion:
        producto?.descripcion ?? '',
      precio_base:
        producto?.precio_base ?? 0,
      imagen_url:
        producto?.imagen_url ?? '',
      stock:
        producto?.stock ?? 0,
      disponible:
        producto?.disponible ?? true,
    },

    onSubmit: async ({ value }) => {
      onSubmit({
        categoria_id:
          value.categoria_id,
        nombre:
          value.nombre.trim(),
        descripcion:
          value.descripcion.trim(),
        precio_base:
          value.precio_base,
        imagen_url:
          value.imagen_url.trim(),
        stock:
          value.stock,
        disponible:
          value.disponible,
      })
    },
  })


  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()

        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="categoria_id"
        validators={{
          onChange: ({ value }) => {
            if (value <= 0) {
              return 'Debe seleccionar una categoría'
            }

            return undefined
          },
        }}
      >
        {(field) => (
          <div>
            <label className="mb-1 block font-medium">
              Categoría
            </label>

            <select
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(
                  Number(event.target.value),
                )
              }
              disabled={cargandoCategorias}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2"
            >
              <option value={0}>
                Seleccionar categoría
              </option>

              {categorias.map(
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

            {field.state.meta.errors[0] && (
              <p className="mt-1 text-sm text-red-600">
                {String(
                  field.state.meta.errors[0],
                )}
              </p>
            )}
          </div>
        )}
      </form.Field>


      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) => {
            if (!value.trim()) {
              return 'El nombre es obligatorio'
            }

            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="nombre"
            label="Nombre"
            value={field.state.value}
            onBlur={field.handleBlur}
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


      <form.Field name="descripcion">
        {(field) => (
          <div>
            <label className="mb-1 block font-medium">
              Descripción
            </label>

            <textarea
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(
                  event.target.value,
                )
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2"
            />
          </div>
        )}
      </form.Field>


      <form.Field
        name="precio_base"
        validators={{
          onChange: ({ value }) => {
            if (value < 0) {
              return 'El precio no puede ser negativo'
            }

            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="precio_base"
            label="Precio base"
            type="number"
            min="0"
            step="0.01"
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


      <form.Field name="imagen_url">
        {(field) => (
          <Input
            id="imagen_url"
            label="URL de imagen"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) =>
              field.handleChange(
                event.target.value,
              )
            }
          />
        )}
      </form.Field>


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

            Disponible
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
  )
}


export default function ProductoModal({
  isOpen,
  producto,
  onClose,
  onSubmit,
  error,
  isPending = false,
}: ProductoModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {producto
            ? 'Editar producto'
            : 'Nuevo producto'}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ProductoForm
          key={
            producto?.id ??
            'nuevo'
          }
          producto={producto}
          onClose={onClose}
          onSubmit={onSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  )
}