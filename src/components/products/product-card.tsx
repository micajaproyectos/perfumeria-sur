"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/mock-data";
import { Product } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    String(product.sizes[0])
  );
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    addItem(product, Number(selectedSize));
    toast.success(`${product.name} agregado al carrito`, {
      description: `${selectedSize}ml — ${formatPrice(product.price)}`,
    });
  }

  return (
    <Dialog>
    <div
      className={cn(
        "group bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-lg hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      {/* Image area — abre el modal al hacer clic */}
      <DialogTrigger asChild>
        <div className="relative aspect-[3/4] bg-white overflow-hidden cursor-pointer">
          {/* Imagen del producto o placeholder */}
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={`${product.brand.name} ${product.name}`}
              fill
              className="object-contain object-center p-3 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Nuevo
              </Badge>
            )}
            {product.isBestseller && (
              <Badge className="bg-navy text-cream text-xs">
                Más vendido
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="destructive" className="text-xs">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Origin badge */}
          {product.brand.origin === "arabe" && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur">
                Árabe
              </Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors z-10" />
        </div>
      </DialogTrigger>

      {/* Info — el nombre también abre el modal */}
      <DialogTrigger asChild>
          <div className="p-4 flex flex-col flex-1 gap-2 cursor-pointer group/info">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {product.brand.name}
              </p>
              <div className="flex items-start justify-between gap-1 mt-0.5">
                <h3 className="font-heading font-semibold text-sm leading-tight group-hover/info:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 group-hover/info:text-primary transition-colors mt-0.5" />
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
              <span className="capitalize">{product.gender}</span>
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-base">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Size selector */}
              {product.sizes.length > 1 ? (
                <div onClick={(e) => e.stopPropagation()}>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}ml
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {product.sizes[0]}ml
                </p>
              )}

              <Button
                className="w-full h-8 text-xs gap-1.5"
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
              </Button>
            </div>
          </div>
        </DialogTrigger>

        {/* Modal de detalle */}
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              {product.brand.name}
            </p>
            <DialogTitle className="font-heading text-xl leading-tight">
              {product.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Imagen en modal */}
            {product.images[0] && (
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              </div>
            )}

            {/* Descripción */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Notas olfativas */}
            {(product.notes.top?.length || product.notes.heart?.length || product.notes.base?.length) && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Notas olfativas
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {product.notes.top?.length ? (
                    <div>
                      <p className="font-medium mb-1 text-primary">Salida</p>
                      {product.notes.top.map((n) => (
                        <p key={n} className="text-muted-foreground">{n}</p>
                      ))}
                    </div>
                  ) : null}
                  {product.notes.heart?.length ? (
                    <div>
                      <p className="font-medium mb-1 text-primary">Corazón</p>
                      {product.notes.heart.map((n) => (
                        <p key={n} className="text-muted-foreground">{n}</p>
                      ))}
                    </div>
                  ) : null}
                  {product.notes.base?.length ? (
                    <div>
                      <p className="font-medium mb-1 text-primary">Fondo</p>
                      {product.notes.base.map((n) => (
                        <p key={n} className="text-muted-foreground">{n}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Precio + tamaño + botón */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {product.sizes.map((s) => (
                    <span key={s} className="border border-border rounded px-2 py-0.5">{s}ml</span>
                  ))}
                </div>
              </div>
              <Button
                className="w-full gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-4 w-4" />
                {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
              </Button>
            </div>
          </div>
        </DialogContent>
    </div>
    </Dialog>
  );
}
