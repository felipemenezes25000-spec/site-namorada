"use client";

import { usePathname } from "next/navigation";

/**
 * Link "Ir para o conteúdo". Fica no <body> ANTES da região de cookies: assim é o primeiro foco
 * e o primeiro nó do DOM (o axe só isenta o link de pular da regra "region" quando ele abre a página).
 * Não aparece no /admin, que não tem o alvo #conteudo.
 */
export function SkipLink() {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;
  return (
    <a href="#conteudo" className="skip-link">
      Ir para o conteúdo
    </a>
  );
}
