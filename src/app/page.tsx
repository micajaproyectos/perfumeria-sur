import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { bestsellerProducts } from "@/lib/mock-data";
import { BestsellerCarousel } from "@/components/home/bestseller-carousel";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative bg-navy text-cream overflow-hidden min-h-[85vh] flex items-center">

          {/* Video de fondo */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero_video.mp4" type="video/mp4" />
          </video>

          {/* Overlay oscuro para legibilidad del texto */}
          <div className="absolute inset-0 bg-black/55" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10 pt-20 pb-28 md:py-20">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="border-primary/50 text-primary mb-6 tracking-widest text-xs"
              >
                Perfumes 100% Originales
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-6">
                Las mejores fragancias
                <span className="text-primary"> del mundo, </span>
                en el sur.
              </h1>
              <p className="text-cream/70 text-lg leading-relaxed mb-8 max-w-lg">
                Descubre nuestra colección de perfumes de lujo y árabes para
                hombre y mujer. Marcas exclusivas, precios accesibles,
                autenticidad garantizada.
              </p>
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
          </div>

          {/* Decorative text */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
            <p className="font-heading text-[120px] font-bold text-white/3 leading-none select-none">
              SUR
            </p>
          </div>

          {/* Marcas — marquee strip */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 py-4 overflow-hidden bg-black/40 backdrop-blur-sm">
            <p className="text-center text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
              Marcas que trabajamos
            </p>
            <div className="overflow-hidden">
              <div className="animate-marquee">
                {[
                  "Burberry", "Calvin Klein", "Dolce & Gabbana", "Guess 1981",
                  "Hugo Boss", "Jean Paul Gaultier", "Lattafa", "Paco Rabanne",
                  "Polo", "Ralph Lauren", "Yves Saint Laurent", "Armaf", "Azzaro",
                  "Burberry", "Calvin Klein", "Dolce & Gabbana", "Guess 1981",
                  "Hugo Boss", "Jean Paul Gaultier", "Lattafa", "Paco Rabanne",
                  "Polo", "Ralph Lauren", "Yves Saint Laurent", "Armaf", "Azzaro",
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
          <BestsellerCarousel products={bestsellerProducts.slice(0, 8)} />
          <div className="text-center mt-8 sm:hidden">
            <Button asChild variant="outline">
              <Link href="/catalogo?sort=mas-vendidos">
                Ver todos los más vendidos <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
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



        {/* BANNER VIP WHATSAPP */}
        <section className="relative overflow-hidden bg-[#0a1a0f] text-white py-12">
          {/* Fondo con gradiente verde oscuro */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0f] via-[#0d2416] to-[#071210]" />

          {/* Orbe verde decorativo */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-green-600/20 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-green-500/15 blur-[80px]" />

          {/* Patrón de puntos */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

              {/* Izquierda — texto */}
              <div>
                <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-full px-4 py-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">
                    Grupo exclusivo
                  </span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-3">
                  Accede a ofertas
                  <span className="block text-green-400"> que nadie más</span>
                  verá.
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Únete a nuestro grupo VIP de WhatsApp y recibe promociones
                  exclusivas, preventas y descuentos especiales directamente
                  en tu celular, antes que nadie.
                </p>
                <a
                  href="https://chat.whatsapp.com/GTDmLc66gdN67gTWY1y98m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 transition-colors text-white font-semibold px-8 py-4 rounded-full text-base shadow-lg shadow-green-900/40"
                >
                  <MessageCircle className="h-5 w-5" />
                  Unirme al grupo VIP
                </a>
              </div>

              {/* Derecha — beneficios */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: "🏷️", title: "Descuentos exclusivos", desc: "Precios especiales solo para miembros del grupo" },
                  { icon: "⚡", title: "Preventas anticipadas", desc: "Accede a nuevos productos antes del lanzamiento" },
                  { icon: "🎁", title: "Sorteos y regalos", desc: "Participas automáticamente en todos nuestros sorteos" },
                  { icon: "📦", title: "Stock prioritario", desc: "Reserva productos antes de que se agoten" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 bg-white/5 border border-white/8 rounded-xl px-5 py-4 hover:bg-white/8 transition-colors"
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-white">{item.title}</p>
                      <p className="text-xs text-white/50 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
