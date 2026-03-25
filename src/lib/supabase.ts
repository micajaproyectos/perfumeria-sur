import { createClient } from '@supabase/supabase-js'
import { Product, PriceRange, Gender } from '@/types'

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

function mapToProduct(item: InventarioItem): Product {
  const precio = item.precio_venta
  const priceRange: PriceRange =
    precio < 30000 ? 'popular' : precio < 60000 ? 'media' : 'lujo'
  const marca = item.marca || 'Sin marca'
  const marcaId = marca
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

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
    .select('id, producto, cantidad, precio_venta, imagen, marca, genero, descripcion')
    .eq('cliente_id', PERFUMERIA_SUR_CLIENTE_ID)
    .order('producto')

  if (error || !data) return []
  return data.map(mapToProduct)
}
