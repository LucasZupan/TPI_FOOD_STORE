import { EstadoError } from '@/shared/components/EstadoError'
import { Skeleton } from '@/shared/components/Skeleton'
import { Card } from '@/shared/ui/Card'

import { useResumenPedidos } from '../hooks/usePedidos'


export function AdminResumenPage() {
  const resumenQuery = useResumenPedidos()

  if (resumenQuery.isPending) {
    return <Skeleton />
  }

  if (resumenQuery.isError) {
    return (
      <EstadoError mensaje="No se pudo cargar el resumen." />
    )
  }

  const resumen = resumenQuery.data

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Resumen
        </h1>

        <p className="text-gray-600">
          Estado general de los pedidos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-gray-500">
            Pendientes
          </p>
          <p className="text-3xl font-bold">
            {resumen.pendientes}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">
            En preparación
          </p>
          <p className="text-3xl font-bold">
            {resumen.en_preparacion}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">
            Entregados
          </p>
          <p className="text-3xl font-bold">
            {resumen.entregados}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">
            Cancelados
          </p>
          <p className="text-3xl font-bold">
            {resumen.cancelados}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">
            Pedidos de hoy
          </p>
          <p className="text-3xl font-bold">
            {resumen.pedidos_hoy}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500">
            Ingresos entregados
          </p>
          <p className="text-3xl font-bold">
            $
            {resumen.ingresos_entregados.toLocaleString(
              'es-AR',
            )}
          </p>
        </Card>
      </div>
    </section>
  )
}