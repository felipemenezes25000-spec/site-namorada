import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { CONTENT_UPDATED, formatDatePtBR } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Linha de autoria (contrato do base). Servidor puro. Saída:
 * "Conteúdo informativo do consultório da Dra. Ana Beatriz Lemos Souza, CRO-SP 177801. Atualizado em
 * 12 de novembro de 2026." com o nome ligado a /sobre. Não diz "elaborado" nem "revisado" pela doutora
 * enquanto ela não revisar os textos (conteudo-etica-202); a data é a da atualização editorial (`CONTENT_UPDATED`), a mesma que vai ao `dateModified` do JSON-LD.
 *
 * Props:
 *  - `updatedAt`: data ISO ("2026-11-12"); padrão `CONTENT_UPDATED`. Só passe outra data quando
 *    a página tiver mesmo sido editada depois, e use a mesma no JSON-LD da página;
 *  - `className`: classes extras (a base é `t-cap`).
 *
 * Exemplo: `<AuthorshipLine className="mt-8" />`
 */
export function AuthorshipLine({
  updatedAt = CONTENT_UPDATED,
  className,
}: {
  updatedAt?: string;
  className?: string;
}) {
  return (
    <p className={cn("t-cap m-0", className)}>
      Conteúdo informativo do consultório da{" "}
      <Link href="/sobre" className="link">
        {siteConfig.doctorName}
      </Link>
      , {siteConfig.cro}. Atualizado em{" "}
      <time dateTime={updatedAt}>{formatDatePtBR(updatedAt)}</time>.
    </p>
  );
}
