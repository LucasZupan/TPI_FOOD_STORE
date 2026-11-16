import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import axios from 'axios'

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

import { useAuth } from '../hooks/useAuth'

import type {
  ApiErrorResponse,
} from '../types/auth.types'


function LoginPage() {
  const navigate = useNavigate()

  const {
    user,
    login,
  } = useAuth()

  const [error, setError] =
    useState('')


  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },

    onSubmit: async ({ value }) => {
      setError('')

      try {
        await login(
          value.username,
          value.password,
        )

        navigate(
          '/',
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
              'Credenciales incorrectas',
          )
        } else {
          setError(
            'No se pudo iniciar sesión',
          )
        }
      }
    },
  })


  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }


  return (
    <main className="mx-auto max-w-md py-10">
      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50">

        <div className="mb-8 text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
            Food Store
          </div>

          <h1 className="text-3xl font-bold text-stone-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Ingresá a tu cuenta para continuar con tu pedido.
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
            name="password"
            validators={{
              onChange: ({ value }) =>
                value
                  ? undefined
                  : 'La contraseña es obligatoria',
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
            Ingresar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </main>
  )
}


export default LoginPage