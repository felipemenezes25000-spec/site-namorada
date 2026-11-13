import { siteConfig, localeTexto } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Espaços que não podem virar quebra de linha: "Dra. / Ana", "CRO-SP / 177801", "Freguesia / do Ó". */
function semQuebra(texto: string) {
  return texto
    .replace(/Dra\. /g, "Dra. ")
    .replace(/CRO-SP /g, "CRO-SP ")
    .replace(/Freguesia do Ó/g, "Freguesia do Ó");
}

/**
 * Linha de identidade da profissional (contrato do base): nome, registro e local, tudo lido
 * de `siteConfig`. Servidor puro. Saída: "Dra. Ana Beatriz Lemos Souza · CRO-SP 177801 · Vila
 * Bruna, região da Freguesia do Ó". Use sob títulos de página, em rodapés de bloco e onde a
 * página precisa dizer quem atende e onde, sem repetir o texto à mão.
 *
 * Quebra de linha (globals.css, `.idt`): cada item é um bloco em linha que quebra por dentro quando
 * não cabe (texto ampliado a 200%), e o "·" é desenhado antes de cada item, numa faixa que fica fora
 * da caixa no começo de cada linha. Assim a linha nunca começa com "·" e nada passa da largura.
 * Leitores de tela ouvem os itens separados por vírgula (o "·" é decorativo).
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
    <Tag className={cn("idt t-cap m-0", className)}>
      <span className="idt-in">
        {itens.map((item, i) => (
          <span key={item} className="idt-item">
            {i > 0 && <span className="sr-only">, </span>}
            {semQuebra(item)}
          </span>
        ))}
      </span>
    </Tag>
  );
}
