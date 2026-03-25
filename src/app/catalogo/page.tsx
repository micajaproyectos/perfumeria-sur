"use client";

import { useState, useMemo, useEffect } from "react";
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
import { fetchInventario } from "@/lib/supabase";
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

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    gender: (searchParams.get("gender") as Gender) || "todos",
    priceRange: "todos",
    brand: searchParams.get("brand") || "todas",
    sortBy: "nombre",
    search: "",
  });

  useEffect(() => {
    fetchInventario().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const brands = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const p of products) {
      if (!seen.has(p.brand.id)) {
        seen.add(p.brand.id);
        result.push({ id: p.brand.id, name: p.brand.name });
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  function handleFilterChange(key: keyof FilterState, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      gender: "todos",
      priceRange: "todos",
      brand: "todas",
      sortBy: "nombre",
      search: "",
    });
  }

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.name.toLowerCase().includes(q)
      );
    }
    if (filters.gender !== "todos") {
      result = result.filter(
        (p) => p.gender === filters.gender || p.gender === "unisex"
      );
    }
    if (filters.priceRange !== "todos") {
      result = result.filter((p) => p.priceRange === filters.priceRange);
    }
    if (filters.brand !== "todas") {
      result = result.filter((p) => p.brand.id === filters.brand);
    }

    switch (filters.sortBy) {
      case "precio-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nombre":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [filters, products]);

  const activeFiltersCount = [
    filters.gender !== "todos",
    filters.priceRange !== "todos",
    filters.brand !== "todas",
  ].filter(Boolean).length;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-navy text-cream py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-xs tracking-widest uppercase text-primary mb-1">
              Nuestra selección
            </p>
            <h1 className="font-heading text-4xl font-bold">Catálogo</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Top bar */}
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
                      {filtered.length}{" "}
                      {filtered.length === 1 ? "producto" : "productos"}
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
            {/* Desktop sidebar */}
            <aside className="hidden md:block w-56 shrink-0">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onReset={resetFilters}
                brands={brands}
              />
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mr-3" />
                  <span>Cargando productos...</span>
                </div>
              ) : filtered.length === 0 ? (
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
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} priority={i < 4} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
