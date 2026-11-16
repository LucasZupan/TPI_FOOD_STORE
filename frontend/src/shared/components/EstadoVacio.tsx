interface EstadoVacioProps {
  mensaje?: string
}

export function EstadoVacio({
  mensaje = 'No hay resultados.',
}: EstadoVacioProps) {
  return (
    <div className="py-12 text-center text-gray-500">
      {mensaje}
    </div>
  )
}