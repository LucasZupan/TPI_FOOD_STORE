import type { Categoria } from '@/features/categories/types/categoria'

export interface Producto {
  id: number
  categoria_id: number
  nombre: string
  descripcion: string
  precio_base: number
  imagen_url: string
  stock: number
  disponible: boolean
  activo: boolean
  categoria: Categoria
}

export interface ProductosPaginados {
  total: number
  items: Producto[]
}

export interface ProductoInput {
  categoria_id: number
  nombre: string
  descripcion: string
  precio_base: number
  imagen_url: string
  stock: number
  disponible: boolean
}

export interface ProductoStockInput {
  stock: number
  disponible: boolean
}