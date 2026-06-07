# O que editar depois — guia rápido

Lista objetiva do que precisa ser preenchido com os dados reais.
A maior parte está em **um único arquivo**: `src/lib/site-config.ts`.

---

## 1. Dados do consultório → `src/lib/site-config.ts`

| Campo | Onde aparece | Exemplo a preencher |
|---|---|---|
| `cro` | Site inteiro, rodapé, SEO | `CRO-SP 177801` |
| `city` / `neighborhood` / `region` | SEO local, textos | `São Paulo` / `Pinheiros` |
| `whatsapp` | Todos os botões de WhatsApp | `5511999999999` (55 + DDD + número, só dígitos) |
| `whatsappDisplay` / `phone` / `phoneDisplay` | Rodapé, contato | `(11) 99999-9999` |
| `email` | Rodapé, contato, legais | `contato@...` |
| `instagram` / `instagramUrl` | Rodapé, contato | `@dra.ana...` |
| `address.*` | Rodapé, contato, localização, SEO | rua, número, CEP, cidade |
| `address.mapsEmbedUrl` | Mapa na home/contato | link "Incorporar" do Google Maps |
| `address.mapsDirectionsUrl` | Botão "Como chegar" | link do Google Maps |
| `address.reviewUrl` | Botão "Avaliar no Google" | link de avaliação do Google |
| `address.geo` | SEO local (schema GeoCoordinates) | `{ lat: "-23.56", lng: "-46.65" }` — copie do Google Maps; vazio = omitido |
| `hours` | Rodapé, localização, agendamento | dias e horários reais |

> 💡 As palavras `[Cidade]`/`[Bairro]` em títulos, descrições e SEO são **substituídas automaticamente** assim que você preencher `city` e `neighborhood` (função `localize`). Não precisa editar arquivo a arquivo.

## 2. Imagens reais (substituir os painéis de marca)

As fotos hoje são **painéis de marca elegantes** (placeholders). Para trocar:
- Coloque a foto em `public/` (ex.: `public/dra-ana.jpg`).
- Troque `<PhotoPlaceholder .../>` por `<Image src="/dra-ana.jpg" ... />` em:
  - `src/components/sections/hero.tsx` (hero da home)
  - `src/components/sections/about-preview.tsx` (home, seção sobre)
  - `src/app/sobre/page.tsx` (página Sobre)

## 3. Textos da Dra. Ana

- **Formação e credenciais**: `src/app/sobre/page.tsx` → `credentials` (não invente títulos; use os reais).
- **Formas de pagamento**: `src/lib/content.ts` → última pergunta do `homeFaqs`.
- **Depoimentos**: `src/lib/content.ts` → `testimonials` (use depoimentos **reais e autorizados por escrito**; não use nomes completos sem consentimento).

## 4. Tratamentos (opcional)

- Conteúdo em `src/lib/treatments.ts`. As palavras `[Cidade]`/`[bairro]` nos textos de SEO são trocadas automaticamente quando você ajusta o `site-config`, exceto as que estão escritas dentro das descrições — revise se quiser.

## 5. Ativar recursos (variáveis de ambiente) → `.env.local`

Copie `.env.example` para `.env.local` e preencha:

- **Banco de leads (Supabase)**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
  - Rode o SQL de `supabase/schema.sql` no painel do Supabase.
  - Sem isso, o formulário **continua funcionando** e leva o paciente ao WhatsApp.
- **Painel admin** (`/admin`): defina `ADMIN_PASSWORD`.
- **Rastreamento**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GTM_ID`.
- **Domínio**: `NEXT_PUBLIC_SITE_URL` (ex.: `https://www.draanabeatriz.com.br`) — usado em sitemap, canonical e Open Graph.

## 6. Documentos legais

- Revise `politica-de-privacidade` e `termos-de-uso` com apoio jurídico antes de publicar. Preencha as `[data]` e a lista de provedores.

## 7. Favicon / OG

- O favicon usa `src/app/icon.png` (símbolo da marca) — já configurado.
- A imagem de compartilhamento (Open Graph) é gerada automaticamente em `src/app/opengraph-image.tsx` com a identidade da marca.
