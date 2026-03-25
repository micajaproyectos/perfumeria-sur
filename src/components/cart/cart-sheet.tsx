"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore, buildWhatsAppMessage } from "@/store/cart-store";
import { formatPrice } from "@/lib/mock-data";

const WHATSAPP_PHONE = "56985660954";

export function CartSheet() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = mounted ? totalItems() : 0;
  const price = mounted ? totalPrice() : 0;

  function handleWhatsApp() {
    const url = buildWhatsAppMessage(items, WHATSAPP_PHONE);
    window.open(url, "_blank");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative !text-cream hover:!text-primary hover:!bg-white/10">
          <ShoppingBag className="h-5 w-5" />
          {total > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {total}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Mi Carrito
            {total > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {total} {total === 1 ? "producto" : "productos"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p className="text-lg font-medium">Tu carrito está vacío</p>
            <p className="text-sm text-center">
              Explora nuestro catálogo y encuentra tu fragancia perfecta
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-3"
                >
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {item.product.brand.name}
                    </p>
                    <p className="font-medium text-sm truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.selectedSize}ml
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        removeItem(item.product.id, item.selectedSize)
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 shrink-0 pb-4">
              <div className="flex justify-end items-center gap-3">
                <span className="text-muted-foreground text-sm">Subtotal</span>
                <span className="font-semibold text-base tabular-nums">{formatPrice(price)}</span>
              </div>
              <Separator />
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 h-12 text-base"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-5 w-5" />
                Ir a Pagar
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
