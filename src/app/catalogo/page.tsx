import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CatalogoContent from "./catalogo-content";

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Cargando catálogo...</span>
        </div>
      }
    >
      <CatalogoContent />
    </Suspense>
  );
}
