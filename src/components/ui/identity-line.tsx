import { siteConfig, localeTexto } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Linha de identidade da profissional (contrato do base): nome, registro e local, tudo lido
 * de `siteConfig`. Servidor puro. Saída: "Dra. Ana Beatriz Lemos Souza · CRO-SP 177801 · Vila
 * Bruna, região da Freguesia do Ó". Use sob títulos de página, em rodapés de bloco e onde a
 * página precisa dizer quem atende e onde, sem repetir o texto à mão.
 *
 * Props:
 *  - `as`: "p" (padrão) ou "div";
 *  - `showTitle`: acrescenta "cirurgiã-dentista" depois do nome (padrão false);
 *  - `className`: classes extras (a base é `t-cap`).
 *
 * Exemplo: `<IdentityLine className="mt-4" />`
 */
export function IdentityLine({
  as: Tag = "p",
  showTitle = false,
  className,
}: {
  as?: "p" | "div";
  showTitle?: boolean;
  className?: string;
}) {
  const itens = [
    showTitle ? `${siteConfig.doctorName}, cirurgiã-dentista` : siteConfig.doctorName,
    siteConfig.cro,
    localeTexto("bairroRegiao"),
  ];
  return (
    <Tag className={cn("t-cap m-0", className)}>
      {itens.map((item, i) => (
        <span key={item}>
          {i > 0 && (
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
          )}
          {i > 0 && <span className="sr-only">, </span>}
          {item}
        </span>
      ))}
    </Tag>
  );
}
