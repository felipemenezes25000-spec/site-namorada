import Link from "next/link";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowIcon } from "@/components/ui/icons";
import { AgendarCTA } from "@/components/ui/cta";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import { cn } from "@/lib/utils";
import styles from "./editorial.module.css";

/**
 * Implante e cirurgia (DESIGN.md 5.1, momento 4): duas linhas de sumário com numeral em itálico,
 * nome, descrição e os cursos que dão lastro, sem cartões, sem ícones e sem selos. Fonte única,
 * usada na home e na página Sobre.
 *
 * Linguagem deliberadamente segura (decisão do diretor, B-00): nomes neutros ("Implante
 * dentário" e "Remoção de dentes inclusos e cirurgias na boca"), nunca nome de especialidade;
 * cursos aparecem como "Curso"; nada de promessa de resultado. As URLs não mudam (o slug
 * cirurgia-buco-maxilo-facial continua).
 *
 * Variante "line" (B-28, usada em /sobre): sem descrições nem botão, uma linha horizontal entre
 * dois fios com os dois nomes e o link de cada um; a home mantém a lista completa.
 *
 * Cada linha tem UM só caminho (link com seta para a página da área); o pedido de avaliação
 * é um botão único no fim da seção ("Preencher formulário", /agendamento, mantém a atribuição
 * gclid/UTM) e o WhatsApp já mora no cabeçalho e na barra do celular.
 */
const areas = [
  {
    title: "Implante dentário",
    description:
      "Reposição de dentes perdidos com implantes, com planejamento individual e exames de imagem antes de cada decisão.",
    institutions: ["ABO Central", "APCD Central"],
    ctaLocation: "area_implante",
    slug: "implante",
  },
  {
    title: "Remoção de dentes inclusos e cirurgias na boca",
    description:
      "Avaliação e cirurgias na boca, como a remoção de dentes inclusos, com planejamento por imagem e acompanhamento em cada etapa.",
    institutions: ["ABO Central", "IOA"],
    ctaLocation: "area_bucomaxilo",
    slug: "cirurgia-buco-maxilo-facial",
  },
] as const;

export function AreasSection({
  eyebrow = "No consultório",
  title = "Implante e cirurgia: o que a Dra. Ana atende",
  description = "Além do cuidado clínico geral, a Dra. Ana atende casos de implante dentário e de cirurgias na boca, sempre com avaliação criteriosa antes de qualquer indicação.",
  tone = "osso",
  id,
  variant = "list",
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: SectionTone;
  id?: string;
  /** "list" (padrão, home) ou "line" (uma linha com os dois nomes, /sobre). */
  variant?: "list" | "line";
  className?: string;
}) {
  const titleId = `${id ?? "areas"}-titulo`;
  return (
    <Section tone={tone} id={id} aria-labelledby={titleId} className={cn(styles.areasSec, styles.secM, className)}>
      <Container>
        <div className="grid12">
          <div className={styles.areaHead}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={titleId} className={cn("t-d2", styles.areaTitle)}>
              {title}
            </h2>
            <p className={cn("t-body", styles.areaLede)}>{description}</p>
          </div>
        </div>

        {variant === "line" ? (
          <ul className={styles.areaLine} aria-label="Áreas de atendimento">
            {areas.map((a, i) => (
              <li key={a.slug} className={styles.areaLineItem}>
                {i > 0 && <span className={styles.areaLineDia} aria-hidden="true" />}
                <Link href={`/tratamentos/${a.slug}`} className={cn("link", styles.areaLineLink)}>
                  <span className={cn("t-row", styles.areaLineName)}>{a.title}</span>
                  <ArrowIcon size={20} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <>
        <ol data-reveal="" className={cn("idx", styles.areas)}>
          {areas.map((a, i) => (
            <IndexRow key={a.title} i={i} className={styles.area}>
              <span className={cn("it-sm", styles.areaNum)} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.areaBody}>
                <h3 className={cn("t-d3 display", styles.areaName)}>{a.title}</h3>
                <p className="t-body">{a.description}</p>
                <p className={cn("t-cap", styles.areaCap)}>Curso: {a.institutions.join(" · ")}</p>
              </div>
              <div className={styles.areaActions}>
                <Link href={`/tratamentos/${a.slug}`} className={cn("link t-label", styles.areaLink)}>
                  <span>
                    Conhecer {a.title.toLowerCase()}
                  </span>
                  <ArrowIcon size={18} />
                </Link>
              </div>
            </IndexRow>
          ))}
          <IndexEnd i={areas.length} />
        </ol>

        <div className={styles.areasCta}>
          <AgendarCTA location="areas" variant="primario" />
        </div>
          </>
        )}
      </Container>
    </Section>
  );
}
