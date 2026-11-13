import { locale } from "@/lib/site-config";

/** "Freguesia do Ó" nunca deixa o "Ó" sozinho na linha (espaço não separável explícito). */
const REGIAO = locale.regiao.replace(/ (\S+)$/, " $1");

/**
 * Linha de endereço do consultório, escrita sempre igual em /contato e /sobre:
 * "Vila Bruna (região da Freguesia do Ó), zona norte de São Paulo - SP, CEP 02934-201". O "CEP" e o
 * número ficam juntos (não separável). Composta aqui porque `locale.enderecoCompleto` não traz o
 * CEP nem a zona. Servidor puro.
 */
export function EnderecoLinha() {
  return (
    <>
      {locale.bairro} (região da {REGIAO}),{" "}
      <span>
        {locale.zona} - {locale.uf},
      </span>{" "}
      <span className="nums whitespace-nowrap">CEP&nbsp;{locale.cep}</span>
    </>
  );
}
