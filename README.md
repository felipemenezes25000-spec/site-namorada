# Site da Dra. Ana Beatriz Lemos Souza

Site institucional da cirurgiã-dentista **Dra. Ana Beatriz Lemos Souza** (CRO-SP 177801), com consultório na R. Rio Verde, 1029, Vila Bruna (região da Freguesia do Ó), em São Paulo. Atendimento particular. O tráfego principal chega pelo celular, vindo do Google Ads; as conversões são o clique no WhatsApp e o formulário de agendamento.

Direção visual, regras de conteúdo e decisões vigentes: [`DESIGN.md`](./DESIGN.md) (comece pela seção 0). O que preencher com dados reais: [`EDITAR-DEPOIS.md`](./EDITAR-DEPOIS.md). Anúncios e medição: [`GOOGLE-ADS-SETUP.md`](./GOOGLE-ADS-SETUP.md).

## Como rodar

```bash
npm ci               # instala exatamente o que está no package-lock.json
npm run dev          # desenvolvimento em http://localhost:3000
npm run build        # build de produção
npm run start        # serve o build
```

Requer Node 20 ou mais novo (a CI usa o 22). O site abre **sem nenhuma variável de ambiente**; sem uma saída de leads configurada, o formulário leva o paciente ao WhatsApp.

## Scripts

| Script | O que faz |
|---|---|
| `npm run lint` | ESLint 9 (`next/core-web-vitals` e `next/typescript`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest sobre `src/lib` |
| `npm run check:site` | verifica o HTML gerado (precisa de `npm run build` antes); ver abaixo |
| `npm run format` / `format:check` | Prettier (finais de linha LF) |
| `npm run verify` | lint, typecheck, test, build e check:site, nessa ordem |

`scripts/check-site.mjs` falha quando encontra colchetes em texto publicado, título acima de 60 ou descrição acima de 155 caracteres, mais de um H1, imagem sem `alt`, canonical ausente, pergunta do FAQ que não está no texto visível, termo proibido (nome de especialidade, forma de pagamento, endereço antigo, entre outros), `lang` diferente de `pt-BR`, falta de viewport, link ou imagem interna que não existe, URL do sitemap que não é página gerada, `robots.txt` sem `Sitemap` e JavaScript inicial acima do orçamento (230 kB gzip, mudável com `JS_BUDGET_KB`). Também lê páginas baixadas: `node scripts/check-site.mjs --dir <pasta com .html>`.

A CI do GitHub (`.github/workflows/ci.yml`) roda a mesma sequência a cada push e pull request.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) e React 19, em TypeScript |
| Estilo | Tailwind CSS 3 e `src/app/globals.css` (tokens em `:root`, classes `.t-*`, `.btn-*`, `.idx-*` em `@layer components`) |
| Tipografia | Bodoni Moda (títulos grandes) e Hanken Grotesk (texto), via `next/font` |
| Formulário | React Hook Form e zod |
| Leads | Supabase (opcional) e e-mail pelo Resend (opcional) |
| Movimento | CSS puro, respeitando `prefers-reduced-motion` |
| Deploy | Vercel |

## Rotas

| Rota | Arquivo |
|---|---|
| `/` | `src/app/(site)/page.tsx` |
| `/sobre` | `src/app/(site)/sobre/page.tsx` |
| `/tratamentos` | `src/app/(site)/tratamentos/page.tsx` |
| `/tratamentos/[slug]` (8 páginas) | `src/app/(site)/tratamentos/[slug]/page.tsx` |
| `/agendamento` | `src/app/(site)/agendamento/page.tsx` |
| `/contato` | `src/app/(site)/contato/page.tsx` |
| `/primeira-consulta`, `/valores`, `/urgencia-odontologica`, `/medo-de-dentista` | `src/app/(site)/<rota>/page.tsx` |
| `/obrigado` (noindex) | `src/app/(site)/obrigado/page.tsx` |
| `/politica-de-privacidade`, `/termos-de-uso` | `src/app/(site)/<rota>/page.tsx` |
| `/admin` (painel de leads, com senha) | `src/app/admin/page.tsx` |
| `POST /api/leads` | `src/app/api/leads/route.ts` |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` |

Slugs de tratamento: `avaliacao-odontologica`, `limpeza-dental`, `clareamento-dental`, `restauracoes`, `prevencao`, `implante`, `cirurgia-oral` e `cirurgia-buco-maxilo-facial` (o slug não muda; o nome visível é "Remoção de dentes inclusos e cirurgias na boca").

## Estrutura

```
src/
  app/                 rotas (site) e (admin), api/leads, globals.css, layout.tsx
  components/
    brand/             logo e o Fio (FioRule, FioRail, FioProgress, FioSmile)
    layout/            Header, Footer, MenuSheet, MobileActionBar, SiteShell, route-ctas
    motion/            RevealObserver
    sections/          seções das páginas
    ui/                cta (WhatsApp, telefone, mapa, agendar), MapFacade, Figure, FAQ, etc.
    forms/  seo/  admin/
  lib/                 site-config, content, treatments, seo, whatsapp, analytics, attribution,
                       validations, supabase, email, rate-limit, admin-auth
  types/               tipos de lead
supabase/schema.sql    tabela de leads
scripts/check-site.mjs verificação do HTML gerado
public/                imagens servidas (o que sai de uso vai para _arquivo/, fora do Git)
```

## Dados e textos

- Dados do consultório (nome, CRO, contatos, endereço, mapa, URL): `src/lib/site-config.ts`. Bairro, região e endereço em texto vêm de `locale` e `localeTexto(...)`, no mesmo arquivo.
- Respostas que se repetem (avaliação, pagamento, duração, convênio): `respostas` em `src/lib/content.ts`.
- Tratamentos: `src/lib/treatments.ts`. Situações do seletor da home: `src/lib/situations.ts`.
- Rótulos de botão: só o vocabulário de `src/components/ui/cta.tsx` (ver DESIGN.md, 0.2).

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Para receber leads configure **uma** saída: Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, com o SQL de `supabase/schema.sql`) ou Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_EMAIL`). O painel `/admin` só liga com `ADMIN_PASSWORD` (12 caracteres ou mais) **e** `ADMIN_SESSION_SECRET` (32 ou mais, diferente da senha). Medição: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID` (nada carrega sem o ID; veja `GOOGLE-ADS-SETUP.md`).

## Medição

`src/lib/analytics.ts` envia os eventos `whatsapp_click`, `phone_click`, `email_click`, `instagram_click`, `map_click`, `cta_click`, `scheduling_intent`, `treatment_card_click`, `care_need_click`, `situation_select`, `form_start`, `appointment_form_submit` e `lead_created`. Com GTM, os eventos vão só ao `dataLayer`; sem GTM, só ao `gtag`. **A conversão é `lead_created`**, que dispara uma vez em `/obrigado`; os demais são eventos de interesse. Nenhum evento leva nome, e-mail ou telefone.

## Deploy (Vercel)

1. Projeto na Vercel com o nome `site-namorada` (o redirecionamento dos endereços `*.vercel.app` em `next.config.mjs` casa com esse prefixo; se o projeto for renomeado, ajuste o `has` do redirect).
2. Variáveis de ambiente do `.env.example` no escopo Production.
3. Domínio: confira em **Settings, Domains** que `draanabeatrizodonto.com.br` (o apex) redireciona para `www.draanabeatrizodonto.com.br` e que o `www` é o domínio de produção. Em produção, qualquer host diferente do `www` recebe `X-Robots-Tag: noindex`, então um apex servindo conteúdo sem redirecionamento sai do índice do Google.
4. Depois do primeiro deploy, rode `npm run verify` localmente (ou veja a CI) e envie o sitemap no Search Console.

## Conteúdo e ética

O texto segue as regras de publicidade do Conselho Federal de Odontologia: sem preço, sem forma de pagamento em destaque, sem promessa de resultado, sem superlativo, sem foto de procedimento em andamento e sem o título de especialista. Ao mudar texto, rode `npm run check:site`.
