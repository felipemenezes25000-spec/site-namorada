"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MessageCircle, CalendarDays } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/site-config";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { BrandLockup } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao trocar de rota.
  useEffect(() => setOpen(false), [pathname]);

  // Trava o scroll do body com o drawer aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Foco inicial, Escape e focus trap dentro do drawer.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const focusables = drawer
      ? Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : [];
    focusables[0]?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && focusables.length) {
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Devolve o foco ao botão do menu ao fechar.
  useEffect(() => {
    if (wasOpen.current && !open) menuButtonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-brand-ink/[0.07] bg-brand-bone/85 backdrop-blur-md supports-[backdrop-filter]:bg-brand-bone/70"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container flex h-[4.6rem] items-center justify-between gap-4 lg:h-20">
        <Link
          href="/"
          aria-label={`${siteConfig.doctorName} — página inicial`}
          className="shrink-0 rounded-lg"
        >
          <BrandLockup symbolSize={40} />
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-brand-green"
                  : "text-brand-ink/70 hover:text-brand-green",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-4 -bottom-0.5 h-px bg-brand-gold"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink
            href={whatsappLink(waMessages.default)}
            external
            variant="ghost"
            size="sm"
            aria-label="Falar no WhatsApp"
            onClick={() => track("whatsapp_click", { location: "header" })}
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            WhatsApp
          </ButtonLink>
          <ButtonLink href="/agendamento" variant="primary" size="sm">
            <CalendarDays className="size-4" strokeWidth={1.7} />
            Agendar avaliação
          </ButtonLink>
        </div>

        {/* Botão mobile */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="inline-flex size-11 items-center justify-center rounded-full text-brand-green ring-1 ring-inset ring-brand-green/15 transition hover:bg-brand-green/[0.05] lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden"
          >
            <button
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-[4.6rem] z-40 bg-brand-ink/20 backdrop-blur-sm"
            />
            <motion.nav
              ref={drawerRef}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="fixed inset-x-0 top-[4.6rem] z-50 border-b border-brand-ink/[0.07] bg-brand-bone px-5 pb-7 pt-3 shadow-lift"
            >
              <ul className="flex flex-col">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between border-b border-brand-ink/[0.06] py-4 font-display text-2xl",
                        isActive(item.href)
                          ? "text-brand-green"
                          : "text-brand-ink/80",
                      )}
                    >
                      {item.label}
                      <span className="gold-diamond opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <ButtonLink href="/agendamento" variant="primary" size="lg" className="w-full">
                  <CalendarDays className="size-5" strokeWidth={1.7} />
                  Quero agendar minha avaliação
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink(waMessages.default)}
                  external
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  onClick={() => track("whatsapp_click", { location: "mobile_menu" })}
                >
                  <MessageCircle className="size-5" strokeWidth={1.7} />
                  Falar pelo WhatsApp
                </ButtonLink>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
