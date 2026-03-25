import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: number) => void;
  removeItem: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size) => {
        const existing = get().items.find(
          (i) => i.product.id === product.id && i.selectedSize === size
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.product.id === product.id && i.selectedSize === size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { product, quantity: 1, selectedSize: size }],
          }));
        }
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.selectedSize === size)
          ),
        }));
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.selectedSize === size
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (acc, i) => acc + i.product.price * i.quantity,
          0
        ),
    }),
    {
      name: "perfumeria-sur-cart",
    }
  )
);

export function buildWhatsAppMessage(items: CartItem[], phone: string): string {
  const lines = items.map(
    (i) =>
      `• ${i.quantity}x ${i.product.brand.name} - ${i.product.name} (${i.selectedSize}ml) — $${i.product.price.toLocaleString("es-CL")}`
  );
  const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const message = [
    "¡Hola! Quiero realizar el siguiente pedido:",
    "",
    ...lines,
    "",
    `*Total estimado: $${total.toLocaleString("es-CL")}*`,
    "",
    "Por favor confirmarme disponibilidad y formas de pago. ¡Muchas gracias! 🙏",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
