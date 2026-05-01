import { createClient } from '@supabase/supabase-js'
import { Product, PriceRange, Gender, FilterState } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const PERFUMERIA_SUR_CLIENTE_ID = 'c204d1cf-7254-4362-8c1a-bc34ee220897'

interface InventarioItem {
  id: number
  producto: string
  cantidad: number
  precio_venta: number
  imagen: string | null
  marca: string | null
  genero: string | null
  descripcion: string | null
}

const inventarioSelect = 'id, producto, cantidad, precio_venta, imagen, marca, genero, descripcion'

export interface InventarioPageResult {
  products: Product[]
  total: number
}

export interface InventarioPageParams {
  page?: number
  pageSize?: number
  search?: string
  gender?: Gender | 'todos'
  priceRange?: PriceRange | 'todos'
  brandName?: string | null
  sortBy?: FilterState['sortBy']
}

function detectOrigin(marca: string): 'europeo' | 'arabe' | 'americano' {
  const lower = marca.toLowerCase()
  const arabBrands = ['lattafa', 'maison alhambra', 'al hambra', 'fragrance world', 'armaf', 'club de noit', 'odyssey']
  const americanBrands = ['ralph lauren', 'calvin klein', 'guess', 'polo']
  if (arabBrands.some((b) => lower.includes(b))) return 'arabe'
  if (americanBrands.some((b) => lower.includes(b))) return 'americano'
  return 'europeo'
}

function extractSize(producto: string): number {
  const match = producto.match(/(\d+)\s*ML/i)
  return match ? parseInt(match[1]) : 100
}

function normalizeBrandId(marca: string): string {
  return marca
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function mapToProduct(item: InventarioItem): Product {
  const precio = item.precio_venta
  const priceRange: PriceRange =
    precio < 30000 ? 'popular' : precio < 60000 ? 'media' : 'lujo'
  const marca = item.marca || 'Sin marca'
  const marcaId = normalizeBrandId(marca)

  return {
    id: String(item.id),
    name: item.producto,
    brand: {
      id: marcaId,
      name: marca,
      origin: detectOrigin(marca),
    },
    price: precio,
    gender: ((item.genero?.toLowerCase() || 'unisex') as Gender),
    category: 'floral',
    priceRange,
    description: item.descripcion || '',
    notes: {},
    sizes: [extractSize(item.producto)],
    images: item.imagen ? [item.imagen] : [],
    isFeatured: false,
    isBestseller: false,
    isRecommended: false,
    isNew: false,
    stock: item.cantidad,
    slug: String(item.id),
  }
}

export async function fetchInventario(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('inventario')
    .select(inventarioSelect)
    .eq('cliente_id', PERFUMERIA_SUR_CLIENTE_ID)
    .order('producto')

  if (error || !data) return []
  return data.map(mapToProduct)
}

export async function fetchInventarioBrands(): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabase
    .from('inventario')
    .select('marca')
    .eq('cliente_id', PERFUMERIA_SUR_CLIENTE_ID)
    .not('marca', 'is', null)
    .order('marca')

  if (error || !data) return []

  const seen = new Map<string, string>()
  for (const item of data) {
    const name = item.marca
    if (!name) continue
    const id = normalizeBrandId(name)
    if (!seen.has(id)) seen.set(id, name)
  }

  return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

export async function fetchInventarioPage({
  page = 1,
  pageSize = 48,
  search = '',
  gender = 'todos',
  priceRange = 'todos',
  brandName = null,
  sortBy = 'nombre',
}: InventarioPageParams = {}): Promise<InventarioPageResult> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('inventario')
    .select(inventarioSelect, { count: 'exact' })
    .eq('cliente_id', PERFUMERIA_SUR_CLIENTE_ID)

  const trimmedSearch = search.trim()
  if (trimmedSearch) {
    query = query.or(`producto.ilike.%${trimmedSearch}%,marca.ilike.%${trimmedSearch}%`)
  }

  if (gender !== 'todos') {
    query = query.or(`genero.ilike.${gender},genero.ilike.unisex`)
  }

  if (priceRange === 'popular') {
    query = query.lt('precio_venta', 30000)
  } else if (priceRange === 'media') {
    query = query.gte('precio_venta', 30000).lt('precio_venta', 60000)
  } else if (priceRange === 'lujo') {
    query = query.gte('precio_venta', 60000)
  }

  if (brandName) {
    query = query.eq('marca', brandName)
  }

  if (sortBy === 'precio-asc') {
    query = query.order('precio_venta', { ascending: true })
  } else if (sortBy === 'precio-desc') {
    query = query.order('precio_venta', { ascending: false })
  } else {
    query = query.order('producto')
  }

  const { data, error, count } = await query.range(from, to)

  if (error || !data) return { products: [], total: 0 }
  return { products: data.map(mapToProduct), total: count ?? 0 }
}

export async function fetchWomenInventario(limit = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from('inventario')
    .select(inventarioSelect)
    .eq('cliente_id', PERFUMERIA_SUR_CLIENTE_ID)
    .ilike('genero', 'mujer')
    .gt('cantidad', 0)
    .order('producto')
    .limit(limit)

  if (error || !data) return []
  return data.map(mapToProduct)
}

export async function fetchWomenSetInventario(limit = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from('inventario')
    .select(inventarioSelect)
    .eq('cliente_id', PERFUMERIA_SUR_CLIENTE_ID)
    .ilike('genero', 'mujer')
    .ilike('producto', '%set%')
    .gt('cantidad', 0)
    .order('producto')
    .limit(limit)

  if (error || !data) return []
  return data.map(mapToProduct)
}
