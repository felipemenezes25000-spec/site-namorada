"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { mainNav, supportNav, localeTexto } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { PhoneCTA } from "@/components/ui/cta";
import { RouteAgendarCTA, RouteWhatsAppCTA } from "./route-ctas";
import { CloseIcon } from "@/components/ui/icons";

/**
 * Menu em folha (cabeçalho com menos de 68,75rem de largura útil; DESIGN.md 4.3). <dialog> modal nativo: foco preso,
 * Esc fecha, o resto da página fica inerte, o foco volta ao botão ao fechar.
 * Fecha ao navegar e ao ampliar a janela para o desktop.
 */
export function MenuSheet() {
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Fechou por causa de uma navegação: o foco vai para a página nova, não de volta ao "Menu". */
  const navegou = useRef(false);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    const d = ref.current;
    if (d?.open) d.close();
  }, []);

  const show = () => {
    const d = ref.current;
    if (!d || d.open) return;
    navegou.current = false;
    d.showModal();
    setOpen(true);
    // o primeiro foco vai para "Fechar" (e não para o logotipo)
    closeRef.current?.focus({ preventScroll: true });
  };

  /** Fecha por um link da folha. */
  const go = () => {
    navegou.current = true;
    close();
  };

  // "close" dispara com Esc, com d.close() e com <form method=dialog>.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      if (!navegou.current) btnRef.current?.focus({ preventScroll: true });
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  // Fecha ao trocar de rota.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Fecha ao chegar no desktop (a folha não existe lá).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const onChange = () => mq.matches && close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  return (
    <div className="menu-wrap">
      <button
        ref={btnRef}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="menu-folha"
        aria-haspopup="dialog"
        onClick={show}
      >
        Menu
        <i aria-hidden="true" />
      </button>

      <dialog
        ref={ref}
        id="menu-folha"
        className="sheet"
        aria-label="Menu de navegação"
      >
        <div className="sheet-top">
          <Logo onNavigate={go} lazy />
          <button ref={closeRef} type="button" className="menu-btn" onClick={close}>
            Fechar
            <CloseIcon size={22} />
          </button>
        </div>

        <div className="wrap pb-10 pt-5">
          <div className="sheet-acoes">
            <RouteWhatsAppCTA location="mobile_menu" block className="min-h-[56px]" />
            <RouteAgendarCTA location="mobile_menu" block />
            <PhoneCTA location="mobile_menu" as="texto" className="justify-center" />
          </div>

          <nav aria-label="Principal">
            <ul className="m-0 list-none p-0">
              {mainNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href} className="relative">
                    <span className="fio-h" aria-hidden="true" />
                    <Link
                      href={item.href}
                      className="sheet-link"
                      aria-current={active ? "page" : undefined}
                      onClick={go}
                    >
                      <span className={cn("display", item.destaque && "text-ouro-tinta")}>{item.label}</span>
                      <span className={cn("t-cap shrink-0 items-center gap-2 text-right", item.destaque ? "flex" : "hidden sm:flex")}>
                        {item.destaque && (
                          <span
                            aria-hidden="true"
                            className="inline-block h-[6px] w-[6px] shrink-0 rotate-45 border border-ouro"
                          />
                        )}
                        {item.caption}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li aria-hidden="true">
                <span className="fio-h" />
              </li>
            </ul>
          </nav>

          <p className="t-kicker sheet-grupo">Para você</p>
          <ul className="m-0 list-none p-0">
            {supportNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={go}
                  className="t-label flex min-h-[44px] items-center text-head underline decoration-ouro decoration-1 underline-offset-[0.25em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="t-cap mt-6 max-w-leitura">
            {localeTexto("endereco")}
          </p>
        </div>
      </dialog>
    </div>
  );
}
