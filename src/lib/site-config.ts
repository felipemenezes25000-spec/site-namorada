/**
 * ============================================================
 *  FONTE ÚNICA DE INFORMAÇÕES EDITÁVEIS DO SITE
 * ============================================================
 *  Edite APENAS este arquivo para atualizar:
 *  nome, CRO, WhatsApp, endereço, redes sociais, horários etc.
 *  Os campos entre colchetes [ ] são PLACEHOLDERS — troque pelos
 *  dados reais quando estiverem disponíveis.
 *
 *  Veja também: EDITAR-DEPOIS.md na raiz do projeto.
 * ============================================================
 */

export const siteConfig = {
  /** Nome profissional completo (não alterar a grafia oficial). */
  doctorName: "Dra. Ana Beatriz Lemos Souza",
  doctorFirstName: "Dra. Ana Beatriz",
  /** Registro no Conselho Regional de Odontologia. */
  cro: "CRO-SP 177801",
  title: "Cirurgiã-Dentista",
  /** Foco de atuação — usado em textos e SEO. */
  focus:
    "Odontologia preventiva, saúde bucal, estética do sorriso, cirurgia oral e atendimento humanizado.",

  /** Cidade / bairro — usados no SEO local. */
  city: "São Paulo",
  state: "SP",
  neighborhood: "Bela Vista",
  region: "São Paulo",

  /** Contato. */
  whatsapp: "5511939222289",
  whatsappDisplay: "(11) 93922-2289",
  phone: "5511939222289",
  phoneDisplay: "(11) 93922-2289",
  email: "draanabeatrizodontologia@gmail.com",
  instagram: "@dra.anabeatrizodonto",
  instagramUrl: "https://www.instagram.com/dra.anabeatrizodonto/",

  /** Endereço do consultório. */
  address: {
    street: "R. Itapeva, 286",
    complement: "",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zip: "01332-000",
    full: "R. Itapeva, 286 — Bela Vista, São Paulo - SP",
    mapsEmbedUrl: "https://www.google.com/maps?q=-23.5586695,-46.6521676&output=embed",
    mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=-23.5586695,-46.6521676",
    // Link para avaliações no Google — atualize com o Place ID real quando disponível.
    reviewUrl: "https://search.google.com/local/writereview?placeid=[SEU_PLACE_ID]",
    geo: { lat: "-23.5586695", lng: "-46.6521676" },
  },

  /** URL pública canônica (também em NEXT_PUBLIC_SITE_URL). */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.draanabeatrizodonto.com.br",
} as const;

/** Navegação principal. */
export const mainNav = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Tratamentos", href: "/tratamentos" },
  { label: "Agendamento", href: "/agendamento" },
  { label: "Contato", href: "/contato" },
] as const;

export type SiteConfig = typeof siteConfig;
