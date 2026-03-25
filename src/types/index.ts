export type Gender = "hombre" | "mujer" | "unisex";

export type Category =
  | "citrico"
  | "dulce"
  | "amaderado"
  | "floral"
  | "oriental"
  | "acuatico"
  | "especiado"
  | "arabe";

export type PriceRange = "popular" | "media" | "lujo";

export interface Brand {
  id: string;
  name: string;
  origin: "europeo" | "arabe" | "americano";
  logoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  price: number;
  originalPrice?: number;
  gender: Gender;
  category: Category;
  priceRange: PriceRange;
  description: string;
  notes: {
    top?: string[];
    heart?: string[];
    base?: string[];
  };
  sizes: number[];
  images: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isRecommended: boolean;
  isNew: boolean;
  stock: number;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: number) => void;
  removeItem: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export interface FilterState {
  gender: Gender | "todos";
  priceRange: PriceRange | "todos";
  brand: string | "todas";
  sortBy: "precio-asc" | "precio-desc" | "nombre";
  search: string;
}
