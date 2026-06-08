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

  /** Cidade / bairro — usados no SEO local. Edite para a região real. */
  city: "[Cidade]",
  state: "SP",
  neighborhood: "[Bairro]",
  region: "[Cidade] e região",

  /** Contato. */
  // WhatsApp em formato internacional, somente números: 55 + DDD + número.
  whatsapp: "5500000000000",
  whatsappDisplay: "[(00) 00000-0000]",
  phone: "5500000000000",
  phoneDisplay: "[(00) 00000-0000]",
  email: "draanabeatrizodontologia@gmail.com",
  instagram: "[@dra.anabeatrizlemos]",
  instagramUrl: "https://instagram.com/[dra.anabeatrizlemos]",

  /** Endereço do consultório. */
  address: {
    street: "[Rua / Avenida, número]",
    complement: "[Sala / Conjunto]",
    neighborhood: "[Bairro]",
    city: "[Cidade]",
    state: "SP",
    zip: "[00000-000]",
    full: "[Rua Exemplo, 000 — Sala 00], [Bairro], [Cidade] - SP",
    // Cole aqui o link de incorporação do Google Maps (Compartilhar > Incorporar um mapa).
    mapsEmbedUrl: "",
    // Link "Como chegar" — substitua pelo link do seu Google Business Profile.
    mapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=Dra.+Ana+Beatriz+Lemos+Souza+Odontologia",
    // Link para avaliações no Google (cole o link curto do seu perfil).
    reviewUrl: "https://search.google.com/local/writereview?placeid=[SEU_PLACE_ID]",
    // Coordenadas do consultório (Google Maps > clicar no local > copiar lat,lng).
    // Deixe vazio para omitir do schema. Ex.: lat: "-23.5614", lng: "-46.6559".
    geo: { lat: "", lng: "" },
  },

  /** Horários de atendimento (editável). */
  hours: [
    { days: "Segunda a Sexta", time: "09h às 19h" },
    { days: "Sábado", time: "09h às 13h" },
    { days: "Domingo e feriados", time: "Fechado" },
  ],

  /** URL pública canônica (também em NEXT_PUBLIC_SITE_URL). */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.draanabeatrizlemos.com.br",
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
