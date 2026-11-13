"use client";

import { useEffect, useRef, useState } from "react";
import { readLeadHandoff } from "@/lib/agendamento-handoff";

/**
 * H1 de /obrigado. O HTML do servidor já traz "Recebemos seu pedido"; no navegador, se houver um
 * primeiro nome guardado pelo formulário (sessionStorage), o título vira "Recebemos seu pedido, {nome}".
 * Texto neutro de propósito: não presume o gênero de quem escreveu.
 * Depois disso o foco vai para o H1 (sem rolar a página), para o leitor de tela anunciar a confirmação.
 */
export function ObrigadoHeading({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const ref = useRef<HTMLHeadingElement>(null);

  // Lê o nome guardado e, com o título já final, leva o foco ao H1 (sem rolar a página).
  useEffect(() => {
    setName(readLeadHandoff()?.firstName ?? "");
    const id = requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <h1 ref={ref} tabIndex={-1} className={className}>
      {name ? `Recebemos seu pedido, ${name}` : "Recebemos seu pedido"}
    </h1>
  );
}
