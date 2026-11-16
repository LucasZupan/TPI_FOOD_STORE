export { default as CategoriasPage } from './pages/CategoriasPage'

export {
  useCategorias,
  useCategoria,
  useCrearCategoria,
  useActualizarCategoria,
  useEliminarCategoria,
} from './hooks/useCategories'

export type {
  Categoria,
  CategoriaInput,
} from './types/categoria'