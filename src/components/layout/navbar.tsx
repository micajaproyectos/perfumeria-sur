"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-navy border-b border-white/10">
      {/* Top bar */}
      <div className="border-b border-white/10 text-cream py-2 px-4 text-center text-xs tracking-widest">
        <span className="flex items-center justify-center gap-2 text-cream/60">
          <Phone className="h-3 w-3" />
          Futaleufú tienda física · Consulta por WhatsApp · Envíos a todo Chile · Perfumes 100% originales
        </span>
      </div>

      {/* Main navbar */}
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-heading text-xs font-semibold tracking-[0.35em] uppercase text-cream/70 group-hover:text-cream transition-colors">
            Perfumería
          </span>
          <span className="font-heading text-2xl font-bold tracking-[0.25em] uppercase text-primary group-hover:text-primary/80 transition-colors">
            Sur
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm tracking-wide uppercase font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-cream/70"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <CartSheet />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-cream hover:text-primary hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy">
          <ul className="flex flex-col py-4 px-6 gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block py-2 text-sm tracking-wide uppercase font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-primary"
                      : "text-cream/70"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
