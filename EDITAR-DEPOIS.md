# O que editar depois

Lista do que ainda depende de dado real, de decisão da Dra. Ana ou de configuração na Vercel. A maior parte dos dados fica em **um arquivo**: `src/lib/site-config.ts`.

## 1. Dados do consultório (`src/lib/site-config.ts`)

| Campo | Onde aparece | Situação |
|---|---|---|
| `cro`, `doctorName`, `title` | site inteiro, rodapé, SEO | preenchidos (CRO-SP 177801) |
| `whatsapp`, `whatsappDisplay`, `phone`, `phoneDisplay` | todos os botões de WhatsApp e de ligar | preenchidos; `whatsapp` e `phone` levam 55 + DDD + número, só dígitos |
| `email`, `instagram`, `instagramUrl`, `lattesUrl` | rodapé, contato, JSON-LD | preenchidos |
| `address.*` (rua, bairro, CEP, cidade) | rodapé, contato, localização, SEO | R. Rio Verde, 1029 — Vila Bruna, 02934-201 |
| `address.mapsEmbedUrl`, `address.mapsDirectionsUrl`, `address.geo` | mapa (só depois do clique em "Ver mapa"), "Como chegar", dados estruturados | preenchidos com as coordenadas do consultório |
| `hours` | rodapé, localização, agendamento | **vazio de propósito**: nenhum componente mostra "a combinar". Preencha só com o horário confirmado pela Dra. |
| `locale` e `localeTexto(...)` | todo texto com bairro, região e endereço | derivados do `siteConfig`; mudou o endereço, mude só o `siteConfig` |

## 2. Textos que dependem da Dra. Ana

- **Formação e credenciais:** `src/components/sections/sobre-formacao.tsx`. Use só títulos reais e comprovados; linhas de curso dizem "Curso".
- **Formas de pagamento:** `respostas.pagamento` em `src/lib/content.ts`. É a única resposta publicada; forma de pagamento não vai em destaque, título nem meta (Código de Ética Odontológica, art. 44, I).
- **Respostas repetidas (avaliação, duração, convênio):** `respostas` em `src/lib/content.ts`.
- **Tratamentos (nomes, durações, sessões, cuidados):** `src/lib/treatments.ts`. Durações e número de sessões só com o que a Dra. confirmar; o que não estiver confirmado diz "definida na avaliação".
- **Estacionamento, acessibilidade e acesso ao consultório:** não há texto confirmado. Se a Dra. confirmar, acrescente em `src/lib/content.ts` (FAQ) e na seção de localização; sem confirmação, não escreva.
- **Depoimentos:** o site não publica depoimentos. Se um dia entrarem, só reais e autorizados por escrito.
- **Fotos:** a Dra. envia fotos novas; o site não usa foto de procedimento em andamento (Resolução CFO-196/2019) nem imagem gerada por IA. As imagens servidas ficam em `public/` (`dra-ana-recorte.webp`, `dra-ana-trajetoria.jpg`, `dra-ana.webp` e `brand/`).

## 3. Ativar recursos (`.env.local` e Vercel)

Copie `.env.example` para `.env.local`; o arquivo marca o que é obrigatório e o que é opcional.

- **Receber leads:** configure Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; rode `supabase/schema.sql` no painel) ou Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_EMAIL`). Sem nenhum dos dois o formulário responde 503 e leva ao WhatsApp.
- **Painel `/admin`:** `ADMIN_PASSWORD` (12 caracteres ou mais) **e** `ADMIN_SESSION_SECRET` (32 ou mais, diferente da senha). Sem as duas, o painel fica desligado.
- **Medição:** `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`. Antes de ligar em produção, a Política de Privacidade precisa descrever as tags. Passo a passo em `GOOGLE-ADS-SETUP.md`.
- **Domínio:** `NEXT_PUBLIC_SITE_URL` é opcional (o código já usa `https://www.draanabeatrizodonto.com.br`). Se definir, use esse valor exato: um valor errado foi o que impediu a indexação no Google em 2026-06-10.
- **Na Vercel:** o projeto deve se chamar `site-namorada`, e o apex `draanabeatrizodonto.com.br` deve redirecionar para o `www` (Settings, Domains). Detalhes no `README.md`.

## 4. Documentos legais

Revise `src/app/(site)/politica-de-privacidade/page.tsx` e `src/app/(site)/termos-de-uso/page.tsx` com apoio jurídico antes de divulgar. Faltam definir: prazo de retenção, Encarregado (DPO), base legal da atribuição de campanha, transferência internacional e a nota sobre as tags do Google sem cookies. As datas das versões ficam em `src/lib/content.ts` (`PRIVACY_POLICY_VERSION`, `TERMS_VERSION`).

## 5. Marca e compartilhamento

- Ícone do site: `src/app/icon.png`, `src/app/apple-icon.png` e `src/app/favicon.ico`.
- Imagem de compartilhamento: `src/app/opengraph-image.jpg` (texto alternativo em `src/app/opengraph-image.alt.txt`).
- Logos em SVG: `public/brand/monograma*.svg` e `public/brand/simbolo*.svg`. Logo dos dados estruturados: `public/brand/logo-512.png` (10 kB).
- Arquivos que saíram de uso foram para `_arquivo/` (fora do Git): nada foi apagado.
