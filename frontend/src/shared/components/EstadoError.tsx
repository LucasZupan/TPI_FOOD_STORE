interface EstadoErrorProps {
  mensaje?: string
}

export function EstadoError({
  mensaje = 'No se pudieron cargar los datos.',
}: EstadoErrorProps) {
  return (
    <div className="rounded-lg bg-red-50 p-4 text-red-700">
      {mensaje}
    </div>
  )
}