export { default as ProductsPage } from './pages/ProductsPage'

export {
  useProductos,
  useProducto,
  useCrearProducto,
  useActualizarProducto,
  useActualizarStock,
  useEliminarProducto,
} from './hooks/useProducts'

export type {
  Producto,
  ProductoInput,
  ProductoStockInput,
  ProductosPaginados,
} from './types/producto'