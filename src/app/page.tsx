import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BestsellerCarousel } from "@/components/home/bestseller-carousel";
import { fetchWomenInventario, fetchWomenSetInventario } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [womenProducts, momSetProducts] = await Promise.all([
    fetchWomenInventario(12),
    fetchWomenSetInventario(12),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative text-cream overflow-hidden bg-[linear-gradient(90deg,#f5c4d1_0%,#ffe7ed_18%,#fff1f4_50%,#ffe7ed_82%,#f5c4d1_100%)]">

          {/* Imagen promocional responsive */}
          <Image
            src="/images/hero_promocion_vertical.png"
            alt=""
            width={993}
            height={1583}
            className="block w-full h-auto md:hidden"
          />
          <Image
            src="/images/hero_promocion_web.png"
            alt=""
            width={2114}
            height={744}
            priority
            className="hidden w-full h-auto md:block"
          />

          <div className="absolute inset-0 container mx-auto px-4 max-w-7xl z-10 flex items-end md:items-center pb-8 md:py-20">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 !text-black font-semibold tracking-wide gap-2"
              >
                <Link href="/catalogo">
                  Ver Catálogo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-navy py-4 overflow-hidden">
          <p className="text-center text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
            Marcas que trabajamos
          </p>
          <div className="overflow-hidden">
            <div className="animate-marquee">
              {[
                "Burberry", "Calvin Klein", "Dolce & Gabbana", "Guess 1981",
                "Hugo Boss", "Jean Paul Gaultier", "Lattafa", "Paco Rabanne",
                "Polo", "Ralph Lauren", "Yves Saint Laurent", "Armaf", "Azzaro",
                "Carolina Herrera", "Ariana Grande", "Adolfo Dominguez",
                "Bath & Body", "Victoria Secret",
                "Burberry", "Calvin Klein", "Dolce & Gabbana", "Guess 1981",
                "Hugo Boss", "Jean Paul Gaultier", "Lattafa", "Paco Rabanne",
                "Polo", "Ralph Lauren", "Yves Saint Laurent", "Armaf", "Azzaro",
                "Carolina Herrera", "Ariana Grande", "Adolfo Dominguez",
                "Bath & Body", "Victoria Secret",
              ].map((brand, i) => (
                <span key={i} className="flex items-center shrink-0">
                  <span className="font-heading text-xs font-semibold tracking-widest uppercase text-primary hover:text-white transition-colors px-6 whitespace-nowrap drop-shadow-sm">
                    {brand}
                  </span>
                  <span className="text-primary/40 text-xs">✦</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-7xl py-16 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none"
          >
            {[
              { emoji: "❤️", className: "left-[4%] top-10 text-5xl rotate-[-10deg]" },
              { emoji: "🌹", className: "right-[6%] top-12 text-6xl rotate-[10deg]" },
              { emoji: "🌹", className: "left-[12%] bottom-12 text-5xl rotate-[8deg]" },
              { emoji: "❤️", className: "right-[14%] bottom-16 text-5xl rotate-[-8deg]" },
              { emoji: "❤️", className: "left-[46%] top-16 text-3xl rotate-[12deg]" },
              { emoji: "🌹", className: "right-[42%] bottom-10 text-4xl rotate-[-12deg]" },
            ].map((item) => (
              <span
                key={`${item.emoji}-${item.className}`}
                className={`absolute opacity-10 blur-[0.2px] ${item.className}`}
              >
                {item.emoji}
              </span>
            ))}
          </div>

          <div className="relative z-10 flex flex-col gap-3 mb-8">
            <p className="text-xs tracking-widest uppercase text-primary font-semibold">
              Especial Día de la Mamá
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                  Set para Mamá 🧴❤️
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2 max-w-2xl">
                  Regálale un detalle que la haga sentirse única: sets femeninos
                  pensados para emocionar a mamá y acompañarla con una fragancia
                  inolvidable en su día. ❤️
                </p>
              </div>
              <Button asChild variant="ghost" className="gap-1 self-start md:self-auto">
                <Link href="/catalogo?gender=mujer">
                  Ver más regalos <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10">
          {momSetProducts.length > 0 ? (
            <BestsellerCarousel products={momSetProducts} />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
              <p className="font-medium">No encontramos sets de mujer disponibles por ahora.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Revisa el catálogo para descubrir otras opciones para mamá.
              </p>
            </div>
          )}
          </div>
        </section>

        {/* MÁS VENDIDOS PRINCIPAL */}
        <section className="container mx-auto px-4 max-w-7xl py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-1">
                Los favoritos de nuestros clientes
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold">
                Los Más Vendidos
              </h2>
            </div>
            <Button asChild variant="ghost" className="gap-1 hidden sm:flex">
              <Link href="/catalogo?sort=mas-vendidos">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <BestsellerCarousel products={womenProducts} />
          <div className="text-center mt-8 sm:hidden">
            <Button asChild variant="outline">
              <Link href="/catalogo?sort=mas-vendidos">
                Ver todos los más vendidos <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="border-y border-border bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl py-6">
            <div className="divide-y divide-border md:divide-y-0 grid grid-cols-1 md:grid-cols-3 md:gap-6 text-center">
              <div className="flex items-center justify-center gap-3 py-4 md:py-0">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm">100% Originales</p>
                  <p className="text-xs text-muted-foreground">
                    Garantía de autenticidad en todos los productos
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 py-4 md:py-0">
                <Truck className="h-6 w-6 text-primary shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Envíos a todo Chile</p>
                  <p className="text-xs text-muted-foreground">
                    Embalaje seguro para proteger tu fragancia
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 py-4 md:py-0">
                <Star className="h-6 w-6 text-primary shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Gran selección de fragancias</p>
                  <p className="text-xs text-muted-foreground">
                    Lujo europeo y exclusividad árabe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BANNER GÉNERO */}
        <section className="container mx-auto px-4 max-w-7xl pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/catalogo?gender=hombre"
              className="group relative bg-navy text-cream rounded-lg overflow-hidden h-48 md:h-64 flex items-end p-8 hover:shadow-xl transition-shadow"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10">
                <p className="text-xs tracking-widest uppercase text-primary mb-1">
                  Colección
                </p>
                <h3 className="font-heading text-3xl font-bold mb-2">Para Él</h3>
                <span className="text-sm text-cream/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explorar <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>

            <Link
              href="/catalogo?gender=mujer"
              className="group relative bg-muted rounded-lg overflow-hidden h-48 md:h-64 flex items-end p-8 hover:shadow-xl transition-shadow"
              style={{ background: "oklch(0.35 0.08 20)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10 text-cream">
                <p className="text-xs tracking-widest uppercase text-primary mb-1">
                  Colección
                </p>
                <h3 className="font-heading text-3xl font-bold mb-2">Para Ella</h3>
                <span className="text-sm text-cream/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explorar <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </div>
        </section>



      </main>
      <Footer />
    </>
  );
}
