"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

/** WhatsApp icon (brand glyph) — leve, sem dependência externa. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.08 1.74-.71 1.99-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.2-.56-.35zM12.04 21.5h-.01a9.46 9.46 0 0 1-4.83-1.32l-.35-.2-3.59.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.04c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.9.99 6.69 2.78a9.41 9.41 0 0 1 2.77 6.7c0 5.22-4.25 9.47-9.47 9.47zm8.06-17.53A11.36 11.36 0 0 0 12.04.5C5.8.5.72 5.58.72 11.82c0 2 .52 3.95 1.52 5.67L.62 23.5l6.16-1.62a11.3 11.3 0 0 0 5.26 1.34h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.03-1.18-5.87-3.32-8.01z" />
    </svg>
  );
}

export function WhatsAppFloatingButton() {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledEnough(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Esconde o botão quando o rodapé entra na viewport (não cobre links/CTAs).
    const footer = document.querySelector("footer");
    const io = footer
      ? new IntersectionObserver(
          (entries) => setFooterVisible(entries.some((e) => e.isIntersecting)),
          { rootMargin: "0px 0px -40px 0px" },
        )
      : null;
    if (footer && io) io.observe(footer);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const visible = scrolledEnough && !footerVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-4 z-40 hidden sm:bottom-6 sm:right-6 md:block"
        >
          <a
            href={whatsappLink(waMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "floating" })}
            aria-label="Agendar avaliação pelo WhatsApp"
            className="group flex items-center gap-0 rounded-full bg-[#1F8C4D] text-white shadow-lift ring-1 ring-white/20 transition-all duration-300 hover:bg-[#19743f]"
          >
            <span className="relative flex size-[3.4rem] items-center justify-center rounded-full">
              <span className="absolute inset-0 rounded-full animate-soft-pulse" />
              <WhatsAppGlyph className="size-7" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 ease-out-expo group-hover:max-w-[12rem] group-hover:pr-5">
              Agendar pelo WhatsApp
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
