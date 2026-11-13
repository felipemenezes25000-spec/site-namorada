"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./tratamento-cuidados.module.css";

/**
 * Bloco recolhível das páginas de tratamento. No desktop fica sempre aberto (o título não é um
 * botão); no celular vira um <details> recolhível, para a página não virar uma parede de listas. O
 * conteúdo recolhido continua no HTML servido. Sem JavaScript, tudo fica aberto (o HTML já vem com
 * `open`).
 *
 * `heading`: "h3" (padrão) envolve o título em <h3>; "h2" usa <h2>; "none" usa um <span> (quando a
 * seção já tem o seu título e o resumo é só um convite, como "Ver as etapas").
 * `soCelular`: o resumo só aparece no celular (no desktop, a seção já mostra o próprio título).
 */
export function TratamentoGrupo({
  id,
  title,
  abertoNoCelular = false,
  heading = "h3",
  soCelular = false,
  children,
}: {
  id: string;
  title: string;
  /** No celular, abre este grupo ao carregar. */
  abertoNoCelular?: boolean;
  heading?: "h2" | "h3" | "none";
  soCelular?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 760px)");
    el.open = mq.matches ? true : abertoNoCelular;
    const sync = () => {
      if (mq.matches) el.open = true;
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [abertoNoCelular]);

  const Titulo = heading === "none" ? "span" : heading;

  return (
    <details ref={ref} open className={`${styles.group} ${soCelular ? styles.soCelular : ""}`} id={id}>
      <summary
        className={styles.sum}
        onClick={(e) => {
          // no desktop o grupo não fecha
          if (window.matchMedia("(min-width: 760px)").matches) e.preventDefault();
        }}
      >
        <Titulo className={styles.gtitle}>{title}</Titulo>
        <span className={styles.plus} aria-hidden="true" />
      </summary>
      <div className={styles.gbody}>{children}</div>
    </details>
  );
}
