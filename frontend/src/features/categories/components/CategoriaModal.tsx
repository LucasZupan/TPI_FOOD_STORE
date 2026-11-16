import { useForm } from '@tanstack/react-form'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

import type {
  Categoria,
  CategoriaInput,
} from '../types/categoria'


export type CategoriaFormData =
  CategoriaInput


interface CategoriaModalProps {
  isOpen: boolean
  categoria: Categoria | null
  onClose: () => void
  onSubmit: (
    data: CategoriaFormData,
  ) => void
  error?: string
  isPending?: boolean
}


interface CategoriaFormProps {
  categoria: Categoria | null
  onClose: () => void
  onSubmit: (
    data: CategoriaFormData,
  ) => void
  isPending: boolean
}


function CategoriaForm({
  categoria,
  onClose,
  onSubmit,
  isPending,
}: CategoriaFormProps) {
  const form = useForm({
    defaultValues: {
      nombre:
        categoria?.nombre ?? '',
      descripcion:
        categoria?.descripcion ?? '',
    },

    onSubmit: async ({ value }) => {
      onSubmit({
        nombre:
          value.nombre.trim(),

        descripcion:
          value.descripcion.trim(),
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
        name="nombre"
        validators={{
          onChange: ({ value }) => {
            const nombre =
              value.trim()

            if (nombre.length < 2) {
              return 'El nombre debe tener al menos 2 caracteres'
            }

            if (nombre.length > 100) {
              return 'El nombre no puede superar los 100 caracteres'
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
                    field.state.meta
                      .errors[0],
                  )
                : undefined
            }
          />
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <div className="space-y-1">
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>

            <textarea
              id="descripcion"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(
                  event.target.value,
                )
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
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


export default function CategoriaModal({
  isOpen,
  categoria,
  onClose,
  onSubmit,
  error,
  isPending = false,
}: CategoriaModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {categoria
            ? 'Editar categoría'
            : 'Nueva categoría'}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <CategoriaForm
          key={
            categoria?.id ??
            'nueva'
          }
          categoria={categoria}
          onClose={onClose}
          onSubmit={onSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  )
}