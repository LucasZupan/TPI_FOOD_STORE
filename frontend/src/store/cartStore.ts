import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface CartState {
  items: CartItem[]

  agregar: (
    producto: Omit<CartItem, 'cantidad'>,
    stockMaximo: number,
  ) => void

  quitar: (
    productoId: number,
  ) => void

  cambiarCantidad: (
    productoId: number,
    cantidad: number,
    stockMaximo: number,
  ) => void

  vaciar: () => void

  total: () => number
}


export const useCartStore =
  create<CartState>()(
    persist(
      (set, get) => ({
        items: [],

        agregar: (
          producto,
          stockMaximo,
        ) => {
          if (stockMaximo <= 0) {
            return
          }

          set((state) => {
            const existente =
              state.items.find(
                (item) =>
                  item.producto_id ===
                  producto.producto_id,
              )

            if (existente) {
              if (
                existente.cantidad >=
                stockMaximo
              ) {
                return state
              }

              return {
                items: state.items.map(
                  (item) =>
                    item.producto_id ===
                    producto.producto_id
                      ? {
                          ...item,
                          cantidad:
                            item.cantidad + 1,
                        }
                      : item,
                ),
              }
            }

            return {
              items: [
                ...state.items,
                {
                  ...producto,
                  cantidad: 1,
                },
              ],
            }
          })
        },

        quitar: (productoId) => {
          set((state) => ({
            items: state.items.filter(
              (item) =>
                item.producto_id !==
                productoId,
            ),
          }))
        },

        cambiarCantidad: (
          productoId,
          cantidad,
          stockMaximo,
        ) => {
          if (cantidad <= 0) {
            get().quitar(productoId)
            return
          }

          const cantidadFinal =
            Math.min(
              cantidad,
              stockMaximo,
            )

          set((state) => ({
            items: state.items.map(
              (item) =>
                item.producto_id ===
                productoId
                  ? {
                      ...item,
                      cantidad:
                        cantidadFinal,
                    }
                  : item,
            ),
          }))
        },

        vaciar: () => {
          set({
            items: [],
          })
        },

        total: () => {
          return get().items.reduce(
            (acumulado, item) =>
              acumulado +
              item.precio_unitario *
                item.cantidad,
            0,
          )
        },
      }),

      {
        name: 'food-store-cart',

        partialize: (state) => ({
          items: state.items,
        }),
      },
    ),
  )