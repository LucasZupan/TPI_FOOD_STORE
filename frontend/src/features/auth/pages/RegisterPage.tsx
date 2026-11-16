import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import axios from 'axios'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

import { useAuth } from '../hooks/useAuth'

import type {
  ApiErrorResponse,
  RegisterData,
} from '../types/auth.types'


function RegisterPage() {
  const navigate = useNavigate()

  const { register } =
    useAuth()

  const [error, setError] =
    useState('')


  const form = useForm({
    defaultValues: {
      username: '',
      full_name: '',
      email: '',
      password: '',
    },

    onSubmit: async ({ value }) => {
      setError('')

      try {
        const data: RegisterData = {
          username:
            value.username.trim(),
          full_name:
            value.full_name.trim(),
          email:
            value.email.trim(),
          password:
            value.password,
        }

        await register(data)

        navigate(
          '/login',
          { replace: true },
        )
      } catch (error: unknown) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error,
          )
        ) {
          setError(
            error.response?.data?.detail ??
              'No se pudo registrar el usuario',
          )
        } else {
          setError(
            'No se pudo registrar el usuario',
          )
        }
      }
    },
  })


  return (
    <main className="mx-auto max-w-md py-8">
      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50">

        <div className="mb-8 text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
            Food Store
          </div>

          <h1 className="text-3xl font-bold text-stone-900">
            Crear cuenta
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Registrate para poder confirmar y consultar tus pedidos.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                value.trim()
                  ? undefined
                  : 'El usuario es obligatorio',
            }}
          >
            {(field) => (
              <Input
                id="username"
                label="Usuario"
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

          <form.Field
            name="full_name"
            validators={{
              onChange: ({ value }) =>
                value.trim()
                  ? undefined
                  : 'El nombre es obligatorio',
            }}
          >
            {(field) => (
              <Input
                id="full_name"
                label="Nombre completo"
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

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                value.includes('@')
                  ? undefined
                  : 'Ingresá un email válido',
            }}
          >
            {(field) => (
              <Input
                id="email"
                label="Email"
                type="email"
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

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length >= 8
                  ? undefined
                  : 'La contraseña debe tener al menos 8 caracteres',
            }}
          >
            {(field) => (
              <Input
                id="password"
                label="Contraseña"
                type="password"
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

          {error && (
            <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
          >
            Registrarse
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          ¿Ya tenés cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  )
}


export default RegisterPage