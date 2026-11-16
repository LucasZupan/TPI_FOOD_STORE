import { Button } from '@/shared/ui/Button'

interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onAnterior: () => void
  onSiguiente: () => void
}

export function Paginacion({
  pagina,
  totalPaginas,
  onAnterior,
  onSiguiente,
}: PaginacionProps) {
  if (totalPaginas <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="secondary"
        onClick={onAnterior}
        disabled={pagina === 0}
      >
        Anterior
      </Button>

      <span>
        Página {pagina + 1} de {totalPaginas}
      </span>

      <Button
        variant="secondary"
        onClick={onSiguiente}
        disabled={
          pagina + 1 >= totalPaginas
        }
      >
        Siguiente
      </Button>
    </div>
  )
}