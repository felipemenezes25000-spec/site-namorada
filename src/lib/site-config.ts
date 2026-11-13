/**
 * ============================================================
 *  FONTE ÚNICA DE INFORMAÇÕES EDITÁVEIS DO SITE
 * ============================================================
 *  Edite APENAS este arquivo para atualizar:
 *  nome, CRO, WhatsApp, endereço, redes sociais, horários etc.
 * ============================================================
 */

export const siteConfig = {
  /** Nome profissional completo (não alterar a grafia oficial). */
  doctorName: "Dra. Ana Beatriz Lemos Souza",
  doctorFirstName: "Dra. Ana Beatriz",
  /** Registro no Conselho Regional de Odontologia. */
  cro: "CRO-SP 177801",
  title: "Cirurgiã-dentista",
  /** Foco de atuação — usado em textos e SEO. */
  focus:
    "Odontologia preventiva, saúde bucal, estética do sorriso, cirurgia oral e atendimento humanizado.",

  /** Cidade / bairro — usados no SEO local. */
  city: "São Paulo",
  state: "SP",
  neighborhood: "Freguesia do Ó",
  region: "São Paulo",

  /**
   * Horário de atendimento. VAZIO = não mostrar (nenhum componente exibe
   * "a combinar"). Só preencha com o horário confirmado pela Dra.
   */
  hours: "" as string,

  /** Contato. */
  whatsapp: "5511939222289",
  whatsappDisplay: "(11) 93922-2289",
  phone: "5511939222289",
  phoneDisplay: "(11) 93922-2289",
  email: "draanabeatrizodontologia@gmail.com",
  instagram: "@dra.anabeatrizodonto",
  instagramUrl: "https://www.instagram.com/dra.anabeatrizodonto/",
  /** Currículo Lattes (usado como sameAs do schema Person). */
  lattesUrl: "https://lattes.cnpq.br/3767606004982701",

  /** Endereço do consultório. */
  address: {
    street: "R. Rio Verde, 1029",
    complement: "",
    neighborhood: "Vila Bruna",
    city: "São Paulo",
    state: "SP",
    zip: "02934-201",
    full: "R. Rio Verde, 1029 — Vila Bruna, São Paulo - SP",
    mapsEmbedUrl: "https://www.google.com/maps?q=-23.4884235,-46.7046298&output=embed",
    mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=-23.4884235,-46.7046298",
    geo: { lat: "-23.4884235", lng: "-46.7046298" },
  },

  /** URL pública canônica (também em NEXT_PUBLIC_SITE_URL). */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.draanabeatrizodonto.com.br",
} as const;

/** Cor do tema: UMA constante para o `viewport.themeColor` (layout.tsx) e o `theme_color` do manifest. */
export const themeColor = "#FBF8F1";

/**
 * Localidade em campos (contrato do base): os componentes NÃO digitam bairro, região ou
 * endereço; leem daqui. Derivado de `siteConfig`, então editar o endereço lá basta.
 *  - `bairro`: bairro do consultório ("Vila Bruna");
 *  - `regiao`: região de referência ("Freguesia do Ó"); em texto corrido: "região da Freguesia do Ó";
 *  - `zona`: "zona norte de São Paulo" (minúscula, para uso no meio da frase);
 *  - `ruaNumero`: "R. Rio Verde, 1029"; `cep`: "02934-201";
 *  - `enderecoCompleto`: "R. Rio Verde, 1029 — Vila Bruna, São Paulo - SP".
 */
export const locale = {
  bairro: siteConfig.address.neighborhood,
  regiao: siteConfig.neighborhood,
  zona: "zona norte de São Paulo",
  cidade: siteConfig.address.city,
  uf: siteConfig.address.state,
  ruaNumero: siteConfig.address.street,
  cep: siteConfig.address.zip,
  enderecoCompleto: siteConfig.address.full,
} as const;

export type LocaleTexto =
  /** "Vila Bruna, região da Freguesia do Ó" */
  | "bairroRegiao"
  /** "Vila Bruna, região da Freguesia do Ó, São Paulo" */
  | "bairroRegiaoCidade"
  /** "região da Freguesia do Ó, zona norte de São Paulo" */
  | "regiaoZona"
  /** "R. Rio Verde, 1029 — Vila Bruna (região da Freguesia do Ó), São Paulo - SP, 02934-201" */
  | "endereco"
  /** "R. Rio Verde, 1029 — Vila Bruna, São Paulo - SP" */
  | "enderecoCurto";

/** Helper de texto: `localeTexto("bairroRegiao")`. Sem reticências nem marcador: sempre texto final. */
export function localeTexto(forma: LocaleTexto): string {
  switch (forma) {
    case "bairroRegiao":
      return `${locale.bairro}, região da ${locale.regiao}`;
    case "bairroRegiaoCidade":
      return `${locale.bairro}, região da ${locale.regiao}, ${locale.cidade}`;
    case "regiaoZona":
      return `região da ${locale.regiao}, ${locale.zona}`;
    case "endereco":
      return `${locale.ruaNumero} — ${locale.bairro} (região da ${locale.regiao}), ${locale.cidade} - ${locale.uf}, ${locale.cep}`;
    case "enderecoCurto":
      return locale.enderecoCompleto;
  }
}

/**
 * Navegação principal (DESIGN.md 5.0). "Agendamento" deixou de ser item: é botão.
 * `caption` = legenda à direita do item na folha do celular; `destaque` = item
 * em destaque (texto dourado-tinta + losango; não é vermelho).
 */
export const mainNav: readonly {
  label: string;
  href: string;
  caption: string;
  destaque?: boolean;
}[] = [
  { label: "Tratamentos", href: "/tratamentos", caption: "Sumário" },
  { label: "Primeira consulta", href: "/primeira-consulta", caption: "Como é a consulta" },
  { label: "Valores", href: "/valores", caption: "Como funcionam" },
  { label: "Sobre", href: "/sobre", caption: "A doutora" },
  { label: "Contato", href: "/contato", caption: "Endereço" },
  {
    label: "Urgência",
    href: "/urgencia-odontologica",
    caption: "Dor ou imprevisto",
    destaque: true,
  },
];

/** Atalhos fora do menu principal (folha do celular e rodapé). */
export const supportNav = [{ label: "Medo de dentista", href: "/medo-de-dentista" }] as const;

export type SiteConfig = typeof siteConfig;
