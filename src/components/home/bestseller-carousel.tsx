"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function BestsellerCarousel({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [products, updateArrows]);

  const scrollByDir = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.75;
    el.scrollBy({
      left: dir === "prev" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        className={cn(
          "flex touch-pan-x gap-4 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-1",
          "-mx-4 px-4 sm:mx-0 sm:px-0",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            data-carousel-item
            className="snap-start shrink-0 w-[min(260px,calc(100vw-3rem))] sm:w-[min(240px,calc(50vw-1.5rem))] md:w-[min(260px,calc(33.333vw-1.25rem))] lg:w-[min(280px,calc(25vw-1.125rem))]"
          >
            <ProductCard product={product} priority={i < 2} />
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <div
          className="mt-4 hidden items-center justify-center gap-2 md:flex"
          role="group"
          aria-label="Navegación del carrusel"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Anterior"
            disabled={!canPrev}
            onClick={() => scrollByDir("prev")}
            className={cn(
              "size-9 rounded-full shadow-sm",
              "disabled:pointer-events-none disabled:opacity-30"
            )}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Siguiente"
            disabled={!canNext}
            onClick={() => scrollByDir("next")}
            className={cn(
              "size-9 rounded-full shadow-sm",
              "disabled:pointer-events-none disabled:opacity-30"
            )}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
