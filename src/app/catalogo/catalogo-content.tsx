"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/products/product-card";
import { fetchInventarioBrands, fetchInventarioPage } from "@/lib/supabase";
import { FilterState, Gender, Product } from "@/types";
import { Separator } from "@/components/ui/separator";

const genders: { value: Gender | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
];

const sortOptions = [
  { value: "nombre", label: "Nombre A–Z" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

const CATALOG_PAGE_SIZE = 48;

const womenFilterDecorations = [
  { emoji: "🌸", className: "left-[4%] top-10 text-5xl rotate-[-12deg]" },
  { emoji: "💖", className: "right-[8%] top-24 text-4xl rotate-[10deg]" },
  { emoji: "🧴", className: "left-[18%] top-[42%] text-5xl rotate-[8deg]" },
  { emoji: "✨", className: "right-[20%] top-[48%] text-4xl rotate-[-10deg]" },
  { emoji: "💐", className: "left-[6%] bottom-16 text-6xl rotate-[8deg]" },
  { emoji: "💕", className: "right-[6%] bottom-24 text-5xl rotate-[-8deg]" },
  { emoji: "🌷", className: "left-[32%] top-20 text-3xl rotate-[12deg]" },
  { emoji: "💗", className: "right-[32%] top-14 text-3xl rotate-[-8deg]" },
  { emoji: "🌹", className: "left-[46%] top-[34%] text-4xl rotate-[-14deg]" },
  { emoji: "💞", className: "right-[42%] top-[30%] text-3xl rotate-[10deg]" },
  { emoji: "🌺", className: "left-[28%] top-[64%] text-4xl rotate-[8deg]" },
  { emoji: "💓", className: "right-[28%] top-[68%] text-3xl rotate-[-12deg]" },
  { emoji: "🌸", className: "left-[12%] top-[78%] text-4xl rotate-[14deg]" },
  { emoji: "💖", className: "right-[14%] top-[82%] text-4xl rotate-[-6deg]" },
  { emoji: "🌷", className: "left-[42%] bottom-10 text-3xl rotate-[-8deg]" },
  { emoji: "💕", className: "right-[48%] bottom-14 text-3xl rotate-[12deg]" },
  { emoji: "🌹", className: "left-[2%] top-[32%] text-3xl rotate-[10deg]" },
  { emoji: "💗", className: "right-[3%] top-[58%] text-3xl rotate-[-10deg]" },
];

const menFilterDecorations = [
  { emoji: "👓〰️", className: "left-[5%] top-12 text-5xl rotate-[-10deg]" },
  { emoji: "🎩", className: "right-[8%] top-20 text-5xl rotate-[10deg]" },
  { emoji: "👓〰️", className: "left-[22%] top-[40%] text-4xl rotate-[8deg]" },
  { emoji: "🎩", className: "right-[24%] top-[42%] text-4xl rotate-[-12deg]" },
  { emoji: "👓〰️", className: "left-[8%] bottom-20 text-5xl rotate-[12deg]" },
  { emoji: "🎩", className: "right-[7%] bottom-24 text-5xl rotate-[-8deg]" },
  { emoji: "👓〰️", className: "left-[42%] top-20 text-3xl rotate-[10deg]" },
  { emoji: "🎩", className: "right-[44%] bottom-16 text-3xl rotate-[-10deg]" },
];

function FilterPanel({
  filters,
  onChange,
  onReset,
  brands,
}: {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  brands: { id: string; name: string }[];
}) {
  const activeCount = [
    filters.gender !== "todos",
    filters.priceRange !== "todos",
    filters.brand !== "todas",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs gap-1 text-muted-foreground"
        >
          <X className="h-3 w-3" /> Limpiar filtros ({activeCount})
        </Button>
      )}

      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
          Género
        </p>
        <div className="flex flex-wrap gap-2">
          {genders.map((g) => (
            <button
              key={g.value}
              onClick={() => onChange("gender", g.value)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                filters.gender === g.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
          Rango de precio
        </p>
        <div className="flex flex-col gap-1">
          {[
            { value: "todos", label: "Todos los precios" },
            { value: "popular", label: "Económico (hasta $30.000)" },
            { value: "media", label: "Gama media ($30.000–$60.000)" },
            { value: "lujo", label: "Lujo (más de $60.000)" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => onChange("priceRange", p.value)}
              className={`text-left text-sm py-1 px-2 rounded transition-colors ${
                filters.priceRange === p.value
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
          Marca
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onChange("brand", "todas")}
            className={`text-left text-sm py-1 px-2 rounded transition-colors ${
              filters.brand === "todas"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas las marcas
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => onChange("brand", b.id)}
              className={`text-left text-sm py-1 px-2 rounded transition-colors ${
                filters.brand === b.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CatalogoContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    gender: (searchParams.get("gender") as Gender) || "todos",
    priceRange: "todos",
    brand: searchParams.get("brand") || "todas",
    sortBy: "nombre",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInventarioBrands().then(setBrands);
  }, []);

  useEffect(() => {
    let ignore = false;
    const selectedBrand =
      filters.brand === "todas"
        ? null
        : brands.find((brand) => brand.id === filters.brand);

    if (filters.brand !== "todas" && !selectedBrand) {
      if (brands.length === 0) return;
      setProducts([]);
      setTotalProducts(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchInventarioPage({
      page: currentPage,
      pageSize: CATALOG_PAGE_SIZE,
      search: filters.search,
      gender: filters.gender,
      priceRange: filters.priceRange,
      brandName: selectedBrand?.name ?? null,
      sortBy: filters.sortBy,
    }).then(({ products: pageProducts, total }) => {
      if (ignore) return;
      setProducts(pageProducts);
      setTotalProducts(total);
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [brands, currentPage, filters]);

  function handleFilterChange(key: keyof FilterState, value: string) {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setCurrentPage(1);
    setFilters({
      gender: "todos",
      priceRange: "todos",
      brand: "todas",
      sortBy: "nombre",
      search: "",
    });
  }

  const activeFiltersCount = [
    filters.gender !== "todos",
    filters.priceRange !== "todos",
    filters.brand !== "todas",
  ].filter(Boolean).length;
  const isWomenFilter = filters.gender === "mujer";
  const isMenFilter = filters.gender === "hombre";
  const activeDecorations = isWomenFilter
    ? womenFilterDecorations
    : isMenFilter
      ? menFilterDecorations
      : [];
  const totalPages = Math.max(1, Math.ceil(totalProducts / CATALOG_PAGE_SIZE));
  const visiblePage = Math.min(currentPage, totalPages);
  const pageStart = (visiblePage - 1) * CATALOG_PAGE_SIZE;
  const pageEnd = pageStart + CATALOG_PAGE_SIZE;
  const showingFrom = totalProducts === 0 ? 0 : pageStart + 1;
  const showingTo = Math.min(pageEnd, totalProducts);
  const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-navy text-cream py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-xs tracking-widest uppercase text-primary mb-1">
              Nuestra selección
            </p>
            <h1 className="font-heading text-4xl font-bold">Catálogo</h1>
          </div>
        </div>

        <section
          className={`relative overflow-hidden ${
            isWomenFilter
              ? "bg-gradient-to-br from-rose-50/70 via-background to-pink-50/60"
              : isMenFilter
                ? "bg-gradient-to-br from-slate-100/70 via-background to-stone-100/70"
              : ""
          }`}
        >
          {activeDecorations.length > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 select-none overflow-hidden"
            >
              {activeDecorations.map((item) => (
                <span
                  key={`${item.emoji}-${item.className}`}
                  className={`absolute opacity-15 blur-[0.2px] ${item.className}`}
                >
                  {item.emoji}
                </span>
              ))}
            </div>
          )}

          <div className="container mx-auto px-4 max-w-7xl py-8 relative z-10">
            <div className="flex flex-col gap-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Buscar por nombre o marca..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-9 h-10"
                />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 md:hidden">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtros
                        {activeFiltersCount > 0 && (
                          <Badge className="h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel
                          filters={filters}
                          onChange={handleFilterChange}
                          onReset={resetFilters}
                          brands={brands}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <p className="text-sm text-muted-foreground">
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Cargando...
                      </span>
                    ) : (
                      <>
                        {totalProducts}{" "}
                        {totalProducts === 1 ? "producto" : "productos"}
                      </>
                    )}
                  </p>
                </div>

                <Select
                  value={filters.sortBy}
                  onValueChange={(v) => handleFilterChange("sortBy", v)}
                >
                  <SelectTrigger className="w-[200px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-8">
              <aside className="hidden md:block w-56 shrink-0">
                <FilterPanel
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={resetFilters}
                  brands={brands}
                />
              </aside>

              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mr-3" />
                    <span>Cargando productos...</span>
                  </div>
                ) : totalProducts === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">
                      No encontramos productos
                    </p>
                    <p className="text-sm mb-4">
                      Probá con otros filtros o explorá todo el catálogo
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      Limpiar filtros
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-xs text-muted-foreground">
                      Mostrando {showingFrom}-{showingTo} de {totalProducts} productos
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                      {products.map((product, i) => (
                        <ProductCard key={product.id} product={product} priority={i < 4} />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                          Página {visiblePage} de {totalPages}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={visiblePage === 1}
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                          >
                            Anterior
                          </Button>
                          {paginationPages.map((page) => (
                            <Button
                              key={page}
                              type="button"
                              variant={visiblePage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="min-w-9"
                            >
                              {page}
                            </Button>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={visiblePage === totalPages}
                            onClick={() =>
                              setCurrentPage((page) => Math.min(totalPages, page + 1))
                            }
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
