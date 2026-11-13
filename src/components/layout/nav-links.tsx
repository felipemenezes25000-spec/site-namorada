"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Navegação horizontal (só quando o cabeçalho tem >= 68,75rem de largura; .hdr-nav em globals.css).
 * Ilha cliente mínima: usa a rota atual só para marcar aria-current="page". Abaixo disso o menu é a
 * folha (MenuSheet).
 */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="hdr-nav">
      <ul className="m-0 flex list-none items-center p-0">
        {mainNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("nav-link", item.destaque && "nav-link--destaque")}
              >
                {item.destaque && <span className="nav-dia" aria-hidden="true" />}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
