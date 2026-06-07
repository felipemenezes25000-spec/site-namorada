# Site — Dra. Ana Beatriz Lemos Souza

Site institucional premium e landing page de alta conversão para a cirurgiã-dentista
**Dra. Ana Beatriz Lemos Souza**, construído sobre a identidade visual oficial da marca
(verde `#22513A`, dourado `#B69050`, off-white `#FCFCFC`; tipografia Cormorant Garamond + Montserrat).

> **Começe por aqui:** [`EDITAR-DEPOIS.md`](./EDITAR-DEPOIS.md) — o que preencher com os dados reais.

---

## 🚀 Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento → http://localhost:3000
# produção:
npm run build
npm run start
```

Requer Node 18+ (testado em Node 24). O site funciona **sem nenhuma variável de ambiente**
— o formulário de agendamento leva o paciente direto ao WhatsApp.

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 15** (App Router, RSC) + **TypeScript** |
| Estilo | **Tailwind CSS** (design system em `tailwind.config.ts`) |
| Animações | **Framer Motion** (reveals suaves, robustos a scroll rápido) |
| Formulários | **React Hook Form + Zod** |
| Ícones | **lucide-react** |
| Banco de leads | **Supabase** (opcional, com fallback gracioso) |
| Deploy sugerido | **Vercel** |

---

## 🗺️ Páginas

| Rota | Descrição |
|---|---|
| `/` | Home / landing de conversão (12 seções) |
| `/sobre` | Página institucional da Dra. Ana |
| `/tratamentos` | Lista de tratamentos (layout editorial alternado) |
| `/tratamentos/[slug]` | 6 páginas individuais com SEO + schema próprios |
| `/agendamento` | Formulário premium + WhatsApp |
| `/contato` | Canais de contato + mapa/localização |
| `/obrigado` | Pós-envio, com continuidade no WhatsApp |
| `/politica-de-privacidade` · `/termos-de-uso` | Documentos legais (LGPD) |
| `/admin` | Painel de leads (protegido por senha) |
| `not-found` (404) | Página de erro personalizada |
| `/sitemap.xml` · `/robots.txt` · `/opengraph-image` · `/icon` | SEO e ativos gerados |

Tratamentos: `avaliacao-odontologica`, `limpeza-dental`, `clareamento-dental`,
`restauracoes`, `prevencao`, `estetica-do-sorriso`.

---

## ✨ O que foi entregue

**Design & UX**
- Estética "luxo clínico editorial": muito respiro, hierarquia forte, dourado só como fio de acabamento (regra 70/20/10 da marca).
- Mobile-first impecável: menu drawer, botões grandes, sem scroll horizontal, WhatsApp flutuante.
- Microinterações suaves (hover em cards/botões, reveals de seção, accordion), com respeito a `prefers-reduced-motion`.
- Logos da marca aplicados (símbolo AB no header/rodapé/favicon, OG gerado com a identidade).

**Conversão**
- WhatsApp em todos os pontos-chave (header, hero, cards, localização, flutuante, pós-formulário), com mensagens pré-preenchidas por contexto.
- Formulário de agendamento com máscara de WhatsApp, validação amigável, estados de loading/erro e **fallback para WhatsApp** se a rede falhar.
- CTAs humanos ("Quero agendar minha avaliação", "Falar pelo WhatsApp") em vez de genéricos.

**SEO local**
- `title`/`description`/canonical únicos por página, Open Graph + Twitter Card.
- JSON-LD: **Dentist + LocalBusiness**, **MedicalWebPage**, **FAQPage**, **BreadcrumbList**, **WebSite**.
- `sitemap.xml`, `robots.txt`, H1 único por página, alt text, URLs amigáveis.
- Palavras-chave locais parametrizáveis por cidade/bairro em `site-config.ts`.

**Backend / automação (estrutura pronta)**
- Tabela `appointment_leads` (Supabase) com RLS, enum de status e trigger (`supabase/schema.sql`).
- API `/api/leads` validada com Zod; grava no banco se configurado, sem quebrar se não.
- Painel `/admin`: lista, filtra por status, busca, altera status, copia/abre WhatsApp — protegido por senha.
- Camada de rastreamento (GA4 / Meta Pixel / GTM) com eventos: `whatsapp_click`, `appointment_form_submit`, `lead_created`, `treatment_card_click`, `map_click`, `instagram_click`, `phone_click`.
- Mensagens de automação de WhatsApp (novo lead, confirmação, lembretes, pós-consulta) documentadas para evolução com Cloud API / Z-API / Twilio etc.

**Performance & acessibilidade**
- First Load JS ~102 kB (compartilhado); imagens otimizadas via `next/image`; favicon gerado (1,7 kB).
- Fontes auto-hospedadas (`next/font`), sem layout shift.
- Foco visível, skip-link, `aria-*`, labels em formulários, navegação por teclado, contraste adequado.
- **Sem erros de console** e **sem scroll horizontal** (validado em desktop e mobile com Playwright).

---

## ✅ Validação (Playwright)

Validado em viewport desktop (1440px) e mobile (390px):
- Home, Sobre, Tratamentos, página de tratamento, Agendamento, Contato, Obrigado, Admin, 404.
- Fluxo completo do formulário: máscara → validação → envio → redirecionamento → página de obrigado → WhatsApp.
- 5 tipos de JSON-LD presentes nas páginas de tratamento.
- 0 erros e 0 avisos de console; 0 overflow horizontal; reveals robustos a rolagem rápida.

Prévias visuais em [`/preview`](./preview) (não versionado).

---

## 📁 Estrutura

```
src/
  app/
    (site)/            # páginas públicas (header/rodapé/WhatsApp)
    admin/             # painel de leads (sem o chrome de marketing)
    api/leads/         # endpoint de criação de leads
    icon.tsx · apple-icon.tsx · opengraph-image.tsx · sitemap.ts · robots.ts
  components/
    layout/  ui/  sections/  forms/  seo/  admin/
  lib/        # site-config, treatments, content, seo, whatsapp, analytics, supabase, validations
  types/      # tipos de lead
supabase/schema.sql
EDITAR-DEPOIS.md   # ⬅️ checklist de dados reais a preencher
```

---

## 🌐 Deploy (Vercel — sugerido)

1. Suba o projeto para um repositório (GitHub/GitLab).
2. Importe na [Vercel](https://vercel.com), framework **Next.js** (detectado automaticamente).
3. Configure as variáveis de ambiente (veja `.env.example`) — todas opcionais.
4. Aponte o domínio e atualize `NEXT_PUBLIC_SITE_URL`.

> Conteúdo de caráter informativo, sem promessa de resultados, seguindo as normas de
> publicidade odontológica. Revise os documentos legais com apoio jurídico antes de publicar.
