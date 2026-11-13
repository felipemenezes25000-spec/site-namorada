# DESIGN.md — Especificação de design do site da Dra. Ana Beatriz Lemos Souza

Direção: **"Edição de Consultório"** (editorial). Fonte de verdade para todas as equipes. **Comece pela seção 0**: ela traz o estado vigente e as decisões do diretor, e vale mais que o resto. Onde o texto e o código discordarem, vale o código e o texto deve ser corrigido (as seções 10 a 12 são histórico).

Os números de tipografia e da capa abaixo saíram de rascunhos medidos com as fontes reais, a 390x844 e densidade 1 (os rascunhos não fazem parte do repositório).

Sumário: 0 Estado vigente · 1 Princípios · 2 Tokens · 3 Elementos-assinatura · 4 Componentes · 5 Rotas · 6 Celular, acessibilidade, desempenho, SEO, conteúdo · 7 Não faça · 8 Critérios de aceite · 9 Dono de cada arquivo · 10 a 12 Histórico das correções · 13 Páginas internas

## 0. Estado vigente (reauditoria de novembro de 2026): vale mais que tudo abaixo

**Precedência.** 0 vale mais que 13, que vale mais que o apêndice A (antigas seções 10 a 12), que vale mais que 1 a 9. O apêndice A é o histórico das correções: o que ainda vale delas já está refletido aqui e em 13. Onde o texto antigo e o código discordarem, vale o código, e o texto deve ser corrigido.

### 0.0 Rodada 2 de correções (reconciliado em 13/11/2026)

Vale mais que o resto da seção 0 onde houver conflito. Medido no build de produção local (`next start`) e no site no ar.

- **Aviso de cookies.** Vem aberto no HTML do servidor (aparece na primeira pintura e deixou de ser o maior elemento tardio de `/agendamento`) e some para quem já decidiu pela classe `consent-set`, posta no `<html>` pelo script do `<head>` antes da pintura. Sem JavaScript ele não aparece. Enquanto está aberto, a barra de ações do celular fica recolhida e `--h-bar` vale 0 (aviso e barra nunca disputam a tela). Reaberto por "Gerenciar cookies", o foco entra no aviso; ao decidir, volta a quem abriu (ou ao `<main>`) e um `role="status"` anuncia "Preferências de cookies salvas.". Altura no celular: 107 px a 360x640 (2 linhas de 15 px e botões de 44 px; a meta de 90 px não cabe sem tirar os alvos de 44 px). O campo "Nome completo" de `/agendamento` fica acima do aviso a 360x640 e 375x667; a 320x568, não.
- **Texto ampliado.** Com `html { font-size: 200% }` nenhuma das 21 rotas passa da largura a 390, 360 e 320 px (nem a 150% a 390). Ferramentas: `body { overflow-wrap: break-word }`, `container: pagina` no `<body>` e a regra `@container pagina (max-width: 19.9rem)` (rótulos de botão quebram, cabeçalho sem "Cirurgiã-dentista", listas do rodapé numa coluna); `.num-lg` e `.num-xl` com mínimo limitado pela largura da tela; linhas rótulo/valor (`dt`/`dd`) em flex com quebra.
- **Linha de identidade** (`.idt`): itens em bloco que quebram por dentro; o "·" é desenhado antes de cada item e o do começo de cada linha fica fora da caixa (nenhuma linha começa com "·"). "Dra. Ana", "CRO-SP 177801" e "Freguesia do Ó" não se separam. Títulos de `DisplayHeading` passam por `semQuebraNome` (`utils.ts`): "Dra." nunca termina linha.
- **Sem `content-visibility`** nas seções: a altura da página mudava ao rolar e o axe "frio" acusava contraste falso. Não reintroduzir sem medir seção por seção.
- **WhatsApp com intenção** (`WaIntent` em `whatsapp.ts`): `agendar`, `duvidas`, `urgencia` e `continuar` definem rótulo e mensagem juntos; `WhatsAppCTA` deduz a intenção pela mensagem quando não recebe `intent`. Por rota: urgência = "Falar agora pelo WhatsApp" (rótulo novo do vocabulário); medo, valores e contato = "Tirar dúvidas no WhatsApp"; tratamento = agendar a avaliação daquele tratamento (`waMessages.treatmentBooking`); `/obrigado` = "Continuar no WhatsApp" (sem "Preencher formulário" na barra e no menu).
- **Barra fixa do celular:** some enquanto qualquer `[data-hide-floating]` está na tela: fechos, rodapé e os botões das aberturas (home, tratamentos, apoio, sobre e contato). Um só botão de WhatsApp por tela.
- **Numeral pequeno** (abaixo de 28 px): `.num-sans` e `.idx-n` (Hanken tabular 500). A Bodoni itálica fica para os numerais grandes.
- **Autoria e dados estruturados:** a linha visível diz "Conteúdo informativo do consultório da Dra. Ana Beatriz Lemos Souza, CRO-SP 177801. Atualizado em {data}.". `MedicalWebPage` não tem `author`; tem `@id`, `isPartOf`, `publisher` e, nos tratamentos, `about` (MedicalProcedure). `knowsAbout` sem implante e cirurgia. FAQPage sem a pergunta de pagamento e sem perguntas que já estão na home (`exclusiveFaqs`). Imagem de compartilhamento com `?v=` e tipo JPEG.
- **Sitemap:** `lastmod` só nas páginas que mostram a data (tratamentos, apoio e legais).
- **Formulário:** o envio está em `forms/use-lead-submit.ts` (tempo limite de 20 s e `submissionId` repetido nas tentativas) e os campos em `forms/appointment-form-campos.tsx`. A API descarta o envio repetido e, sem banco, responde `emailed: "pending"` quando o e-mail passa de 8 s (ele termina com `after()`). O e-mail de aviso leva o registro do consentimento: data, hora, versão da política e consentimento de saúde.
- **Supabase:** só a chave de serviço grava e lê; a política "anon can insert leads" sai (`drop policy` em `supabase/schema.sql`).
- **Foto de /sobre e da home:** `public/dra-ana-retrato.jpg` (600x800), recorte de rosto e ombros do original, sem os números de sala e sem remendo em CSS.
- **Tailwind:** larguras `sm`, `tab`, `lg` e `desk`; o /admin usa a paleta `painel` (cores do site com opacidade) e as sombras `shadow-painel` e `shadow-painel-alto`. Saíram `brand.*`, `shadow-card`, `shadow-gold`, `text-display-md` e `ease-out-expo`.
- **public/:** `symbol.png` (909 kB) e `dra-ana.webp` foram para `_arquivo/`; um só ícone de 512 px (`src/app/icon.png`, 11 kB) e o maskable com 9 kB.
- **Desempenho (medido):** `deviceSizes` [390, 640, 828, 1080, 1440]; tags de medição com `lazyOnload` (fila no `dataLayer` e no `fbq` desde a hidratação). `experimental.inlineCss` foi testado e **rejeitado**: com Slow 4G aplicado e CPU 4x o LCP caiu de 2,26 para 1,68 s (home), de 1,86 para 1,22 s (implante), de 1,72 para 1,06 s (agendamento) e de 2,07 para 1,34 s (sobre), mas o HTML foi a cerca de 95 a 100 kB em gzip por página (o CSS vai no `<style>` e de novo no payload do React), contra o teto de 35 kB, e cada navegação baixaria o CSS outra vez. `cssChunking: "strict"` não reduz o número de CSS bloqueantes (3 a 4 arquivos) e não foi adotado. O `browserslist` moderno não mudou o pacote compartilhado (46 kB). JS inicial máximo: 197 kB gzip (`check:site` falha acima de 200; a meta é 150). A divisão do `globals.css` (127 kB, de 19 a 31% usados por página) continua pendente de decisão.
- **Altura no celular:** home com 8.261 px a 390 (8.483 a 360 e 8.932 a 320); rodapé com 861 px a 390 e 906 px a 320.
- **CSS dos módulos:** `scripts/check-css.mjs` (`npm run check:css`, na CI) não deixa crescer o número de espaçamentos em px (108 hoje) e exige comentário em media query fora de 760/1100.
- **Pendências desta rodada:** o aviso de cookies cobre o primeiro campo a 320x568; o JS inicial está acima da meta de 150 kB; 108 espaçamentos em px ainda não viraram token (só os que batiam exatamente com a escala foram trocados); o rodapé passa 11 px da meta de 850 px a 390; o build local no Windows não gera o preload das fontes (o da Vercel gera), então o CLS medido localmente (0,05 nos tratamentos) vem da troca de fonte e deve ser conferido depois da publicação.

### 0.1 Decisões do diretor

1. **Nomes neutros.** Rótulos visíveis: "Implante dentário" e "Remoção de dentes inclusos e cirurgias na boca". O slug `cirurgia-buco-maxilo-facial` não muda. Linhas de currículo de ABO, APCD e IOA dizem "Curso". Nenhum nome de especialidade em texto visível.
2. **Forma de pagamento** (Pix, débito, crédito) não aparece em título, meta, destaque nem bloco de confiança (Código de Ética Odontológica, art. 44, I). Há uma só resposta canônica, `respostas.pagamento` em `content.ts`.
3. **Foto de procedimento em andamento não entra no site** (Resolução CFO-196/2019). `consultorio-4.jpg` e `dra-ana-cirurgia.webp` saíram e estão em `_arquivo/`.
4. **Durações e número de sessões** voltam aos valores publicados antes do redesenho (`git show main:src/lib/treatments.ts`). O que foi inventado no redesenho vira "definida na avaliação".
5. **Formulário:** nenhum campo novo obrigatório. Para menor de idade, uma linha de texto para responsáveis, não um campo. Sem JavaScript não existe rota nova de envio: a página mostra WhatsApp e telefone no lugar do formulário.
6. **E-mail é canal medido:** evento `email_click`.
7. **Arquivos sem uso saem de `public/`** para `_arquivo/` (raiz, ignorada pelo Git), sem apagar.
8. `globals.css` não se divide em vários arquivos e o Prettier só passa em `src` na etapa mecânica final, com comparação de pixels.
9. **Fontes (preload) e as flags `cssChunking` e `inlineCss` do Next ficam com o diretor**: exigem build de produção.
10. **Texto pendente de decisão do dono nunca vai ao ar com marcador:** fica o texto atual e a pendência entra em 0.7.
11. **Altura no celular a 390 de largura:** home até 9300 px e página de tratamento até 7600 px, com o conteúdo recolhido ainda presente no HTML servido.
12. **Nada de foto nova nem de imagem gerada por IA.** Elemento visual novo só em SVG leve ou CSS, dentro deste sistema.

### 0.2 Contratos do núcleo

- **Vocabulário de CTA** (`ui/cta.tsx`, constantes exportadas): `CTA_AGENDAR_WHATSAPP` "Agendar pelo WhatsApp", `CTA_DUVIDAS_WHATSAPP` "Tirar dúvidas no WhatsApp", `CTA_FORMULARIO` "Preencher formulário", `CTA_COMO_CHEGAR` "Como chegar", `CTA_LIGAR` "Ligar" e `CTA_URGENCIA_WHATSAPP` "Falar agora pelo WhatsApp" (só na urgência, ver 0.0). Única exceção: `CTA_CONTINUAR_WHATSAPP` "Continuar no WhatsApp", só depois do envio do formulário. Em desenvolvimento um `console.warn` avisa quando um rótulo foge da lista ou não combina com a mensagem. "Falar pelo WhatsApp" e "Agendar avaliação" **deixam de existir**.
- `AgendarCTA` aceita `treatment` (slug): o link vira `/agendamento?tratamento=<slug>` e o slug segue em `eventParams.treatment` do `scheduling_intent`. `PhoneCTA` sem `label` mostra "Ligar (11) 93922-2289".
- `MapFacade` (`ui/map-facade.tsx`): fachada em arco; o iframe do Google só entra depois do clique em "Ver mapa" (`cta_click`, `target: "map_embed"`). Antes do clique não há requisição a google nem gstatic. Props: `location`, `tone`, `minHeight` (padrão 320, mínimo 220), `showDirections`, `className`.
- `IdentityLine` e `AuthorshipLine` (servidor): "Dra. Ana Beatriz Lemos Souza · CRO-SP 177801 · Vila Bruna, região da Freguesia do Ó" e "Conteúdo informativo do consultório da Dra. Ana Beatriz Lemos Souza, CRO-SP 177801. Atualizado em {data}." A data vem de `CONTENT_UPDATED` (`content.ts`); nunca "revisado clinicamente".
- **Localização em um só lugar:** `locale` e `localeTexto(forma)` em `site-config.ts` (formas `bairroRegiao`, `bairroRegiaoCidade`, `regiaoZona`, `endereco`, `enderecoCurto`). Não escreva bairro, região ou endereço por extenso em componente novo.
- **Respostas canônicas** (`respostas` em `content.ts`): `avaliacao` (custo), `avaliacaoInclui` (o que a consulta tem) e `pagamento`. A pergunta "O que inclui a avaliação?" usa `respostas.avaliacaoCompleta` (o que é, quanto custa e quando vem o orçamento).
- **Escala de espaço** (`globals.css`, `:root`): `--s-1` 4, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 24, `--s-6` 32, `--s-7` 48, `--s-8` 64, `--s-9` 96, `--s-10` 128 (px). Dois breakpoints de layout: 760 e 1100.
- **Numerais em ouro:** `--ouro-numeral` `#8a6a28` (4,74 sobre osso, 4,31 sobre papel, 4,02 sobre areia) para `.num-lg`, `.num-xl` e `.passoNum`; sob tom escuro o token vira `--ouro-claro`. `--ouro` continua só para fios.
- **WhatsApp por rota:** `RouteCtaProvider`, `RouteWhatsAppCTA`, `RouteAgendarCTA` e `useWaRoute()` (`layout/route-ctas.tsx`; função pura `waContextForPath` em `whatsapp.ts`). Barra, cabeçalho, menu e rodapé levam a mensagem e o tratamento da rota.
- **Eventos:** `email_click` entrou em `TrackEventMap`. Conversão é só `lead_created`; `need` leva identificador neutro (tempo, dor, sorriso), nunca o rótulo da situação, e não vai ao Meta Pixel.

### 0.3 Correções ao texto antigo

- `Section` não tem mais a prop `folio` (o trilho usa os `id`s); `SectionHeading` mantém `folio` (texto à direita do título).
- `Reveal` e `WhatsAppFloatingButton` foram apagados. `PhotoPlaceholder`, `TreatmentIcon`, `testimonials` e os apelidos antigos de `Button`, `PageHero` e `SectionHeading` também.
- `BreathingGuide` está em uso: `/medo-de-dentista` o monta e o seletor de situações aponta para ele. A "pendência" de 12 está resolvida.
- "A doutora" na home usa o recorte `dra-ana-recorte.webp` (o arquivo da capa) com enquadramento fechado diferente; não existe mais o retrato `dra-ana-cirurgia.webp`.
- "O consultório" em `/sobre` não leva foto de procedimento: `consultorio-4.jpg` saiu da seção e foi arquivada.
- Dependências: nem `framer-motion` nem `lucide-react` existem. Stack real: Next 15 (App Router), React 19, Tailwind 3, zod, react-hook-form, Bodoni Moda + Hanken Grotesk via `next/font`.
- Rótulos de botão e de envio do formulário: vocabulário fechado de 0.2.

### 0.4 Cabeçalhos de segurança, CSP e cache (`next.config.mjs`)

- **COOP** `same-origin-allow-popups`: isola a janela do site sem quebrar links que abrem em nova aba (WhatsApp, mapa). Também: `X-Content-Type-Options`, `X-Frame-Options SAMEORIGIN`, `Referrer-Policy strict-origin-when-cross-origin`, `Permissions-Policy`, HSTS.
- **CSP.** Só entra domínio que o site usa:
  - `script-src`: googletagmanager.com (GTM e gtag), google-analytics.com, googleadservices.com, googleads.g.doubleclick.net (Ads) e connect.facebook.net (Pixel). Só carregam com o ID da tag e, quando é o caso, depois do aceite.
  - `img-src` e `connect-src`: os mesmos domínios de medição (pings e beacons), mais google.com (conversão) e facebook.com (Pixel).
  - `frame-src`: google.com e maps.google.com (mapa, só depois do clique), googletagmanager.com (noscript do GTM), td.doubleclick.net e bid.g.doubleclick.net (Ads).
  - **Retirados por falta de uso:** `*.supabase.co` do `connect-src` (o Supabase só é chamado pelo servidor), `youtube-nocookie.com` e `facebook.com` do `frame-src`.
  - `'unsafe-inline'` em `script-src` e `style-src` fica **de propósito**: o Next injeta scripts em linha para hidratar e o site tem JSON-LD e o bootstrap do Consent Mode em linha. Tirá-lo exige nonce por requisição (middleware), o que torna todas as páginas dinâmicas e desliga o cache estático. `'unsafe-eval'` só em desenvolvimento.
- **Cache.** Arquivos de `public/` (imagens, inclusive `/brand`) têm 1 dia mais 7 dias de `stale-while-revalidate`, porque os nomes não levam hash: nada ali é `immutable`. `/_next/static` é imutável por conta do próprio Next. Variantes de `next/image` ficam 30 dias. `/admin` é `no-store` e `noindex`.
- **Host.** Em produção (`VERCEL_ENV=production`), `*.vercel.app` redireciona (308) para `www.draanabeatrizodonto.com.br` e qualquer outro host que não seja o www recebe `X-Robots-Tag: noindex, nofollow` (o apex, por exemplo, enquanto não houver redirecionamento no domínio).

### 0.5 Imagens e `public/`

- Em uso: `dra-ana-recorte.webp` (capa), `dra-ana-retrato.jpg` (`/sobre`, "A doutora" na home e JSON-LD); `brand/*.svg` (o painel `/admin` usa `brand/simbolo.svg`) e `brand/icon-maskable-512.png`; o ícone de 512 px é `src/app/icon.png`.
- Logo dos dados estruturados: `brand/logo-512.png` (10 kB, símbolo AB em fundo branco chapado; o `symbol.png` de origem está em `_arquivo/`). O logotipo pesado `logo-vertical-bg.png` (1,2 MB) foi para `_arquivo/`.
- `_arquivo/` (ignorada pelo Git) guarda o que saiu: `consultorio-1..3.png`, `dra-ana-cirurgia.webp`, `tratamentos/*` e os logos PNG pesados sem uso. Nada foi apagado.

### 0.6 Ferramentas e qualidade

- Scripts: `lint` (ESLint 9, `next/core-web-vitals` e `next/typescript`, `--max-warnings 0`), `check:css`, `typecheck`, `test` (Vitest, com cobertura v8 de `src/lib`, `src/app/api` e das ações do painel), `check:site`, `format`, `format:check` e `verify` (format:check, lint, check:css, typecheck, test, build e check:site). A CI roda a mesma sequência e uma auditoria de dependências que avisa sem bloquear; o Dependabot abre atualizações semanais.
- `scripts/check-site.mjs` falha com: colchetes, título e descrição acima do limite, mais de um H1, imagem sem `alt`, canonical ausente, FAQ que não está no texto visível, termos proibidos (inclusive nome de especialidade e forma de pagamento), `lang` diferente de `pt-BR`, falta de viewport, link interno ou imagem que não existe (inclusive `/_next/image?url=`), URL do sitemap que não é página gerada, robots sem `Sitemap` ou com `Host:`, e JS inicial acima de 200 kB gzip (catraca: `JS_BUDGET_KB` muda o limite; a meta é 150).
- O servidor de desenvolvimento não relê `tailwind.config.ts` ao salvar: reinicie para ver cores, breakpoints e `safelist` novos.
- Classes `.t-*`, `.btn-*` e `.idx-*` vivem em `@layer components`: nunca monte o nome com template string.

### 0.7 Pendências do dono e de produção (sem marcador no texto publicado)

- **Dra. Ana confirmar:** horário (`hours`, vazio); estacionamento e acessibilidade (a FAQ ainda afirma "acesso adequado" e "mobilidade reduzida" sem fonte, e a seção de localização diz "fácil acesso pela Av. Edgar Facó" sem fonte); registro de especialidade no CRO, caso queira voltar a usar nome de especialidade; revisão de conteúdo (reativa `lastReviewed`).
- **Jurídico:** prazo de retenção, Encarregado (DPO), base legal da atribuição de campanha, transferência internacional, nota sobre as tags do Google sem cookies.
- **Produção:** `ADMIN_PASSWORD` (12 ou mais) e `ADMIN_SESSION_SECRET` (32 ou mais) na Vercel; conferir o apex e o nome do projeto na Vercel; IDs de medição só depois de a Política de Privacidade descrever as tags; rate limit continua por instância.
- **Diretor:** divisão do `globals.css` (as flags `cssChunking` e `inlineCss` foram testadas, ver 0.0). O Prettier passou no repositório inteiro na rodada 2 e entrou na CI (`format:check`).

---

> **Aviso.** As seções 1 a 9 são a especificação original e podem divergir do código em detalhes (nomes de componentes, rótulos de botão, formas de pagamento, nomes de especialidade). Valem a seção 0 e a 13, depois o código. O histórico das correções (antigas 10 a 12) está no apêndice, no fim do arquivo.

## 1. Princípios

1. **A capa é a tela mais clara do site.** Em 390x844 a pessoa lê quem é, o que faz e vê um botão de WhatsApp, sem esperar JavaScript. Tudo que mexe é decoração; nada que mexe segura conteúdo.
2. **Tipo faz a hierarquia, não caixa.** Escala, serifa Didone e fios de 1px organizam a página. Cartão com borda, sombra ou ícone em círculo está proibido.
3. **Um verbo por tela.** WhatsApp é a ação primária em todo lugar (mesmo botão, mesma cor, mesmo rótulo). Formulário é secundário, ligar e mapa são terciários.
4. **Cada seção tem uma composição diferente.** Nunca duas seções seguidas com a mesma estrutura nem o mesmo tom de fundo.
5. **A serifa só aparece grande.** Serifa romana abaixo de 28px é proibida. Texto corrido, rótulos, botões e formulários são sempre Hanken Grotesk.
6. **O Fio é navegação, não enfeite.** Todo fio dourado orienta, liga ou fecha algo. Cada trecho é local à sua seção; o conteúdo nunca depende dele.
7. **Verdade acima de efeito.** Só vale texto que já existe no repositório (reescrito para ficar mais claro). Sem depoimento, número, prêmio, horário, título ou garantia inventados.

---

## 2. Tokens

Fonte única: variáveis CSS em `src/app/globals.css` (`:root`), espelhadas em `tailwind.config.ts` com `var(--x)`. Cores de texto são sólidas: **proibido** usar opacidade (`/70`, `opacity-60`, `rgba`) em cor de texto. Opacidade só em fios decorativos.

### 2.1 Cores

| Token (Tailwind) | Hex | Uso | Contraste medido |
|---|---|---|---|
| `osso` | `#FBF8F1` | fundo base, cabeçalho, barra | — |
| `papel` | `#F3EDE0` | fundo de seção alternada | — |
| `areia` | `#EFE5D0` | fundo atrás do recorte do retrato, filete de figura | — |
| `verde` | `#22513A` | títulos, botão primário, tinta principal; fundo da seção "Como funciona" | sobre osso 8,59; papel 7,81; areia 7,28 |
| `verde-escuro` | `#1A4230` | hover do botão primário | osso sobre ele 10,61 |
| `noite` | `#0F2A1E` | fundo escuro (A doutora, fecho de página, rodapé, guia de respiração) | osso sobre noite 14,45 |
| `noite-fundo` | `#08170F` | só o guia de respiração em uso (luz baixa) | osso sobre ele > 15 |
| `tinta` | `#16251D` | texto corrido | osso 15,04; papel 13,67; areia 12,75 |
| `tinta-2` | `#44564B` | texto secundário, legendas | osso 7,39; papel 6,72; areia 6,27 |
| `ouro` | `#B69050` | **só** fios, losangos, filetes, arco (decorativo, nunca texto) | osso 2,79 (por isso não é texto); noite 5,18; verde 3,08 |
| `ouro-tinta` | `#76591E` | texto dourado sobre claro (itálicos, numerais, kicker) | osso 6,15; papel 5,59; areia 5,22 |
| `ouro-claro` | `#DCC285` | texto e fios sobre fundo escuro; botão dourado | noite 8,83; verde 5,25 |
| `ouro-hover` | `#E6CF9B` | hover do botão dourado | noite 10,04 |
| `nevoa` | `#C3CEC6` | texto secundário sobre noite e verde | noite 9,46; verde 5,62 |
| `linha` | `#6F7F74` | borda de campo, caixa de seleção, qualquer contorno que carrega informação (>= 3:1) | osso 3,99; papel 3,63 |
| `erro` | `#9E2A2B` | mensagem e borda de campo inválido | osso 7,02; papel 6,38 |
| `luz` | `#9A7A35` | só o brilho do título (ver 3.2) | osso 3,80 (texto grande, >= 3:1) |

Fios decorativos (não carregam informação, podem ser translúcidos): `--fio: rgba(182,144,80,.55)` sobre claro, `--fio-claro: rgba(220,194,133,.45)` sobre escuro.

Tom de seção (Section define; todos os componentes leem estas variáveis, então nenhum componente precisa saber o fundo):

| Variável | osso / papel | noite | verde |
|---|---|---|---|
| `--bg` | osso / papel | noite | verde |
| `--head` (títulos) | verde | osso | osso |
| `--fg` (texto) | tinta | osso | osso |
| `--fg-2` (secundário) | tinta-2 | nevoa | nevoa |
| `--accent` (itálico, numeral, link) | ouro-tinta | ouro-claro | ouro-claro |
| `--rule` (fio) | fio | fio-claro | fio-claro |
| `--focus` | verde | ouro-claro | ouro-claro |

Utilitários Tailwind correspondentes: `bg-bg text-head text-fg text-fg-2 text-accent border-rule`. Proporção: ~70% claro, ~20% verde/noite, ~10% ouro. Sem preto puro, sem terracota, sem gradiente decorativo (único gradiente permitido: o do brilho do título).

**WhatsApp não tem verde próprio.** O botão usa `verde` (sobre claro) ou `ouro-claro` com texto `noite` (sobre escuro). O que o identifica é o ícone de balão e o rótulo.

### 2.2 Tipografia

Famílias, em `src/app/layout.tsx`, via `next/font/google`:

```ts
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";

const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],          // eixo óptico 6..96; peso variável 400..900 (omitir "weight")
  display: "swap",
  variable: "--font-display",
  fallback: ["Didot", "Georgia", "serif"], // sem "Bodoni 72": o next/font não põe aspas e o número invalida a declaração
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],      // peso variável (omitir "weight"); usamos 400, 500 e 600
  display: "swap",
  variable: "--font-sans",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
// <html lang="pt-BR" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
```

Arquivos esperados (latin): Bodoni romano ~46 kB, Bodoni itálico ~54 kB, Hanken ~35 kB = **~135 kB, 3 arquivos, todos com preload** (o itálico aparece acima da dobra no kicker). Orçamento: **<= 150 kB de fontes, no máximo 3 arquivos**. É a única família display e a única sans; qualquer outra fonte é proibida. Cormorant e Montserrat saem do site (o `/admin` cai nas fontes novas, sem problema).

Acentos do português validados (390px e 1440px, densidade 1) em Bodoni romano e itálico: ã, ç, ê, ó, Ó, Ê, Ã, Ç estão corretos e legíveis em peso 500 com `opsz` 11. Cuidado de entrelinha: acentos de cima colidem com a linha de cima quando a entrelinha é menor que 1,0 em corpo pequeno; por isso d1 é 1,0 no celular.

**Eixos ópticos da serifa (decisão medida).** A Bodoni com `opsz` automático em 46px vira fio de cabelo no celular de densidade 1. Regra única, via variáveis em `:root`:

| Faixa | `--d-wght` | `--d-opsz` |
|---|---|---|
| < 760px | 500 | 11 |
| 760 a 1199px | 500 | 28 |
| >= 1200px | 450 | 48 |

```css
.display { font-family: var(--font-display), Didot, "Bodoni 72", Georgia, serif;
  font-weight: var(--d-wght); font-optical-sizing: none;
  font-variation-settings: "opsz" var(--d-opsz); }
```

Itálico pequeno (kicker, folio, numeral, citação, legenda "Fig."): sempre `font-style: italic; font-weight: 500; font-variation-settings: "opsz" 11`.

**Quando a serifa é permitida:**
- Romana, **>= 28px**: H1, H2, H3 de display, linhas do sumário, itens do menu em folha (36px), endereço em destaque, citação (itálica).
- Exceção de marca: o nome "Dra. Ana Beatriz" no cabeçalho (17px romano, peso 500, `opsz` 11).
- Itálica 500 com `opsz` 11, >= 16px: kicker, folio, numerais pequenos, legenda "Fig.", rótulo de campo (18px), crédito de citação.
- **Proibida:** texto corrido, parágrafos de abertura, perguntas de FAQ, botões, navegação do desktop, rodapé, formulário (valor digitado), legendas, qualquer coisa abaixo de 28px que não esteja na lista acima.

**Escala (classes `.t-*` em `globals.css`; não são utilitários do Tailwind, não passe por `cn()` esperando mesclagem):**

| Classe | Família | Tamanho (clamp) | Entrelinha | Tracking | Uso |
|---|---|---|---|---|---|
| `.t-d1` | display | `clamp(2.875rem, .9rem + 7vw, 6.75rem)` (46px a 108px) | 1,0; 0,95 a partir de 1100px | -0,022em | H1 da capa |
| `.t-d1i` | display | `clamp(2.5rem, 1.1rem + 5vw, 5.25rem)` (40px a 84px) | 1,02 | -0,02em | H1 das páginas internas |
| `.t-d2` | display | `clamp(2.5rem, 1.6rem + 3.2vw, 4rem)` (40px a 64px) | 1,04 | -0,02em | H2 de seção |
| `.t-d3` | display | `clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem)` (28px a 44px) | 1,14 | -0,012em | declaração, H3 grande, endereço |
| `.t-d4` | display itálico | `clamp(1.75rem, 1rem + 4vw, 4.5rem)` (28px a 72px) | 1,12 (1,08 a partir de 1100px) | -0,01em | citação monumental |
| `.t-row` | display | `clamp(1.75rem, 1rem + 2.2vw, 2.75rem)` (28px a 44px) | 1,1 | -0,01em | linha do sumário |
| `.t-lead` | sans 400 | `clamp(1.25rem, 1.1rem + .6vw, 1.5rem)` (20px a 24px) | 1,45 | 0 | parágrafo de abertura (cor `--fg`) |
| `.t-body` | sans 400 | `clamp(1.0625rem, 1rem + .2vw, 1.1875rem)` (17px a 19px) | 1,6 | 0 | texto corrido (cor `--fg-2` em apoio, `--fg` em destaque) |
| `.t-sm` | sans 400 | `.9375rem` (15px) | 1,5 | 0 | apoio, rodapé |
| `.t-cap` | sans 400 | `.8125rem` (13px) | 1,45 | .01em | legenda, aviso (**piso do site**; nunca abaixo de 13px) |
| `.t-kicker` | display itálico 500 | `clamp(1.0625rem, .95rem + .5vw, 1.5rem)` (17px a 24px) | 1,3 | 0 | linha-chamada acima do título |
| `.t-folio` | display itálico 500 | `1.125rem` (18px) | 1 | 0 | "Fig. 1", "Sumário", "01" |
| `.t-label` | sans 500 | `1rem` (16px) | 1,2 | 0 | botões, navegação, links de ação |

Regras: **nenhuma caixa-alta** (sem `uppercase`, sem `tracking-widest`); pesos sans só 400, 500 e 600 (600 só em `<strong>` de texto legal); `text-wrap: balance` em todo título, `text-wrap: pretty` em parágrafo; `hyphens: manual`; e-mails e URLs com `overflow-wrap: anywhere`. Numerais: Hanken com `font-variant-numeric: lining-nums tabular-nums` em telefone, CEP, CRO e horários; Bodoni itálica com `font-feature-settings: "lnum"`. Numeração só onde há sequência real (sumário, passos).

**Sem acento de uma palavra só no título.** O contraste vem do kicker em itálico acima do título, nunca de uma palavra dourada no meio dele (isto retira o "cuidado"/"Freguesia do Ó" dourados do site antigo).

Link em texto corrido: cor `--head`, sublinhado 1px `ouro`, `text-underline-offset: .2em`; hover sublinhado 2px.

### 2.3 Grade e espaçamento

- **Container** (`.wrap`): `max-width: 1480px; margin-inline: auto; padding-inline: var(--pad)`; `--pad: clamp(20px, 5.2vw, 72px)`. Com trilho (>= 1100px, páginas com `FioRail`), `padding-left: calc(var(--pad) + var(--rail))` e `--rail: 56px`; sem trilho `--rail: 0`.
- **Grade** (`.grid12`): 12 colunas, `column-gap: clamp(16px, 2.4vw, 32px)`, uma coluna abaixo de 760px. Composições assimétricas: 7/5, 5/7, 8/4; **nada centralizado** (exceções: arco de sorriso e a página 404 usam eixo à esquerda também).
- **Breakpoints** (Tailwind, `extend.screens`; **não** substitua `sm/md/lg/xl`, o admin os usa): `xs: 375px`, `tab: 760px`, `desk: 1100px`, `wide: 1440px`. O site usa só estes quatro. `desk` é onde entram trilho, menu horizontal e capa em duas colunas.
- **Ritmo vertical** (`.sec`, padding-block de toda seção): `--sec-y: clamp(5.5rem, 3.5rem + 6.2vw, 8.75rem)` (88px no celular a 140px no desktop). Entre kicker e título 12px; título e conteúdo 36px (celular) / 56px (desktop); entre parágrafos 1,1em.
- **Escala de espaço** (Tailwind padrão, múltiplos de 4px). Valores arbitrários `[Npx]` só para os números deste documento; ESLint não proíbe, a revisão de código sim.
- **Largura de leitura:** texto corrido `max-width: 34rem` (aprox. 62 caracteres) em apoio; `Prose` 62ch; títulos `max-width: 22ch` quando declaração.

### 2.4 Raios, bordas, sombras

- Raio: **0 em tudo**, exceto (a) o arco do retrato (`border-radius: 999px 999px 0 0`) e (b) botões e chips em pílula (`999px`). Campos de formulário: raio 0, só linha inferior.
- Bordas: sempre 1px; cor `--rule` (decorativa) ou `linha` (quando carrega informação, como campo e caixa de seleção). Fio duplo (masthead): 1px + 1px a 5px de distância.
- Sombra: **uma só**, `--sombra-botao-fixo: 0 10px 28px -12px rgba(15,42,30,.55)`, no botão de WhatsApp da barra fixa e no botão flutuante. Profundidade vem de fio, de plano de cor e do filete deslocado de 14px.

### 2.5 Camadas fixas

Todas as alturas e camadas são variáveis em `:root`; nenhum componente usa número solto.

```css
:root{
  --h-header: 56px;                       /* >= 760px: 72px; >= 1100px: 76px */
  --h-bar: calc(72px + env(safe-area-inset-bottom));   /* >= 760px: 0px */
  --h-cookie: 0px;                        /* CookieConsent grava a altura real enquanto aberto */
  --z-rail: 30; --z-flutuante: 35; --z-bar: 40; --z-cookie: 42; --z-header: 50; --z-skip: 100;
}
html { scroll-padding-top: calc(var(--h-header) + 16px);
       scroll-padding-bottom: calc(var(--h-bar) + var(--h-cookie) + 16px); }  /* foco nunca fica sob a barra */
.site-shell { padding-top: var(--h-header); padding-bottom: var(--h-bar); }   /* envolve só as páginas públicas (o /admin fica de fora); substitui o espaçador de 60px */
```

- Cabeçalho: `position: fixed; top: 0`, fundo `osso` sólido (sem blur), fio inferior 1px `--fio`; z `--z-header`. O fio de progresso (3.1) mora dentro dele.
- Barra de ações (celular, < 760px): `position: fixed; bottom: 0`, fundo `osso` sólido, fio superior 1px `--fio`, padding 10px, altura 72px + safe-area; z `--z-bar`.
- Aviso de cookies: ver 4 (`CookieConsent`); celular: `bottom: var(--h-bar)` (**acima** da barra, nunca sobre ela); z `--z-cookie`.
- Botão flutuante: **removido** (DESIGN.md 12). O cabeçalho (>= 760px) e a barra fixa (< 760px) já trazem o WhatsApp; um terceiro botão idêntico só repetia o pedido.
- Menu em folha: `<dialog>` modal (camada superior do navegador, ignora z-index).
- `viewport` em `layout.tsx`: `viewportFit: "cover"`, `themeColor: "#FBF8F1"`, `colorScheme: "light"`.

### 2.6 Movimento

| Token | Valor | Uso |
|---|---|---|
| `--ease-fio` | `cubic-bezier(.65, 0, .35, 1)` | desenhar fios, brilho do título |
| `--ease-toque` | `cubic-bezier(.16, 1, .3, 1)` | resposta ao toque, hover, trocas de painel |
| `--d-toque` | 180ms | hover de cor, pressionar |
| `--d-base` | 400ms | sublinhado de navegação, abrir/fechar |
| `--d-painel` | 600ms | troca do cartão do sumário (fade) |
| `--d-fio` | 1400ms | fio horizontal que se desenha |
| `--d-luz` | 1800ms | brilho no título |
| `--d-arco` | 2400ms | arco do retrato |
| `--d-retrato` | 1200ms | retrato recupera a cor ao passar o cursor |

**Anima:** o arco da capa (uma vez, 2,4s); o brilho do H1 (uma vez, 1,8s, atraso 0,6s); fios horizontais ao entrar na tela (1,4s, uma vez); o fio de progresso; o trilho; a conexão do seletor de situação (0,9s); o cartão do sumário (fade 0,6s); o retrato de "A doutora" (duotone vira cor ao passar o ponteiro, 1,2s); pressionar botão (`scale(.98)`, 180ms); sublinhado da navegação (0,4s); sinal de mais/menos do FAQ (0,4s); o guia de respiração.

**Nunca anima:** títulos (exceto o brilho, que não muda opacidade nem posição), parágrafos, botões de conversão (exceto pressionar), imagens (sem parallax, sem fade-up, sem zoom), barra fixa, aviso de cookies, formulário. Sem cursor customizado, sem rolagem suspensa, sem animação infinita.

**Acima da dobra:** nada começa invisível. Só o arco e o brilho animam, ambos em CSS, ambos com o estado final já correto no HTML (a animação usa `animation-fill-mode: backwards`, não `both`/`opacity: 0`). Delay máximo acima da dobra: 0,6s (brilho) e 0,25s (arco).

**`prefers-reduced-motion: reduce`:** global em `globals.css`:

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation:none !important; transition:none !important; scroll-behavior:auto !important; }
  .fio-h::before{ transform:none !important; }
}
```
O fio aparece inteiro e parado, o brilho não ocorre (texto verde sólido), o guia de respiração vira texto, o trilho avança sem transição.

**Bibliotecas:** CSS por padrão (e WAAPI na reordenação do `TreatmentIndex`). `framer-motion` **não é mais importado em lugar nenhum** do site (o seletor nunca o usou); o pacote saiu do `package.json` e do lockfile. Não reintroduza.

---

## 3. Elementos-assinatura

### 3.1 O Fio

Fio de ouro de 1px, herdado do desenho em linha do logotipo. Cada trecho é um SVG ou pseudo-elemento **local à sua seção**, com geometria **calculada a partir de proporções fixas**, nunca de `getBoundingClientRect` de elementos distantes nem de um path único para a página. Se o fio falhar, a página continua inteira.

**Uso 1 — Arco do retrato na capa** (`ArchPortrait`, servidor, só CSS).
Geometria fixa em unidades de uma viewBox `0 0 1072 1100`. O contêiner tem `aspect-ratio: 1072 / 1100` (a altura vem da largura, sem medir nada):

- Arco externo (o fio): `M1.5 1100V536A534.5 534.5 0 0 1 1070.5 536V1100`, `stroke: var(--ouro)`, `stroke-width: 3` (equivale a ~1px a 350px de largura e ~1,5px a 520px), `fill: none`, `pathLength="1"`, `stroke-dasharray: 1; stroke-dashoffset: 0`.
- Fundo atrás do recorte (`areia`): `left/right: 3.358%` (36/1072), `top: 3.27%` (36/1100), `bottom: 0`, `border-radius: 999px 999px 0 0` (arco concêntrico de raio 500; distância constante de 34,5 unidades até o fio).
- Retrato `public/dra-ana-recorte.webp` (1014x1184, alfa): `left: 3.358%; bottom: 0; width: 93.28%; height: auto` (= 1000/1072). Por ser mais alto que a moldura, a cabeça sobe ~36 unidades **acima do fio** no topo: o recorte passa **na frente** do arco (ordem: fundo, SVG do fio, imagem). O wrapper reserva essa folga: `padding-top: clamp(14px, 4.2vw, 34px)`; o contêiner tem `overflow: visible`.
- Entrada: `@media (prefers-reduced-motion: no-preference){ .arco path{ animation: desenha var(--d-arco) var(--ease-fio) .25s backwards } } @keyframes desenha{ from{ stroke-dashoffset:1 } to{ stroke-dashoffset:0 } }`. Sem esse media, ou sem animação, o arco já está inteiro (estado-base é `offset: 0`). Não use classe `.js`.
- Imagem: `next/image`, `priority`, `width=1014 height=1184`, `quality={72}`, `sizes="(min-width:1100px) 480px, (min-width:760px) 44vw, 92vw"`, `alt="Retrato da Dra. Ana Beatriz Lemos Souza, sorrindo, de jaleco branco"`; classes `absolute left-[3.358%] bottom-0 w-[93.28%] h-auto`. Nunca `mix-blend-mode`.
- Legenda fora do contêiner: `<figcaption>` com `.t-folio` "Fig. 1" + `.t-cap` "Dra. Ana Beatriz Lemos Souza, cirurgiã-dentista. Atendimento particular, sem convênios." (texto verdadeiro e já existente).
- Verificado em rascunho (390x844): o fio desenha, a cabeça cruza o fio, os ombros ficam dentro do arco, sem halo cinza nas bordas do recorte.

**Uso 2 — Trilho (desktop) e fio de progresso (celular).**
- `FioProgress` (celular e tablet, < 1100px): `<div class="fio-prog" aria-hidden>` dentro do cabeçalho, `position:absolute; left:0; bottom:0; width:100%; height:2px`; trilho 1px `--fio` com `<i>` de 2px `ouro-tinta` `transform-origin:0 50%; transform: scaleX(var(--p))`. Com `@supports (animation-timeline: scroll())` usa `animation: prog linear both; animation-timeline: scroll(root block)` (sem JS). Sem suporte: ilha cliente com listener passivo + `requestAnimationFrame` que grava `--p = scrollY / (scrollHeight - innerHeight)`; ela não monta quando o CSS suporta. Existe em todas as páginas.
- `FioRail` (>= 1100px; **hoje só na home**; as demais páginas reservam o mesmo gutter mas ainda não montam o trilho): ver DESIGN.md 12 (um losango por seção, tom por peça, fora da ordem de Tab). Posição, preenchimento e alvos de 44px seguem o texto original abaixo, onde não contrariar a seção 12. `position: fixed; left: var(--pad); top: calc(var(--h-header) + 24px); bottom: 40px; width: 44px; z-index: var(--z-rail)`. Recebe `stops: {id, label}[]` (máx. 7: um por folio real da página; o numeral "0N" acompanha a seção atual). **Os pontos são equidistantes** (`top: calc(i / (N-1) * 100%)`), não proporcionais ao documento: nada de medir a página inteira. Estado: um `IntersectionObserver` (`rootMargin: "-40% 0px -55% 0px"`) descobre a seção atual `i`; a cada frame de rolagem só a seção atual é medida (`(innerHeight*.4 - rect.top) / rect.height`, limitado a 0..1) e o preenchimento é `scaleY((i + p) / (N-1))`. Elementos: numeral itálico `.t-folio` em `ouro-tinta` ("01" a "0N", `aria-hidden`), fio vertical 1px `--fio` com `<i>` `ouro-tinta`, losangos 9x9 (borda 1px `ouro-tinta`, fundo `osso`; atual: preenchido e `scale(1.25)`), cada losango é `<a href="#id" aria-label="Ir para {label}">` com alvo de 44x44 e rótulo `.t-cap` que aparece ao hover/foco; texto vertical "CRO-SP 177801" (`.t-cap`, `writing-mode: vertical-rl`, rotação 180°). Sobre seção `noite` ou `verde` o trilho **inverte** (cores `ouro-claro`/`nevoa`): um segundo `IntersectionObserver` observa `section[data-tone]` e `footer[data-tone]` (cartões internos com `data-tone`, como o cartão noite do sumário, não contam) na mesma faixa (`-40% 0 -55% 0`) e guarda o tom da última seção, na ordem do documento, que cruza a faixa (sem `elementFromPoint`). Em telas largas o trilho acompanha a coluna: `left: max(var(--pad), calc((100vw - 1480px) / 2 + var(--pad)))`. **Some** (`data-rail-hidden`, opacidade 0) quando o rodapé entra na tela. `<nav aria-label="Posição na página">` montado **depois** do conteúdo no DOM (é `position: fixed`; o visual não muda e teclado e leitor de tela chegam antes ao H1 e ao botão da capa). Sem JS, o trilho não existe (a página não depende dele). A página que usa `FioRail` envolve o conteúdo em `<div class="has-rail">` **no servidor** (reserva os 56px de `--rail` desde o primeiro render, sem salto de layout); nunca ative a margem por efeito cliente.

**Uso 3 — Liga a situação escolhida aos tratamentos** (`SituationSelector`, ver 4). No desktop (>= 1100px): duas listas de linhas de altura fixa `--row-h: 68px`; a situação escolhida na esquerda (índice `s`) e os tratamentos indicados reordenados para o topo da direita (índices `0..k-1`). O conector é um SVG de **largura fixa 120px** e altura `N*68px`, com `path` `M0 {s*68+34} C 60 {s*68+34}, 60 {j*68+34}, 120 {j*68+34}` para cada indicado `j`, `stroke: var(--ouro)`, `stroke-width: 1`, desenhado por `stroke-dashoffset` em 0,9s (`key` muda a cada escolha para reiniciar). Posições vêm só de índices, nunca de medição do DOM. No celular: o painel de resposta fica sob a situação escolhida e os indicados aparecem numa lista ligada por um fio vertical de 1px à esquerda (`border-left` que cresce por `scaleY`).

**Uso 4 — Arco de sorriso em volta do botão final** (`FioSmile`, servidor). SVG `viewBox 0 0 520 130`, `preserveAspectRatio="xMidYMax meet"`, `width: min(100%, 520px)`, `path d="M6 36 C 70 118, 170 126, 260 126 C 350 126, 450 118, 514 36"`, `stroke: var(--ouro-claro)` sobre escuro ou `var(--ouro)` sobre claro, `stroke-width: 1.6`, `pathLength="1"`. O botão de WhatsApp (altura 52) fica centralizado sobre o vale do arco: wrapper `position: relative; padding-bottom: 36px`, botão no topo, SVG absoluto na base; as pontas do arco sobem até a altura do botão. Desenha ao entrar na tela (1,6s, uma vez). Usado **uma vez por página**, no fecho. Sem o fio, o botão continua sozinho.

**Uso 5 — Linhas que se desenham** (`FioRule`, `.fio-h`). Todo divisor é uma linha de 1px que cresce da esquerda para a direita (`transform: scaleX(0 -> 1)`, `transform-origin: 0 50%`, `--d-fio`, `--ease-fio`, uma vez). Aplica-se também às linhas de `IndexList` (atraso `calc(var(--i) * 60ms)`, máximo 8 passos). O estado-base é **visível**; só com `html.js` e antes de entrar na tela a linha está recolhida:
```css
html.js .fio-h:not(.in)::before{ transform: scaleX(0) }
.fio-h::before{ content:""; position:absolute; inset:0; background: var(--rule); transform-origin:0 50%; transition: transform var(--d-fio) var(--ease-fio) }
```
`html.js` é posto por um script inline no `<head>` do `layout.tsx` (`document.documentElement.classList.add('js')`). `RevealObserver` (cliente, ~0,5 kB, montado uma vez no layout do site) observa `[data-reveal]` e adiciona `.in` uma vez. **Nada acima da dobra usa `data-reveal`.** Fios da capa são estáticos.

### 3.2 A luz que atravessa o título (uma vez)

Classe `.luz` no H1 da capa e no H1 de todas as páginas internas. Só CSS, só com movimento permitido; o texto está visível o tempo todo:

```css
@media (prefers-reduced-motion: no-preference){
  .luz{ background-image: linear-gradient(100deg, var(--verde) 0 40%, var(--luz) 50%, var(--verde) 60% 100%);
        background-size: 300% 100%; background-position: 100% 0;
        -webkit-background-clip: text; background-clip: text;
        color: transparent; -webkit-text-fill-color: transparent;
        animation: luz var(--d-luz) var(--ease-fio) .6s backwards; }
  @keyframes luz{ from{ background-position: 100% 0 } to{ background-position: 0 0 } }
}
/* polimento no ponteiro (só mouse): repete a passada */
@media (hover:hover) and (prefers-reduced-motion: no-preference){
  .luz{ transition: background-position .9s var(--ease-fio) }
  .luz:hover{ background-position: 0 0 }
}
@media (forced-colors: active){ .luz{ background:none; -webkit-text-fill-color: currentColor; color: CanvasText } }
```
O H1 da capa em tom `noite`/`verde` (raro) usa `--head`; o gradiente troca `var(--verde)` por `var(--osso)` e `var(--luz)` por `var(--ouro-claro)`. Sem WebGL, sem iridescência, sem giroscópio. O brilho **não** altera layout nem opacidade (não afeta o LCP).

### 3.3 Numerais e legendas editoriais

- **Numeral** (`Numeral`): Bodoni itálica 500, `opsz` 11 abaixo de 40px, cor `--accent`. Tamanhos: `sm` 18px (folio), `md` 28px, `lg` `clamp(5rem, 12vw, 9rem)` (numeral de capítulo, `opsz` do token), `xl` `clamp(9rem, 26vw, 18rem)` (decorativo no hero interno, cor `ouro`, `aria-hidden`, nunca carrega informação sozinho).
- **Legenda de figura:** `Fig. N` em `.t-folio` + texto em `.t-cap` (`--fg-2`), 16px abaixo da imagem, alinhada à esquerda, numeração contínua por página (Fig. 1, Fig. 2). A legenda descreve o que é verdade.
- **Folio de seção:** à direita do título de seção (desktop) ou abaixo (celular), `.t-folio` ("Sumário", "A doutora").
- **Sumário:** numeral itálico à esquerda da linha e número de página à direita (`01`..`08`), ligados por pontilhado de 1px `ouro` (`border-bottom: 1px dotted var(--ouro)`).

### 3.4 Retrato recortado passando na frente do arco

Especificado em 3.1, uso 1. Regras gerais: o recorte (`dra-ana-recorte.webp`) só aparece na **capa da home** (`ArchPortrait`). Nas outras páginas usa-se `dra-ana.webp` (fundo cinza) em `Figure` com filete, nunca recortado dentro de arco. `dra-ana-cirurgia.webp` em "A doutora": duotone verde (`filter: grayscale(1) contrast(1.05) brightness(.95)` + camada `::after` `background: var(--verde); mix-blend-mode: color; opacity: .78`) que volta à cor com `:hover` (apenas `@media (hover:hover)`), moldura com filete deslocado 14px (`::before { inset: 14px -14px -14px 14px; border: 1px solid var(--ouro) }`).

---

## 4. Inventário de componentes

Convenção: `S` = componente de servidor (sem `"use client"`), `C` = cliente. Props em TypeScript resumido. Todos aceitam `className`. Caminhos novos usam kebab-case.

**Regra do admin.** `src/components/admin/*` e `src/app/admin/*` não mudam de visual nem de lógica. Como `admin-login.tsx` importa `Input`, `Label`, `Button` e `BrandSymbol`, a Fundação **move as versões atuais** de `ui/field.tsx` (Input, Label), `ui/button.tsx` (Button) e `ui/logo.tsx` (BrandSymbol) para `src/components/admin/admin-ui.tsx` (copiadas sem alteração) e muda só as linhas de importação em `admin-login.tsx`/`admin-dashboard.tsx` (e `lead-status-badge.tsx` fica onde está). O admin continua usando `brand-*`, `container`, `surface`, `font-display`, `rounded-3xl`, `no-scrollbar`: ver "legado" em 9.

### 4.1 Base e tipografia

| Componente | Caminho | Tipo | Props e variantes |
|---|---|---|---|
| `Section` | `ui/section.tsx` | S | `tone: "osso" \| "papel" \| "noite" \| "verde"` (default `osso`); `id?`; `folio?: string` (aceito e ignorado: não gera `data-folio`; ver 0.3); `spacing?: "default" \| "compact" \| "none"` (default `.sec`; `compact` = metade); `aria-labelledby?`; `as?: "section" \| "div"`. Grava `data-tone`, define as variáveis de 2.1 e o fundo. |
| `Container` | `ui/container.tsx` | S | `.wrap`; `bleed?: "right"` (a imagem sangra até a margem direita sem rolagem horizontal: `margin-right: calc(-1 * var(--pad))` e o pai tem `overflow-x: clip`). |
| `Eyebrow` | `ui/eyebrow.tsx` | S | `.t-kicker`, cor `--accent`; `rule?: boolean` (fio de 24px à esquerda); `as?: "p" \| "span"`. Nunca caixa-alta. |
| `DisplayHeading` | `ui/display-heading.tsx` | S | `level: 1\|2\|3\|4`; `size: "d1" \| "d1i" \| "d2" \| "d3" \| "d4" \| "row"`; `luz?: boolean` (default `true` quando `level=1`); `kicker?: ReactNode` (renderiza o kicker **dentro** do mesmo heading, como `<span class="t-kicker block">`, para o H1 da capa); cor `--head`. |
| `SectionHeading` | `ui/section-heading.tsx` | S | `eyebrow?`, `title`, `folio?` (itálico à direita), `lede?` (`.t-lead`), `level?: 2\|3` (default 2), `size?: "d2" \| "d3"`; alinhado à esquerda. Substitui o atual. |
| `Numeral` | `ui/numeral.tsx` | S | `children`, `size: "sm"\|"md"\|"lg"\|"xl"`, `decorative?: boolean` (default `true` para `xl`, aplica `aria-hidden`). |
| `FioRule` | `brand/fio-rule.tsx` | S | `orientation?: "h" \| "v"`; `double?: boolean` (fio duplo de masthead); `tone?: "auto" \| "claro"` (auto lê `--rule`); `reveal?: boolean` (default `true`: marca `data-reveal` e desenha ao entrar); `delay?: number` (ms). Marcação: `<div class="fio-h" role="presentation">`. |
| `Figure` | `ui/figure.tsx` | S | `src`, `alt`, `width`, `height`, `n?: number` (gera "Fig. n"), `caption?: ReactNode`, `ratio?: "4/5" \| "1/1" \| "16/10" \| "natural"`, `frame?: "filete" \| "none"` (filete deslocado 14px em `ouro`), `duotone?: boolean`, `priority?: boolean`, `sizes`. `<figure>` + `<figcaption>`. Sem raio, sem sombra. `alt` obrigatório (decorativa: `alt=""` e sem legenda). |
| `ArchPortrait` | `ui/arch-portrait.tsx` | S | Sem props obrigatórias; `priority` default `true`. Implementa 3.1 uso 1. Só uma vez por página. |
| `IndexList` | `ui/index-list.tsx` | S | `items: { n?: string; title: ReactNode; description?: ReactNode; meta?: string; href?: string; current?: boolean }[]`; `variant: "sumario" \| "passos" \| "fatos" \| "contatos"`; `as?: "ol" \| "ul"`; `size?: "row" \| "d3"`. **sumario:** numeral itálico + título `.t-row` + pontilhado + nº de página; cada linha é `<a>` (alvo >= 56px); fio superior 1px `verde`, demais `--rule`. **passos:** numeral `lg` itálico à esquerda, título `.t-d3`, descrição `.t-body`; fios entre passos. **fatos:** losango 7px vazado em `--accent` + frase `.t-body`. **contatos:** rótulo `.t-cap` + valor `.t-d3` (cada valor com `overflow-wrap: anywhere`, `min-w-0`). Linhas usam `.fio-h`. |
| `Reveal` | removido | | **Não existe mais** (`ui/reveal.tsx` apagado). `RevealObserver` (`motion/reveal-observer.tsx`) continua; fios e listas marcam `data-reveal` direto. |
| `Prose` | `ui/prose.tsx` | S | Páginas de texto: coluna única de `62ch`; `aside` opcional para notas laterais (`.t-cap`, só >= 1100px, coluna 8 a 11). `h2` em `.t-d3` com fio superior; `h3` Hanken 500 20px; `p` `.t-body`; listas com losango; links sublinhados. |
| `icons` | `ui/icons.tsx` | S | `WhatsAppIcon, PhoneIcon, MapPinIcon, MailIcon, InstagramIcon, CalendarIcon, ArrowIcon, PlusIcon`; SVG 24x24, `fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round`, `aria-hidden`, `size` default 20. Caminhos: balão `M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20z`; fone `M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z`; pino `M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z` + círculo (12,10.5) r2.3; e-mail `M3.5 6.5h17v11h-17z M3.5 7l8.5 6.5L20.5 7`; calendário `M4 6.5h16V20H4z M4 10.5h16 M8 4v4 M16 4v4`; Instagram retângulo 4,4 16x16 r5 + círculo (12,12) r3,6 + ponto (17,7) r.6; seta `M4 12h15 M13.5 6.5 19 12l-5.5 5.5`; mais `M12 5v14 M5 12h14`. `lucide-react` saiu do projeto; o painel `/admin` tem os próprios ícones em `components/admin/admin-icons.tsx`. |

### 4.2 Conversão e medição

| Componente | Caminho | Tipo | Props e variantes |
|---|---|---|---|
| `Button` / `ButtonLink` | `ui/button.tsx` | S | `variant: "primario" \| "contorno" \| "ouro" \| "contorno-claro" \| "texto"`; `size: "md" (52px) \| "sm" (44px)`; `iconLeft?`, `iconRight?`; `buttonClasses(variant, size)` exportada. **primario:** fundo `verde`, texto `osso`, hover `verde-escuro`. **contorno:** transparente, `box-shadow: inset 0 0 0 1px var(--verde)`, texto `verde`, hover fundo `verde` a 7% (use `color-mix(in srgb, var(--verde) 7%, transparent)`). **ouro** (sobre `noite`/`verde`): fundo `ouro-claro`, texto `noite`, hover `ouro-hover`. **contorno-claro** (sobre escuro): inset 1px `ouro-claro`, texto `osso`. **texto:** sem fundo, sublinhado `ouro`. Pílula 999px, `px 28px` (md) / `20px` (sm), `.t-label`, `gap 12px`, ícone 20px, `:active { transform: scale(.98) }`. Variante é escolhida pelo tom: dentro de `noite`/`verde` use `ouro`/`contorno-claro`. `Button` HTML (`<button>`) e `ButtonLink` (`next/link` ou `<a>`) compartilham as classes. |
| `TrackedLink` | `ui/tracked-link.tsx` | C | `href`, `event: TrackEvent`, `eventParams?: Record<string, string \| number \| boolean>`, `external?`, `className`, `children`, `aria-label?`. Chama `track(event, eventParams)` no clique. Links externos ganham `target="_blank" rel="noopener noreferrer"` e `<span class="sr-only"> (abre em nova aba)</span>`. É a única ilha cliente dos CTAs; só recebe valores primitivos. |
| `WhatsAppCTA` | `ui/cta.tsx` | S (usa `TrackedLink`) | `location: string` (obrigatório; vira `eventParams.location`), `message?: string` (default `waMessages.default`), `label?: string` (default **"Agendar pelo WhatsApp"**), `variant?`, `size?`, `compactLabel?: string` (rótulo curto abaixo de 375px; só na barra: "WhatsApp"). Evento `whatsapp_click`. `href = whatsappLink(message)`. Ícone `WhatsAppIcon` à esquerda. |
| `PhoneCTA` | idem | S | `location`, `as?: "botao" \| "texto"` (`variant` continua sendo a variante do botão), `iconOnly?` (aria-label "Ligar para (11) 93922-2289"), evento `phone_click`, `href = tel:+55...` |
| `MapCTA` | idem | S | `location`, `variant?`, `label?` (default "Como chegar"); evento `map_click`; `href = siteConfig.address.mapsDirectionsUrl`, externo |
| `AgendarCTA` | idem | S | `location`, `label?` (default "Preencher formulário"), `iconOnly?`; evento `scheduling_intent`; `href="/agendamento"` |

**Todo** link de WhatsApp, telefone, mapa e agendamento do site passa por estes quatro; link cru para `wa.me`, `tel:` ou Maps é proibido (a auditoria achou botões sem medição). Eventos e parâmetros mantêm os nomes atuais (`whatsapp_click`, `phone_click`, `map_click`, `scheduling_intent`, `cta_click`, `care_need_click`, `treatment_card_click`, `form_start`, `appointment_form_submit`, `lead_created`, `instagram_click`) e o parâmetro `location`. Valores de `location` existentes continuam: `hero`, `header`, `mobile_bar`, `mobile_menu`, `floating`, `location_section`, `how_it_works`, `contact_page`, `thank_you`, `care_needs`.

### 4.3 Marca, cabeçalho e rodapé

| Componente | Caminho | Tipo | Detalhe |
|---|---|---|---|
| `Monogram` | `brand/logo.tsx` | S | `size` (default 32), `tone: "escuro" \| "claro"` (escolhe `/brand/monograma.svg` sobre fundo claro ou `/brand/monograma-claro.svg` sobre escuro). `<img>` simples (SVG não passa por `next/image`), `width/height` iguais, `alt=""` quando há texto ao lado. Para tamanhos <= 64px. |
| `Symbol` | `brand/logo.tsx` | S | Símbolo completo (AB + mandíbula): `/brand/simbolo.svg` (claro) e `/brand/simbolo-claro.svg` (escuro); `size`, `decorative?` (marca d'água: `opacity: .07`, `aria-hidden`). Só em tamanhos >= 96px (rodapé, 404, obrigado, "A doutora"). |
| `Logo` | `brand/logo.tsx` | S | Lockup do cabeçalho: `Monogram` 32px + coluna: "Dra. Ana Beatriz" (Bodoni romana 500, 17px, `opsz` 11, `--head`) e "Cirurgiã-dentista" (`.t-cap`, `--fg-2`). No desktop >= 1100px o nome vira "Dra. Ana Beatriz Lemos Souza". `<a href="/" aria-label="Dra. Ana Beatriz Lemos Souza, página inicial">`. O PNG antigo (`symbol.png`) sai do front; fica no repositório só para JSON-LD. |
| `Header` | `layout/header.tsx` | S + `NavLinks` (C, `usePathname` para `aria-current="page"`) + `MenuSheet` (C) | Altura `--h-header`. Fundo `osso`, fio inferior, `FioProgress`. Ver "Navegação" em 5.0. < 1100px: `Logo` + botão **Menu** (44px de alto, texto "Menu" `.t-label` + dois traços de 22x7px; `aria-expanded`, `aria-controls`); >= 760px adiciona o botão `WhatsAppCTA size="sm"`. >= 1100px: `Logo` + `NavLinks` + botão. Links: `.t-label` 15px, cor `fg-2`, ativo `head` com `aria-current`, sublinhado `ouro` que desenha por `background-size` em `--d-base` no hover. |
| `MenuSheet` | `layout/menu-sheet.tsx` | C | `<dialog>` modal (`showModal()`), tela cheia, fundo `osso`, Esc fecha (nativo), foco devolvido ao botão. Topo repete `Logo` e botão "Fechar". Lista em Bodoni 36px (`.display`, `--head`), cada item com legenda `.t-cap` à direita (ex.: "Tratamentos" · "Sumário"), fios de 1px entre itens. Rodapé da folha: `WhatsAppCTA` md largo, links de apoio (Medo de dentista, Valores, Agendar pelo formulário) em `.t-label`, endereço em `.t-cap`. Fecha ao navegar. Animação: `opacity` 350ms (`@starting-style`). |
| `Footer` | `layout/footer.tsx` | S | Seção `noite`. Ver 5.0. `<h2 class="sr-only">Rodapé</h2>`. |
| `MobileActionBar` | `layout/mobile-action-bar.tsx` | C (`usePathname`) | `< 760px`. `<nav aria-label="Ações rápidas">`; altura 72px + safe-area; fundo `osso` sólido; fio superior; padding 10px; gap 10px. Três itens: **WhatsApp** (flex 1, `primario`, 52px, rótulo "Agendar pelo WhatsApp"; abaixo de 375px troca para "WhatsApp" via `compactLabel`, o `aria-label` fica completo), **Agendar** (círculo 52px `contorno`, `CalendarIcon`, `aria-label="Agendar pelo formulário"`; omitido em `/agendamento`), **Ligar** (círculo 52px `contorno`, `PhoneIcon`). `WhatsAppCTA location="mobile_bar"` (a barra tem sombra `--sombra-botao-fixo` só no botão). |
| `WhatsAppFloatingButton` | removido | | **Não existe mais** (componente e CSS apagados em 12). A ação fixa é a `MobileActionBar` no celular e o botão do cabeçalho no desktop. |
| `CookieConsent` | `seo/cookie-consent.tsx` | C | Mantém **toda** a lógica atual (chaves, eventos, `getConsent`, `subscribeConsent`, `openCookieSettings`, Consent Mode). Visual: faixa compacta, `<div role="region" aria-label="Consentimento de cookies">` **não modal** (nada de `role="dialog"`, sem focus trap), primeiro elemento do `<body>` no DOM (posição visual fixa). Texto único (13px, `fg-2`): "Cookies essenciais ficam sempre ativos; os de medição só com a sua autorização. Veja a [Política de Privacidade]." **Celular:** `bottom: var(--h-bar)`, fundo `osso`, fio superior, padding 12px `--pad`; texto em até 2 linhas; botões **lado a lado** em grade 1fr 1fr, gap 10px, `min-height: 44px`, **mesmo peso**: "Recusar" e "Aceitar" são **idênticos** (pílula `contorno`: 1px `verde`, fundo transparente, texto `verde`, mesma largura, mesma altura, mesma fonte; nenhum preenchido, nenhum link, nenhum escondido). Altura total <= 110px (<= 15% de 740px; limite duro 20%). **Desktop >= 760px:** faixa de uma linha na base, texto à esquerda, botões à direita (min-width 120px), `bottom: 0`. Grava `--h-cookie` no `:root` (ResizeObserver) enquanto aberto e zera ao fechar. Sem ícone de cookie. Reabre por `Gerenciar cookies` no rodapé. |

### 4.4 Cabeçalhos de página, blocos de confiança, FAQ

| Componente | Caminho | Tipo | Detalhe |
|---|---|---|---|
| `PageHero` | `sections/page-hero.tsx` | S | Páginas internas, tom `osso`. Props: `kicker?` (itálico), `title: ReactNode`, `lede?`, `breadcrumbs?`, `visual?: "numeral" \| "figure" \| "arco" \| "none"` (default `arco`), `numeral?: string`, `figure?: FigureProps`, `actions?: ReactNode`. Estrutura: breadcrumb (44px de alvo) + fio duplo de masthead; `grid12`: texto 7 colunas (kicker, `h1.t-d1i.luz`, `.t-lead`, ações) e visual 5 colunas (celular: o visual desce para depois do texto, e `arco`/`numeral` são omitidos < 760px). `arco` = o arco do fio sem foto, com `Monogram` 96px centralizado e 38% de altura da coluna; `numeral` = `Numeral xl`. Padding superior `calc(var(--h-header) + 32px)` (o corpo já tem `padding-top`, então `32px`). **Sem `Reveal`, sem fade**: tudo visível no HTML. |
| `Breadcrumbs` | `ui/breadcrumbs.tsx` | S | `items: {name, href?}[]`; `<nav aria-label="Trilha de navegação"><ol>`; `.t-sm`, `fg-2`; cada link `min-height: 44px; display: inline-flex; align-items: center`; separador "/" `ouro-tinta` `aria-hidden`; último item `aria-current="page"`, cor `head`, sem link. Sem chevron. |
| `FAQ` | `ui/faq.tsx` | S (nativo) | `items: {q, a}[]`, `columns?: 1 \| 2` (2 só >= 1100px, itens divididos em duas pilhas), `title?`. Cada item é `<details>` nativo (vários abertos ao mesmo tempo, funciona sem JS, busca da página abre sozinha, `hidden="until-found"` não é necessário). `<summary>`: `min-height: 56px`, Hanken 500 18px, cor `head`, sinal `PlusIcon` à direita que gira 45° ao abrir (transform, 400ms); marcador nativo oculto (`list-style: none`). Resposta `.t-body` `fg-2`, `max-width: 34rem`, padding-bottom 20px. Fio de 1px entre itens (`.fio-h`). **8 itens no máximo** por página. JSON-LD (`faqSchema`) continua nas páginas e **deve conter exatamente as mesmas perguntas visíveis**. |
| `TrustBlock` | `ui/trust-block.tsx` | S | `variant: "linha" \| "bloco"`; lista de definição `<dl>` com fios: nome ("Dra. Ana Beatriz Lemos Souza", `.t-d3` no bloco), "Cirurgiã-dentista · CRO-SP 177801", "Atendimento particular, sem convênios", endereço completo (`R. Rio Verde, 1029 — Vila Bruna (região da Freguesia do Ó), São Paulo - SP, 02934-201`), **horário só se `siteConfig.hours` estiver preenchido** (senão a linha não existe, sem "a combinar"), formas de pagamento "Pix, débito e crédito". Usado em: `/agendamento` (aside), `/contato`, `/obrigado`, fecho da home. Sem "Responsável Técnica". |
| `Field` set | `ui/field.tsx` | neutro (sem estado; usado dentro de client) | Exporta `Label, Hint, Input, Textarea, Select, ChipRadio, Checkbox, FieldError, ErrorSummary` (novos; os atuais vão para `admin-ui.tsx`). **Sem caixa:** só linha inferior 1px `linha`, fundo transparente, raio 0, `min-height: 52px`, texto 17px (evita zoom do iOS), `placeholder` em `fg-2`. Rótulo acima: Bodoni **itálica** 500 18px `opsz` 11, cor `head`; obrigatório: `<span aria-hidden> *</span>` + `aria-required`. Ajuda `Hint`: `.t-cap` persistente, ligada por `aria-describedby`. Foco: linha inferior vira 2px `verde` + anel de foco global. Inválido: linha 2px `erro`, `aria-invalid`, `FieldError` `.t-sm` `erro` com prefixo "Atenção:" (não depende só de cor), `role="alert"` apenas no resumo. `ErrorSummary`: bloco no topo do formulário, fio esquerdo 2px `erro`, `role="alert"`, links para cada campo, recebe foco ao enviar com erro. `ChipRadio`: `<label>` pílula `min-height: 44px`, borda 1px `verde`, marcado = fundo `verde` texto `osso`; dentro de `<fieldset><legend>`. `Checkbox`: 24x24 borda 1px `linha`, marcado `verde` com visto `osso`, área clicável 44px. `Select`: nativo com seta própria (`background-image` SVG inline). |

### 4.5 Ilhas das seções abaixo da dobra

| Componente | Caminho | Tipo | Detalhe |
|---|---|---|---|
| `SituationProvider` | `sections/situation-context.tsx` | C | Contexto `{ situationId: string \| null, set(id) }`; envolve apenas os dois momentos da home que o usam. Filhos passados como nó de servidor. |
| `SituationSelector` | `sections/situation-selector.tsx` | C | **"O que traz você aqui hoje?"** Dados em `src/lib/situations.ts` (novo): `{ id, label, answer, href, cta, treatments: string[] (slugs), waMessage: string }[]`, 7 itens, ver tabela abaixo. `<fieldset><legend>` com `radio` reais (cada linha é um `<label>` de 68px: numeral itálico à esquerda e rótulo da situação em Hanken 500 20px). Escolher: grava `situationId`, dispara `situation_select {need}` (debounce 600ms), troca o **painel de resposta** (`aria-live="polite"`: texto de `answer` em `.t-lead`, link `cta` → `href`, e `WhatsAppCTA` "Conversar no WhatsApp" com `waMessage`, `location="situation"`), liga aos tratamentos indicados (3.1 uso 3). Sem escolha: painel mostra "Escolha uma situação e mostramos o caminho mais útil." e tudo continua funcionando. Teclado: setas movem entre rádios (nativo); o seletor é um `<fieldset><legend>` (sem `role=radiogroup`: o painel traz links e botões). Setas **não** rolam a página (só toque/clique rolam o painel para a vista) e o evento `situation_select {need}` sai com debounce de 600ms; `care_need_click {need, href}` dispara só no clique do link do painel (mesmo significado de antes). O anúncio para leitor de tela (`role=status`) diz só o rótulo e a contagem. A lista de links sem JS só dá lugar aos rádios quando o seletor hidrata (`html.sel-ready`). O botão **"Respirar comigo"** (item "Tenho receio de dentista") está desligado pela constante `GUIA_RESPIRAR_NA_PAGINA = false` até `/medo-de-dentista` montar `<BreathingGuide id="respirar" />`: toda âncora citada em CTA precisa existir no HTML. |
| `TreatmentIndex` | `sections/treatment-index.tsx` | C | O sumário de tratamentos da home e de `/tratamentos`. Renderiza `IndexList variant="sumario"` com os 8 tratamentos (`treatments` de `src/lib/treatments.ts`; título = `name`). Servidor entrega links reais (sem JS a lista funciona). **>= 1100px:** ao passar o ponteiro ou focar uma linha, o `IndexCard` fixo (sticky, `top: calc(var(--h-header) + 36px)`, altura `min(640px, calc(100vh - 200px))`) à direita troca de painel por fade 600ms: fundo `noite`, filete interno de 12px `ouro-claro` a 55%, numeral `Numeral xl` itálico `ouro-claro`, título `.t-d3`, `excerpt`, link "Abrir o tratamento" (`ouro-claro`); fundo do painel: monograma claro 62% de largura a 90% de opacidade; **sem foto** (`showTreatmentPhotos: false`). **< 1100px:** sem cartão, a linha é o link (a lista não tem legenda). Evento `treatment_card_click {treatment: shortName}`. Com `SituationProvider`, os tratamentos de `situation.treatments` sobem ao topo (reordenação real no DOM), ganham losango `ouro` e o texto-legenda "Indicado para você" (`.t-cap`); os outros seguem na ordem original abaixo de um fio. |
| `BreathingGuide` | `sections/breathing-guide.tsx` | C | **"Respirar comigo".** Opcional, discreto. Mora em `<Section tone="noite" id="respirar">` em `/medo-de-dentista` (e é alcançável pela situação "Tenho receio de dentista"). Estado inicial: título + parágrafo curto + botão `contorno-claro` "Respirar comigo". Ao iniciar: a luz baixa fica **restrita à própria seção** (fundo transita `noite` -> `noite-fundo` em 800ms); aparece um anel de 160px (`ouro-claro`, 1px) que cresce 1 -> 1,35 em **4s** ("Inspire", `ease-fio`) e volta 1,35 -> 1 em **6s** ("Solte"), **3 repetições** (30s), contador "Respiração 1 de 3"; rótulo grande em Bodoni itálica 28px; botão **"Parar"** (foco vai para ele ao iniciar) e **Esc** interrompem; fim: "Pronto. Quando quiser, fale com a Dra. Ana." + `WhatsAppCTA message={waMessages.fear} location="breathing_guide"`. Anúncio: `aria-live="polite"` só no início e no fim ("Guia iniciado: três respirações." / "Guia concluído."), nunca a cada fase. Foco volta ao botão que abriu. **Movimento reduzido:** não anima; mostra texto fixo "Inspire pelo nariz contando até 4. Solte devagar contando até 6. Repita 3 vezes." Evento: `cta_click {location: "breathing_guide", target: "start"}`. Sem promessa de efeito ("reduz ansiedade" é proibido). |
| `MapFrame` (hoje `MapFacade`, `ui/map-facade.tsx`; ver 0.2) | `ui/map-facade.tsx` | C | **Fachada** do mapa (o iframe do Google só carrega no clique). Moldura de papel (`areia`, filete duplo 1px `ouro`), proporção 4/3 (celular) e 16/10 (desktop); dentro: endereço em Bodoni `.t-d3` ("R. Rio Verde, 1029"), "Vila Bruna, São Paulo - SP, 02934-201", dois botões: `MapCTA` (primário, abre Maps) e botão `contorno` "Carregar o mapa aqui" (insere `<iframe loading="lazy" title="Mapa do consultório" src={siteConfig.address.mapsEmbedUrl}>` com `filter: grayscale(.85) sepia(.2) contrast(.95)` para harmonizar com a paleta). Atrás do texto: três arcos concêntricos de 1px `--fio` (eco do arco da marca). |
| `AreasChapters` | `sections/areas-chapters.tsx` | S | Implante e buco-maxilo como dois "capítulos" de largura total (sem cartão): numeral `lg` itálico, título `.t-d2`, texto, `.t-cap` com instituições (as que já constam em `areas-section.tsx`: ABO Central, APCD Central, IOA), duas ações (`AgendarCTA`, `WhatsAppCTA` com `waMessages.treatment`). Texto sem "especialista": "procedimentos realizados". |

**Situações** (`src/lib/situations.ts`; todos os textos já existem em `careNeeds` de `content.ts`, o rótulo e o `answer` são copiados dali; nenhuma frase nova de conteúdo):

| id | Rótulo | `href` | Tratamentos indicados (slugs, na ordem) | Mensagem de WhatsApp |
|---|---|---|---|---|
| tempo | Faz tempo desde a última consulta | `/primeira-consulta` | avaliacao-odontologica, limpeza-dental, prevencao | `waMessages.firstVisit` |
| dor | Sente dor, sensibilidade ou incômodo? Sua gengiva sangra? | `/urgencia-odontologica` | avaliacao-odontologica, restauracoes, limpeza-dental | `waMessages.situation(label)` (novo) |
| sorriso | Quer um sorriso mais bonito | `/tratamentos/clareamento-dental` | clareamento-dental, restauracoes, avaliacao-odontologica | `waMessages.whitening` |
| siso | Precisa avaliar os sisos ou cirurgia oral | `/tratamentos/cirurgia-oral` | cirurgia-oral, avaliacao-odontologica | `waMessages.treatment("cirurgia oral")` |
| prevenir | Quer manter a saúde bucal em dia | `/tratamentos/prevencao` | prevencao, limpeza-dental, avaliacao-odontologica | `waMessages.treatment("prevenção")` |
| urgencia | Teve uma urgência odontológica | `/urgencia-odontologica` | avaliacao-odontologica | `waMessages.urgency` |
| receio | Tenho receio de dentista | `/medo-de-dentista` | avaliacao-odontologica, limpeza-dental | `waMessages.fear` |

`answer` do item "receio": primeira frase de apoio da página `/medo-de-dentista` (texto que já existe; a equipe de página escolhe a frase e a registra em `situations.ts`). Acrescentar em `whatsapp.ts`: `situation: (label: string) => \`Olá, Dra. Ana! Vim pelo site e gostaria de conversar sobre uma situação: ${label}\``.

---

## 5. Roteiro de rotas

### 5.0 Navegação, rodapé, tons

**Menu principal** (`mainNav` em `site-config.ts`, substitui o atual; `Agendamento` deixa de ser item):

| Ordem | Rótulo | Destino | Legenda na folha (celular) |
|---|---|---|---|
| 1 | Tratamentos | `/tratamentos` | Sumário |
| 2 | Primeira consulta | `/primeira-consulta` | Valores e dúvidas |
| 3 | Sobre | `/sobre` | A doutora |
| 4 | Contato | `/contato` | Endereço |
| 5 | Urgência | `/urgencia-odontologica` | Atendimento rápido (**em destaque**: texto `ouro-tinta` + losango `ouro` de 7px antes do rótulo; não é vermelho) |

Fora do menu principal, na folha do celular e no rodapé: Medo de dentista, Como funcionam os valores. **Botão** (não link) no desktop: `WhatsAppCTA size="sm"` "Agendar pelo WhatsApp" (`location="header"`). Início = clique na `Logo`. O formulário é alcançado por "Preencher formulário" (`AgendarCTA`) na capa, no fecho de cada página e na folha do celular.

**Rodapé** (`Footer`, tom `noite`, `padding-block: var(--sec-y)`; `Symbol` claro de 340px, `opacity: .07`, no canto inferior direito, `aria-hidden`):
- Linha 1: nome em `.t-d3` (`osso`) + "Cirurgiã-dentista · CRO-SP 177801" (`.t-body`, `nevoa`) + frase do tom de voz já existente (sem "naturalidade" nem superlativo: "Cuidado odontológico com planejamento individual. Atendimento na região da Freguesia do Ó, em São Paulo.").
- Grade 4 colunas (>= 1100px; 2 em tab; 1 no celular), títulos de coluna em Hanken 500 15px `ouro-claro` (sem caixa-alta), links `.t-sm` `nevoa`, **cada link com `min-height: 44px`** e `display: flex; align-items: center`: **Navegação** (os 5 do menu), **Para você** (Medo de dentista, Como funcionam os valores, Preencher formulário), **Tratamentos** (os 8 de `treatments`), **Contato** (endereço completo; telefone `PhoneCTA as="texto"`; WhatsApp `WhatsAppCTA variant="texto"`; e-mail com `overflow-wrap: anywhere; min-width: 0`; Instagram; **horário só se existir**).
- Faixa inferior: © 2026 {nome}; Política de Privacidade; Termos de Uso; Gerenciar cookies (`ManageCookiesButton`, alvo 44px). Aviso: "Conteúdo de caráter informativo, sem promessa de resultados. Cada caso é avaliado individualmente." (sem a menção a "depoimentos").
- Atributos: `data-hide-floating` no `<footer>`.

**Ritmo de tons** (nunca dois iguais em sequência; a capa e a declaração formam um só momento): `osso -> papel -> noite -> osso -> verde -> osso -> papel -> osso -> [rodapé noite]`. Páginas internas: hero `osso`, depois alternância `papel`/`osso`, no máximo uma seção `noite` ou `verde`, fecho `osso` e rodapé `noite`.

**Config** (`site-config.ts`, adições; a Fundação faz): `hours: ""` (string vazia = não mostrar), `mainNav` e `supportNav`. **Em 13:** as chaves `showTestimonials`, `showTreatmentPhotos` e `showOfficePhotos` e o `reviewUrl` foram removidos junto com o código que as lia; depoimento, foto de tratamento e foto do consultório antigo não existem mais no código.

### 5.1 `/` Home — 8 momentos

Metadados: título `Dentista na Freguesia do Ó (Vila Bruna) | Dra. Ana Beatriz`. JSON-LD: o atual (FAQ com as mesmas perguntas visíveis). `FioRail` com os pontos: Capa, Tratamentos, A doutora, Como funciona, Onde, Dúvidas, Agendar (7). Ritmo de tons: osso, papel, **noite (declaração)**, osso, papel, verde, osso, papel, **verde (fecho)**, rodapé noite.

| # | Tom | `id` | Composição | Conteúdo (fonte) | Chamadas para ação |
|---|---|---|---|---|---|
| 1 | osso | `capa` | **Capa de revista + declaração.** Masthead (fio duplo): "Cirurgiã-dentista · CRO-SP 177801" (`siteConfig.title`, `cro`) à esquerda; >= 760px à direita "Vila Bruna · região da Freguesia do Ó, São Paulo". Depois `h1.t-d1.luz`: kicker "Dentista particular na Freguesia do Ó, com" (itálico, dentro do h1) + "atendimento acolhedor, claro e sem pressão." Retrato em arco (`ArchPortrait`) com legenda Fig. 1. `.t-body`: "Consulta de 40 a 60 minutos com avaliação completa, explicação simples e plano de tratamento individualizado. Prevenção, restaurações, clareamento, cirurgia oral e urgências odontológicas." (texto do hero atual, sem alteração). Depois da capa, dentro do mesmo momento: **declaração** `.t-d3` (`max-width: 22ch`): "Você entende o que foi encontrado, em linguagem simples, antes de decidir qualquer procedimento." + legenda "Diagnóstico antes de qualquer decisão" + **três colunas** separadas por fios (`FioRule v`): "Consulta de 40 a 60 minutos", "Orçamento após avaliação, sem pressão", "WhatsApp direto com a Dra. Ana" (títulos de coluna em Hanken 500 20px `head`; descrições vindas de `differentials` em `content.ts`). **Celular:** ordem kicker/H1, retrato, texto, botões (ver 6.1); **tablet (760 a 1099px):** H1 em largura total, abaixo texto+botões à esquerda (7) e retrato à direita (5); **>= 1100px:** H1 e texto à esquerda (7), retrato à direita (5) ocupando as duas linhas. | `WhatsAppCTA location="hero"` (primário, md), `ButtonLink` contorno "Ver tratamentos" (âncora `#tratamentos`), linha "Prefere ligar? **(11) 93922-2289**" (`PhoneCTA as="texto"`, `location="home_hero"`). |
| 2 | papel | `tratamentos` | **Sumário + triagem.** Cabeçalho: `SectionHeading` "Tratamentos" (`d2`) + folio "Sumário". Acima da lista, bloco `SituationSelector` (7 situações, painel de resposta, conexão do Fio). Abaixo, `TreatmentIndex` (8 linhas numeradas + cartão `noite` fixo no desktop). Layout >= 1100px: seletor ocupa 12 colunas (lista 5 + conector 120px + painel de resposta e indicados), índice 7 + cartão 5. | `treatments.ts` (`name`, `excerpt`) e `situations.ts` | Cada linha leva ao tratamento; `WhatsAppCTA` no painel de resposta (`location="situation"`). |
| 3 | noite | `a-doutora` | **Ensaio 5/7 com citação.** Retrato recortado `dra-ana-recorte.webp` sobre `papel`, em enquadramento fechado diferente do da capa e sem legenda de formação (a foto `dra-ana-cirurgia.webp` foi arquivada: foto de procedimento não entra no site, ver 0.1); à direita `h2.t-d2` "Uma odontologia que começa pela escuta e se constrói com confiança", primeiro parágrafo em `.t-lead` (sans), segundo parágrafo `.t-body`, `IndexList variant="fatos"` com os 4 pontos existentes (de `about-preview.tsx`); abaixo, largura total, citação `.t-d4` "Cuidar bem é somar o rigor técnico e teórico ao respeito e cuidado com cada paciente." + crédito "Dra. Ana Beatriz" (`ouro-claro`); `Symbol` claro 340px a 7% no canto. | `about-preview.tsx` (textos atuais) | `ButtonLink` `contorno-claro` "Conhecer a Dra. Ana" -> `/sobre`. |
| 4 | osso | `capitulos` | **Dois capítulos de página inteira**, sem foto: cada um é uma faixa com fio superior, numeral `lg` itálico "01"/"02" à esquerda (2 col), título `.t-d2` + texto (6 col) e legenda à direita (4 col: instituições, `.t-cap`). `AreasChapters` (Implante dentário; Cirurgia buco-maxilo-facial). | `areas-section.tsx` / `treatments.ts` (`implante`, `cirurgia-buco-maxilo-facial`) | `AgendarCTA` + `WhatsAppCTA variant="texto"` por capítulo (mensagem `waMessages.treatment`). |
| 5 | verde | `como-funciona` | **Passos em coluna estreita.** Cabeçalho à esquerda (5 col, sticky no desktop): `h2.t-d2` "Do primeiro contato à sua consulta, em passos simples" + `.t-body`; à direita (7 col) `IndexList variant="passos"` com os 4 passos de `journeySteps` (numerais itálicos `ouro-claro`). | `content.ts` `journeySteps` + `how-it-works.tsx` | `WhatsAppCTA` (`ouro`, `location="how_it_works"`) e `ButtonLink` `contorno-claro` "Como é a primeira consulta" -> `/primeira-consulta` (`cta_click`). |
| 6 | osso | `onde` | **Mapa em moldura + endereço grande 5/7.** Esquerda: `h2.t-d2` "Onde estamos", endereço em `.t-d3` ("R. Rio Verde, 1029"), "Vila Bruna (região da Freguesia do Ó), São Paulo - SP, 02934-201", "Travessa da Av. Edgar Facó" (já existe em `homeFaqs`), horário só se existir, telefone, e-mail (`overflow-wrap: anywhere`). Direita: `MapFrame`. | `site-config.ts` + `location-section.tsx` | `MapCTA` (primário), `PhoneCTA` texto, `WhatsAppCTA` texto. |
| 7 | papel | `duvidas` | **FAQ em duas colunas.** `SectionHeading` "Perguntas frequentes" + `FAQ columns={2}` com **8** perguntas de `homeFaqs`: convênios; formas de pagamento; crianças; orçamento antes da consulta; duração da primeira consulta; exames na primeira consulta; urgência; retorno. As demais ficam nas páginas de apoio. | `content.ts` | `WhatsAppCTA variant="texto"` "Outra dúvida? Fale pelo WhatsApp". |
| 8 | osso | `agendar` | **Fecho com arco de sorriso.** `h2.t-d2` "Agende sua avaliação" (7 col); direita (5 col): `.t-body` "Fale pelo WhatsApp ou preencha o formulário, o que for mais confortável para você. Tudo no seu tempo, sem pressão." `FioSmile` com `WhatsAppCTA` md dentro do arco; abaixo `AgendarCTA` contorno. Linha de rodapé editorial `TrustBlock variant="linha"` (3 colunas: consultório, contato, Instagram). `data-hide-floating`. | `cta-section.tsx` / prototype | `location="cta_final"`. |

Fora do ar na home: `CareNeeds` em cartões, `Differentials` em seis cartões, `TreatmentsSection` em cartões (e `Testimonials`, apagado em 13).

### 5.2 `/sobre`

Título: `Sobre a Dra. Ana Beatriz | Dentista na Vila Bruna, SP`. JSON-LD: o atual (Person + breadcrumb). `FioRail`: Hero, Trajetória, Formação, Áreas, Consultório.

| # | Tom | Composição | Conteúdo |
|---|---|---|---|
| 1 | osso | `PageHero visual="figure"`: kicker "Sobre a Dra. Ana", H1 "Uma odontologia construída com cuidado e confiança" (sem palavra dourada), lede atual; figura 4/5 `dra-ana-trajetoria.jpg` com filete, Fig. 1 | textos atuais de `sobre/page.tsx` |
| 2 | osso | **Ensaio** em coluna de leitura (8 col) com nota lateral (4 col). Texto "Trajetória" reescrito (sem "destino traçado", sem "perfeita"): mesma ideia, frases curtas, sem acrescentar fatos. Citação `.t-d4` com "O grande objetivo da doutora..." | `sobre/page.tsx` |
| 3 | papel | "Formação e credenciais": `IndexList variant="fatos"` (sem ícones) com o array `credentials` atual + link para o Lattes (`texto`, externo). Linha do tempo **somente** se o array já trouxer anos; senão, lista simples. | `credentials`, `lattesUrl` |
| 4 | noite | `AreasChapters` (mesmo componente da home) | `areas` |
| 5 | osso | "O consultório": texto com o endereço novo, **sem** "vista panorâmica" e **sem** "luz natural"; **sem foto de procedimento** (decisão 3 de 0.1: `consultorio-4.jpg` sai da seção; `consultorio-1..3.png` já estão arquivadas) | `site-config.ts` |
| 6 | papel | Fecho padrão (`FioSmile` + `WhatsAppCTA`) | — |

### 5.3 `/tratamentos`

Título: `Tratamentos odontológicos na Freguesia do Ó | Dra. Ana` (<= 60). `PageHero visual="numeral"` com `numeral="08"` e kicker "Tratamentos"; H1 atual "Cuidados completos para a saúde e a estética do seu sorriso". Seção 2 (`papel`): `TreatmentIndex` em largura total, **todas as linhas com `excerpt` visível** (desktop: duas colunas, título `.t-row` + `excerpt` `.t-body` + "Ver o tratamento"; celular: título + `excerpt` de 2 linhas) e, onde existir, `duration`/`sessions` como `.t-cap` ("40 a 60 minutos"). Sem fotos. Seção 3 (`osso`): `SituationSelector` compacto ("Não sabe por onde começar?"), sem reordenar a lista (a lista já está acima); evento igual. Fecho padrão. Sem JSON-LD novo além do atual.

### 5.4 `/tratamentos/[slug]` (8 páginas)

Slugs mantidos. Título: `${name} na Freguesia do Ó | Dra. Ana Beatriz` (se > 60 caracteres, trocar por `${name} na Vila Bruna | Dra. Ana Beatriz`; se ainda > 60, `${shortName} na Freguesia do Ó | Dra. Ana Beatriz`); metadados vêm de `metaTitle`/`metaDescription` já reescritos sem `[Cidade]`. `FioRail`: Capítulo, O tratamento, Passos, Cuidados, Dúvidas.

| # | Tom | Composição | Conteúdo |
|---|---|---|---|
| 1 | osso | **Abertura de capítulo.** Esquerda: breadcrumb, `Numeral lg` ("01" a "08", ordem do array `treatments`), `h1.t-d1i.luz` = `name`, `.t-lead` = `intro`, ações (`WhatsAppCTA message={waMessages.treatment(name)}`, `location="treatment_page"`, e `AgendarCTA`). Direita (>= 1100px): "ficha" sem cartão: três linhas com fio (Duração = `duration`, Sessões = `sessions`, Atendimento particular) **só os campos que existem**. | `treatments.ts` |
| 2 | osso | **Três colunas com legenda na margem:** "O que é" (`what`), "Para quem" (`forWhom` em `fatos`), "Como funciona" (`steps` em `passos`, **colunas largas**: em celular uma abaixo da outra). Benefícios (`benefits`) em `fatos` abaixo, **revisados** para não prometer resultado. | idem |
| 3 | papel | "O que considerar com cuidado": só os campos existentes (`notFor`, `contraindications`, `preparation`, `aftercare`, `warningSigns`) em colunas 2x2 de definição (título Hanken 500 20px + lista `fatos`) | idem |
| 4 | osso | "Transparência sobre valores": texto atual (sem preço), `ButtonLink texto` -> `/valores` | seção existente |
| 5 | papel | `FAQ` com `t.faqs` (e `faqSchema(t.faqs)` já existente; máx. 8) | idem |
| 6 | osso | "Outros tratamentos": `IndexList variant="sumario" size="row"` com os 7 restantes + anterior/seguinte | `treatments.ts` |
| 7 | noite | Fecho padrão com `message={waMessages.treatment(name)}` | — |

Fotos de tratamento (`public/tratamentos/*`) **não aparecem** (o campo `images` saiu de `treatments.ts`; os arquivos seguem em `public/` sem uso). Nenhum "antes e depois".

### 5.5 `/agendamento`

Título: `Agendar avaliação odontológica | Dra. Ana Beatriz`. `PageHero visual="none"` compacto: H1 "Vamos marcar a sua avaliação". Seção única `osso`, `grid12`:
- **Celular (< 760px), ordem:** bloco "Prefere o WhatsApp?" (`.t-lead` curto + `WhatsAppCTA` md largo, `location="appointment_page"`) **acima do formulário**; formulário; aside "O que esperar" (texto atual) + `TrustBlock variant="bloco"`.
- **Desktop:** formulário 7 col à esquerda; aside 5 col à direita (sticky): bloco de WhatsApp (primário), "O que esperar", `TrustBlock`.
- **Formulário (`appointment-form.tsx`):** a lógica, os campos obrigatórios, a validação Zod, o honeypot, a atribuição (gclid/UTM), o consentimento LGPD, o `fetch('/api/leads')`, o tratamento de erro e os eventos (`form_start`, `appointment_form_submit`, `lead_created`, `whatsapp_click` com `form_error_fallback` e `form_alt`) **não mudam**. Só a apresentação: campos do `Field` set; duas etapas **visuais**: etapa essencial sempre visível (nome, WhatsApp, tratamento de interesse) + `Checkbox` de consentimento + botão; e um bloco recolhível "Se quiser, conte mais (opcional)" (`<details>` nativo) com os campos opcionais atuais (queixa, radiografia, período em `ChipRadio`, como conheceu) — um único envio. Aviso persistente sob o campo de queixa: "Evite informar dados sensíveis além do necessário." **somente se** já existir texto equivalente na política; senão omitir. Status de envio: `aria-live="polite"`; botão com estado "Enviando…"; sucesso redireciona como hoje. Botão de envio `primario` md largo no celular. Erros: `ErrorSummary`.
- Rota `/obrigado` continua lendo `n` e `t` da URL como hoje (compatibilidade); a equipe da fundação **não** muda isso.

### 5.6 `/contato`

Título: `Contato e endereço | Dentista na Vila Bruna, São Paulo`. `PageHero visual="arco"` com H1 atual. Seção 1 (`osso`): `IndexList variant="contatos"`: WhatsApp (`WhatsAppCTA` texto; evento via `location="contact_page"`), Telefone, E-mail (valor quebra com `overflow-wrap: anywhere`, `min-w-0` em todo item flex, **sem overflow horizontal a 320px**), Instagram, Endereço; **Horário** só se `siteConfig.hours`. Seção 2 (`papel`): `MapFrame` + "Como chegar" (`MapCTA`). Seção 3: `FAQ` curto (estacionamento e acessibilidade **somente se** houver fato confirmado pela Dra.; senão a pergunta não existe). Fecho padrão. Eventos atuais de `contact-methods.tsx` mantidos.

### 5.7 `/primeira-consulta`

Título: `Primeira consulta no dentista | Dra. Ana Beatriz, Vila Bruna`. `PageHero visual="arco"`: H1 atual. Seções: (1) `verde`: "O que acontece na primeira consulta" -> `IndexList variant="passos"` (4 passos atuais); (2) `osso`: "Perguntas práticas, respondidas" em `IndexList variant="contatos"`-like (pergunta curta em Hanken 500, resposta ao lado em 2 colunas) com os dados atuais da página; (3) `papel`: declaração `.t-d3` "Você não precisa chegar com tudo decidido" + texto atual; (4) `FAQ` (6 a 8, `faqSchema`); (5) fecho padrão com `waMessages.firstVisit`.

### 5.8 `/valores`

Título: `Como funcionam os valores | Dra. Ana Beatriz, Vila Bruna`. **Sem preços, descontos nem comparação.** `PageHero visual="numeral" numeral="5"` (cinco princípios). (1) `osso`: os 5 princípios atuais em `IndexList variant="passos" size="d3"` (Atendimento exclusivamente particular; Orçamento só após avaliação clínica; Sem pressão para fechar na hora; Pix, débito e crédito; Transparência em cada etapa). (2) `papel`: "Como o orçamento é apresentado" em passos curtos (texto atual). (3) `noite`: declaração com o aviso "Não é possível passar orçamento sem avaliação clínica." (texto de `homeFaqs`). (4) `FAQ` da página; (5) fecho padrão.

### 5.9 `/urgencia-odontologica`

Título: `Urgência odontológica na Freguesia do Ó | Dra. Ana Beatriz`. Sem alarmismo: sem vermelho, sem sirene, sem contagem. `PageHero visual="none"` com H1 atual "Está com dor ou um problema que não pode esperar?" e, **dentro do hero**, `WhatsAppCTA message={waMessages.urgency} location="urgency_hero"` (primário) + `PhoneCTA` (contorno). (1) `osso`: "Quando procurar atendimento de urgência" em `IndexList fatos` (lista atual). (2) `papel`: "O que fazer enquanto a gente se fala" `fatos` (texto atual) + aviso "A orientação por WhatsApp não substitui o exame." (`.t-cap`). (3) `verde`: "Como funciona o atendimento de urgência", 4 passos (`passos`). (4) `noite`: faixa "Está com dor agora? Não espere." com os dois botões (`ouro` e `contorno-claro`), `data-hide-floating`. (5) `FAQ` (`faqSchema`). Título atual com `[Cidade]` é removido.

### 5.10 `/medo-de-dentista`

Título: `Medo de dentista? Atendimento acolhedor na Freguesia do Ó`. `PageHero visual="arco"`: H1 "Sente medo de ir ao dentista? Você não está só." (substitui o "sozinho(a)" atual; sem `(a)` em título). (1) `osso`: "Você reconhece algum destes sentimentos?" em `IndexList fatos size="d3"` (5 itens atuais). (2) `noite` `#respirar`: `BreathingGuide`. (3) `papel`: "Como tornamos a experiência mais leve" em `passos` (texto atual; "Anestesia e pausas combinadas com você" substitui qualquer frase de "sem dor"). (4) `osso`: "O primeiro passo é só uma conversa": declaração `.t-d3` + `WhatsAppCTA message={waMessages.fear}`. (5) `FAQ`. (6) fecho padrão.

### 5.11 `/obrigado` (noindex)

Título: `Solicitação recebida | Dra. Ana Beatriz`. Tom `osso`, alinhado à esquerda, `Section` única, 7/5. Esquerda: `Symbol` pequeno com o arco do fio desenhado (sem ícone de verificação), `h1.t-d1i` "Obrigada, {primeiro nome}!" (ou "Obrigada pelo contato!"), `.t-lead` texto atual (sem prazo inventado: manter "Em breve entraremos em contato para confirmar o melhor horário."), `WhatsAppCTA` primário (continua a conversa; `ThankYouActions` mantém `lead_created` e o `whatsapp_click` com `location="thank_you"`). Direita: `TrustBlock variant="bloco"` + `MapCTA`. "Voltar ao início" é `ButtonLink variant="texto"`, discreto. O H1 recebe foco ao carregar (`tabIndex={-1}` + efeito cliente pequeno, sem rolar).

### 5.12 `/politica-de-privacidade` e `/termos-de-uso`

Páginas de texto. Título: `Política de Privacidade | Dra. Ana Beatriz` / `Termos de Uso | Dra. Ana Beatriz`. `PageHero visual="none"` mínimo (H1 `.t-d1i`, sem lede), folio "Atualizado em {data}" (itálico, vem do texto atual). Corpo: `Prose` coluna 62ch, notas laterais em `aside` (`.t-cap`). Sem seção escura, sem CTA, sem fecho (só rodapé). O conteúdo jurídico **não muda** nesta fase.

### 5.13 404 (`src/app/not-found.tsx`)

Tom `osso`, alinhado à esquerda, 7/5. Esquerda: `Numeral xl` "404" (decorativo, `ouro`), `h1.t-d1i` "Página não encontrada", texto atual ("A página que você procura saiu para uma limpeza. Que tal voltar ao início ou conhecer os tratamentos da Dra. Ana?"), botões `ButtonLink` primário "Voltar ao início" e contorno "Ver tratamentos", `WhatsAppCTA variant="texto"` "Ou fale pelo WhatsApp". Direita: `Symbol` com o arco. `error.tsx` e `global-error.tsx` seguem o mesmo molde com `WhatsAppCTA`.

---

## 6. Regras transversais

### 6.1 Celular (desenhar primeiro para 390px)

- Critério de aceite da **capa** em 390x844 (densidade 1), com o aviso de cookies e a barra visíveis: cabeçalho de 56px; masthead (uma linha + fio duplo, ~50px); kicker + H1 de **3 linhas** em 46px (`atendimento / acolhedor, claro / e sem pressão.`) inteiros; o **arco do retrato com a cabeça, o rosto e o fio completos** acima do aviso de cookies; aviso <= 110px acima da barra; barra de 72px com o botão de WhatsApp dominante. Rolando 1 tela: legenda, texto de apoio e os dois botões. Rascunho de referência: `scratchpad/build/spec/hero.html` (`hero-m-01.png`).
- Larguras testadas: **320, 360, 375, 390, 414, 768, 1024, 1440**. `document.documentElement.scrollWidth <= innerWidth` em todas, em todas as rotas (teste automatizado). Em 320px o H1 cabe sem quebrar palavra no meio (46px é o piso; `atendimento` tem 11 letras).
- Toque: alvo mínimo **44x44px** (botões 52px, campos 52px, links de rodapé e breadcrumb 44px de altura, rádios/checkbox com área de 44px). Espaço mínimo entre alvos 8px.
- Texto: corpo 17px, piso 13px (`.t-cap`). Entradas de formulário 17px (sem zoom do iOS). `-webkit-tap-highlight-color: transparent`; hover só em `@media (hover: hover)`.
- Camadas: cabeçalho 56px, barra 72px, cookie acima da barra. Foco nunca fica coberto (`scroll-padding-bottom`).
- Menu em folha em < 1100px; **sem menu horizontal abaixo de 1100px** (evita o corte do CTA em 1024px do site antigo).
- Tablet (760 a 1099px): capa com layout próprio (H1 largo; texto e retrato lado a lado); páginas internas em 8/4.
- Carrosséis: nenhum. Listas verticais.

### 6.2 Acessibilidade (WCAG 2.2 AA)

- Contraste: todos os pares de 2.1. Texto sobre imagem: proibido (exceto o cartão do sumário sobre `noite` sem foto). Teste automático com axe em cada rota/viewport.
- Foco visível em tudo: anel duplo `outline: 2px solid var(--focus); outline-offset: 2px; box-shadow: 0 0 0 2px var(--bg)` (halo da cor do fundo da seção); em campos o anel soma ao realce da linha. Nunca `outline: none` sem substituto. `:focus-visible` apenas.
- Estrutura: um `<h1>` por página; `h2` por seção; sem pular nível; landmarks `header`, `nav` (Principal, Trilha de navegação, Ações rápidas), `main#conteudo`, `footer` com `<h2 class="sr-only">`; link "Ir para o conteúdo" é o primeiro foco depois da região de cookies. Menu: `<dialog>` modal, `aria-current="page"`, links externos avisam "(abre em nova aba)".
- `lang="pt-BR"`. Imagens: `alt` descritivo; decorativas `alt=""`; SVG de fio e arco `aria-hidden`.
- Formulário: `fieldset/legend` nos grupos, `aria-required`, `ErrorSummary` com foco, `aria-describedby` para ajuda e erro, status `aria-live`, foco no H1 de `/obrigado`.
- Movimento: ver 2.6. Nada pisca, nada se move sozinho por mais de 5s (exceto o guia de respiração, iniciado e interrompível pela pessoa).
- Alvos 24px mínimo (WCAG 2.5.8) e 44px de política; arrastar nunca é o único meio; sem gesto complexo.
- Rótulo visível contido no nome acessível (WCAG 2.5.3): botão "WhatsApp" com `aria-label="Agendar pelo WhatsApp"` é permitido (o visível está contido).

### 6.3 Desempenho

- **Nada acima da dobra depende de JS.** O HTML do servidor traz H1, texto, botões e a imagem da capa. `Header` (menos o `MenuSheet`) e `Footer` são servidor; a barra e o aviso de cookies são as únicas ilhas cliente "de moldura". Ilhas: `TrackedLink`, `MenuSheet`, `NavLinks`, `FioProgress`, `FioRail`, `RevealObserver`, `CookieConsent`, `MobileActionBar`, `SituationProvider/Selector`, `TreatmentIndex`, `BreathingGuide`, `MapFacade`, `appointment-form`. Passe só valores primitivos a componentes cliente.
- `SituationSelector`, `BreathingGuide` e `TreatmentIndex` ainda são importados direto (a divisão por `next/dynamic` fica como melhoria futura); `framer-motion` não existe no site (2.6).
- Imagem da capa: `priority`, `fetchPriority="high"`, dimensões declaradas, `quality 72`, **<= 80 kB** servida a 390px. Demais imagens `loading="lazy"`, `sizes` corretos, largura declarada; `next.config.mjs`: manter AVIF/WebP e acrescentar `deviceSizes: [390, 640, 828, 1080, 1440]`, `minimumCacheTTL: 31536000`.
- Fontes: 3 arquivos, ~135 kB, `display: swap`, fallback com ajuste métrico automático do `next/font`.
- Orçamentos: LCP <= 1,5s em 4G simulado na home e nas páginas internas; CLS 0; JS inicial da home <= 150 kB (sem tags de terceiros); CSS <= 25 kB (gzip). Lighthouse (mobile) >= 95 em desempenho nas rotas principais; acessibilidade e melhores práticas 100.
- Sem WebGL, canvas, vídeo, worker, WASM: a CSP não muda. Não instale dependências novas; `lucide-react` e `framer-motion` saíram do projeto.
- Remover código morto: `PhotoPlaceholder`, `TreatmentIcon`, `texture-grain`, keyframes sem uso, `soft-pulse`, `shimmer`.

### 6.4 SEO

- Padrões de título (<= 60 caracteres; **o bairro aparece**; sem `[Cidade]`, sem `[bairro]`, sem `localize()` com marcadores): home `Dentista na Freguesia do Ó (Vila Bruna) | Dra. Ana Beatriz` (58); `/sobre` `Sobre a Dra. Ana Beatriz | Dentista na Vila Bruna, SP` (53); `/tratamentos` `Tratamentos odontológicos na Freguesia do Ó | Dra. Ana` (54); `/agendamento` `Agendar avaliação odontológica | Dra. Ana Beatriz` (49); `/contato` `Contato e endereço | Dentista na Vila Bruna, São Paulo` (54); `/primeira-consulta` `Primeira consulta no dentista | Dra. Ana Beatriz, Vila Bruna` (60); `/valores` `Como funcionam os valores | Dra. Ana Beatriz, Vila Bruna` (56); `/urgencia-odontologica` `Urgência odontológica na Freguesia do Ó | Dra. Ana Beatriz` (58); `/medo-de-dentista` `Medo de dentista? Atendimento acolhedor na Freguesia do Ó` (57).
- `buildMetadata` não acrescenta a marca duas vezes (já trata); descrições <= 155 caracteres, escritas à mão, com bairro na primeira frase quando natural. H1 gramatical: "na Freguesia do Ó" (nunca "em Freguesia do Ó").
- Teste de build que falha se `[` ou `]` aparecer em `<title>`, `description`, JSON-LD ou H1.
- JSON-LD, `@id`s, canonical, robots, sitemap: **inalterados**. Sem `aggregateRating` (não há avaliações reais).
- `<img>`/`Image` com `alt`; `lang`; links com texto descritivo ("Ver tratamento: Clareamento dental" em vez de "clique aqui").

### 6.5 Conteúdo e ética

- Só textos que já existem no repositório, reescritos para clareza e correção; **nenhum fato novo**. Voz acolhedora, frases curtas, "você". Sem "(a)" em título, sem "destino traçado", sem "perfeita".
- Proibido: "Odontologia sem dor", "sem dor", "indolor", "segura", "alta durabilidade", "melhor cuidado possível", "o melhor", "referência", "garantia", "resultado garantido", preços, descontos, promoções, comparações, "antes e depois", depoimentos, nota/estrelas, selos, números de pacientes, prêmios, "especialista" (use "procedimentos realizados"/"áreas de atuação"), "Responsável Técnica". Frase aceita: "Anestesia e pausas combinadas com você."
- Endereço único: `R. Rio Verde, 1029 — Vila Bruna (região da Freguesia do Ó), São Paulo - SP, 02934-201`. **Nunca** R. Itapeva, Bela Vista ou Av. Paulista. "Travessa da Av. Edgar Facó" é a referência já usada.
- Horário: só aparece quando `siteConfig.hours` estiver preenchido.
- Depoimentos: não existem no código (componente e dados apagados em 13).
- Fotos clínicas, do consultório antigo e "antes e depois": fora (chaves em `site-config.ts`).
- Orientação por WhatsApp: onde houver canal de urgência/dúvida clínica, "A orientação por WhatsApp não substitui o exame."
- Uma só resposta canônica para avaliação, orçamento, pagamento, duração e idade mínima (crianças a partir de 7 anos): se repetir, repita o texto de `homeFaqs`.

---

## 7. Não faça

1. Não use cartão (borda + sombra + raio), "pill" de destaque, chip flutuante, selo, ícone em círculo, nem biblioteca de ícones externa.
2. Não escreva nada em caixa-alta (`uppercase`, `tracking-widest`), nem rótulo de 11 a 12px.
3. Não use serifa romana abaixo de 28px, nem Bodoni em texto corrido, botão, formulário, navegação desktop ou rodapé.
4. Não deixe uma palavra isolada dourada ou itálica no meio do título.
5. Não use cor de texto com opacidade (`text-x/70`, `opacity-60`), nem `ouro` (`#B69050`) em texto.
6. Não ponha `opacity: 0`, `visibility: hidden`, `translate` inicial ou atraso de entrada em conteúdo acima da dobra; não anime títulos, parágrafos, botões de conversão, imagens ou a barra.
7. Não use `framer-motion` (nenhum uso); não use `mix-blend-mode` no retrato da capa; não use WebGL, canvas, vídeo, parallax, cursor customizado ou animação infinita.
8. Não meça o DOM da página inteira para posicionar o Fio; não gere um path único para a página.
9. Não crie link cru para `wa.me`, `tel:` ou Google Maps: use `WhatsAppCTA`, `PhoneCTA`, `MapCTA`, `AgendarCTA`. Não mude nomes de evento nem o parâmetro `location` dos existentes.
10. Não centralize blocos de texto; não use fundo com gradiente decorativo, textura de grão ou sombra (salvo `--sombra-botao-fixo`).
11. Não invente depoimento, número, prêmio, título, horário, garantia, prazo; não reescreva fatos de `site-config.ts`; não reintroduza o endereço antigo.
12. Não use as fotos do consultório antigo, fotos clínicas de tratamento, nem exiba `dra-ana-recorte.webp` fora da capa da home.
13. Não crie uma segunda fonte display nem uma segunda cor de WhatsApp; não use valores de cor ou `px` soltos fora dos tokens deste documento.
14. Não toque em `src/app/api/leads`, na lógica de `appointment-form.tsx`, em `src/lib/analytics.ts` (nomes), na lógica de consentimento, em `src/lib/seo.ts`, em `src/lib/attribution.ts` ou no `/admin` (além das linhas de importação descritas em 4).
15. Não rode `next build` com o servidor de desenvolvimento ativo; não faça commit nem troque de branch.

---

## 8. Critérios de aceite (para a revisão final)

1. Capa em 390x844 conforme 6.1, sem JavaScript habilitado: H1, texto, botões e retrato visíveis; arco completo (sem animação) e sem erro de console.
2. `scrollWidth <= innerWidth` em 320/360/375/390/414/768/1024/1440, em todas as rotas, com o aviso de cookies aberto e fechado.
3. Cookie: altura <= 110px em 360x740; "Recusar" e "Aceitar" com mesma largura, altura e fonte.
4. Zero ocorrência de `[` `]` em título/descrição/JSON-LD; zero ocorrência de "sem dor", "R. Itapeva", "Bela Vista", "Av. Paulista", "Responsável Técnica", "vista panorâmica", "luz natural" no código do site.
5. Axe sem violações sérias; foco visível em todo elemento interativo; navegação completa por teclado, incluindo menu, FAQ, seletor e guia (Esc).
6. Reduced motion: nenhum movimento, fios inteiros, brilho ausente, guia como texto.
7. Lead de teste em `/agendamento` chega a `/api/leads` e à página `/obrigado`; eventos `whatsapp_click`, `phone_click`, `map_click`, `scheduling_intent` disparam em cada CTA.
8. Sem horizontal scroll nem sobreposição entre cabeçalho, barra, cookie e botão flutuante em nenhuma largura.
9. `/admin` compila e permanece legível; `npx tsc --noEmit` limpo.
10. Capturas lado a lado com o protótipo (`final-*.png`) e com este documento: mesma tipografia, mesmos fios, mesmos tons.

---

## 9. Dono de cada arquivo

**Fundação (primeira equipe, antes das demais):** `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx` (fontes, viewport, script `js`, `suppressHydrationWarning`), `next.config.mjs` (só `images.deviceSizes` e `minimumCacheTTL`), `src/lib/site-config.ts` (chaves e `mainNav`), `src/lib/whatsapp.ts` (`situation`), `src/lib/situations.ts` (novo), `src/lib/utils.ts` (sem mudança de API), `src/components/ui/*` (exceto os itens de página), `src/components/fio/*`, `src/components/layout/*`, `src/components/seo/cookie-consent.tsx`, `src/components/sections/{situation-context,situation-selector,treatment-index,breathing-guide,map-frame,areas-chapters,page-hero}.tsx`, `src/components/admin/admin-ui.tsx` (novo) e as linhas de importação do admin, `src/app/(site)/layout.tsx`. Pode apagar `care-needs.tsx`, `differentials.tsx`, `testimonials.tsx` (a chave `showTestimonials` e `content.ts` ficam), `treatment-card.tsx`, `treatments-section.tsx`, `photo-placeholder.tsx`, `treatment-icon.tsx`, `hero-whatsapp-button.tsx`, `whatsapp-floating-button.tsx` depois que ninguém mais os importar.

**Páginas (equipes paralelas, depois da fundação):** cada `src/app/(site)/<rota>/page.tsx`, `not-found.tsx`, `error.tsx`, `global-error.tsx`, `src/components/forms/appointment-form.tsx` (**só apresentação**), `src/components/sections/{contact-methods,thank-you-actions,cta-section,faq-section,location-section}.tsx` (ou substituídos por composição direta) e a reescrita dos textos em `src/lib/content.ts` e `src/lib/treatments.ts` seguindo 6.5 (sem `[Cidade]`, sem superlativos, sem "sem dor").

**Legado do `/admin` (não remover):** em `tailwind.config.ts` mantenha `colors.brand.*` (`green`, `green-dark`, `green-deep`, `gold`, `gold-soft`, `gold-ink`, `gold-bright`, `bone`, `beige`, `mint`, `gray`, `ink`), `container` (padding e `2xl`), `boxShadow.{soft,card,lift,gold,inset}`, `borderRadius.{xl2,3xl}`, `fontFamily.display` e `fontFamily.sans` (apontando para `--font-display` e `--font-sans`), e em `globals.css` as classes `.surface` e `.no-scrollbar`. Comente o bloco com `/* LEGADO /admin — não usar no site */`. Todo o restante antigo (`text-display-*`, `.eyebrow`, `.lede`, `.gold-rule`, `.gold-diamond`, `.texture-grain`, `.section-y`, keyframes) pode sair.

### Anexo A — Esqueleto do Tailwind (a Fundação implementa)

```ts
// tailwind.config.ts (trechos novos)
theme: { extend: {
  screens: { xs: "375px", tab: "760px", desk: "1100px", wide: "1440px" },
  colors: {
    osso: "var(--osso)", papel: "var(--papel)", areia: "var(--areia)",
    verde: "var(--verde)", "verde-escuro": "var(--verde-escuro)",
    noite: "var(--noite)", "noite-fundo": "var(--noite-fundo)",
    tinta: "var(--tinta)", "tinta-2": "var(--tinta-2)",
    ouro: "var(--ouro)", "ouro-tinta": "var(--ouro-tinta)", "ouro-claro": "var(--ouro-claro)",
    "ouro-hover": "var(--ouro-hover)", nevoa: "var(--nevoa)", linha: "var(--linha)", erro: "var(--erro)",
    bg: "var(--bg)", head: "var(--head)", fg: "var(--fg)", "fg-2": "var(--fg-2)", accent: "var(--accent)", rule: "var(--rule)",
    brand: { /* LEGADO /admin */ },
  },
  fontFamily: { display: ["var(--font-display)", "Didot", "Georgia", "serif"],
                sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
  borderRadius: { pill: "999px" /* + legado xl2, 3xl */ },
  transitionTimingFunction: { fio: "cubic-bezier(.65,0,.35,1)", toque: "cubic-bezier(.16,1,.3,1)" },
}}
```

### Anexo B — Esqueleto de `globals.css` (a Fundação implementa)

```css
:root{
  --osso:#FBF8F1; --papel:#F3EDE0; --areia:#EFE5D0; --verde:#22513A; --verde-escuro:#1A4230;
  --noite:#0F2A1E; --noite-fundo:#08170F; --tinta:#16251D; --tinta-2:#44564B;
  --ouro:#B69050; --ouro-tinta:#76591E; --ouro-claro:#DCC285; --ouro-hover:#E6CF9B;
  --nevoa:#C3CEC6; --linha:#6F7F74; --erro:#9E2A2B; --luz:#9A7A35;
  --fio:rgba(182,144,80,.55); --fio-claro:rgba(220,194,133,.45);
  /* tom padrão = osso */
  --bg:var(--osso); --head:var(--verde); --fg:var(--tinta); --fg-2:var(--tinta-2);
  --accent:var(--ouro-tinta); --rule:var(--fio); --focus:var(--verde);
  --pad:clamp(20px,5.2vw,72px); --rail:0px; --gap:clamp(16px,2.4vw,32px);
  --sec-y:clamp(5.5rem,3.5rem + 6.2vw,8.75rem);
  --d-wght:500; --d-opsz:11;
  /* camadas: ver 2.5 */
}
@media (min-width:760px){ :root{ --d-opsz:28; --h-header:72px; --h-bar:0px } }
@media (min-width:1100px){ :root{ --h-header:76px } .has-rail{ --rail:56px } }
@media (min-width:1200px){ :root{ --d-wght:450; --d-opsz:48 } }
[data-tone="papel"]{ --bg:var(--papel) }
[data-tone="noite"],[data-tone="verde"]{ --head:var(--osso); --fg:var(--osso); --fg-2:var(--nevoa);
  --accent:var(--ouro-claro); --rule:var(--fio-claro); --focus:var(--ouro-claro) }
[data-tone="noite"]{ --bg:var(--noite) } [data-tone="verde"]{ --bg:var(--verde) }
body{ background:var(--osso); color:var(--tinta); font-family:var(--font-sans),system-ui,sans-serif;
  font-size:1.0625rem; line-height:1.6; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility }
:focus-visible{ outline:2px solid var(--focus); outline-offset:2px; box-shadow:0 0 0 2px var(--bg) }
::selection{ background:var(--verde); color:var(--osso) }
```

---

## 13. Páginas internas (estado após a integração)

Vale mais que 5 e o apêndice A onde houver divergência, e menos que a seção 0. Todas as rotas públicas passam por `tsc` limpo, ESLint sem erro (os avisos `react-refresh/only-export-components` vêm do `metadata`/`generateMetadata` exportados nas páginas e são o padrão do projeto) e `scripts/check-site.mjs` sem falha.

### 13.1 Limpeza feita na integração

- `globals.css`: apagados o bloco "LEGADO NAS PÁGINAS INTERNAS", `.site-shell .eyebrow/.surface`, `.eyebrow`, `.lede`, `.gold-rule`, `.gold-diamond`, `.texture-grain`, `.section-y`, `.text-balance` e `.text-pretty`. Ficam `.surface` e `.no-scrollbar` (só o `/admin`).
- Apagados: `sections/testimonials.tsx`, `ui/treatment-icon.tsx`, `ui/reveal.tsx`, `testimonials` de `content.ts`, `showTestimonials`/`showTreatmentPhotos`/`showOfficePhotos`/`reviewUrl` de `site-config.ts`, `icon` e `images` de `treatments.ts`.
- `lucide-react` saiu do `package.json` e do lockfile; `components/admin/admin-icons.tsx` traz os 13 ícones do painel.
- Apelidos antigos de `Button`, `PageHero` e `SectionHeading` removidos (ver 11).
- `tailwind.config.ts` ainda declara `fade-up`, `fade-in` e `draw` (keyframes e animação) sem uso: remover quando o arquivo for liberado.
- `public/consultorio-1..3.png` (consultório antigo) e `public/tratamentos/*` foram para `_arquivo/` (fora de `public/` e do Git), sem apagar.

### 13.2 Mapa das rotas

| Rota | Tons (de cima para baixo) | Composição própria |
|---|---|---|
| `/sobre` | osso, papel, osso, papel, noite, osso | retrato em arco com legenda "Fig. 1"; ensaio em 7 colunas com declaração em 5; formação em linhas numeradas; consultório em noite |
| `/tratamentos` | osso, papel, osso, noite | capa com o "08"; sumário em linhas com `excerpt`; seletor de situação; fecho |
| `/tratamentos/[slug]` (8) | osso, papel, osso, papel, osso, papel, osso, noite | numeral "03 de 08" e ficha; três faixas de conteúdo; passos; cuidados (só onde há dados); valores sem preço; região; FAQ; anterior/seguinte; fecho |
| `/agendamento` | osso, papel (formulário) | painel noite de WhatsApp acima do formulário no celular; fio vertical com três etapas; aside fixo no desktop |
| `/contato` | osso, papel, noite, osso | retrato em arco com WhatsApp e telefone em numerais; canais em linhas; mapa em arco |
| `/primeira-consulta` | osso, verde, osso, papel, osso, papel, noite | "40 a 60 minutos" em ouro; passos em linha do tempo; perguntas práticas à vista |
| `/valores` | osso, papel, osso, noite, papel, osso | "5" monumental; princípios em numerais; orçamento em fio com losangos; declaração em noite |
| `/urgencia-odontologica` | osso, papel, osso, verde, noite, papel, noite | hero largo com bloco de confiança; passos em linha; bloco de pronto-socorro; faixa em noite |
| `/medo-de-dentista` | osso, papel, noite, papel, osso, papel, osso, noite | três anéis com monograma; mural de sentimentos; guia de respiração em noite |
| `/obrigado` | osso, verde | arco grande; "O que acontece agora" em três passos; `noindex` |
| `/politica-de-privacidade`, `/termos-de-uso` | osso, papel | numeral "10"/"09"; sumário preso à tela (>= 960px) ou `<details>` |
| 404 | osso | `noindex, nofollow`, sem canonical, título "Página não encontrada" |

Regra de ritmo: nunca dois tons iguais seguidos no miolo. O fecho em noite seguido do rodapé (também noite) é a única repetição permitida e vale para todas as rotas, home incluída.

### 13.3 Componentes novos (todos servidor, salvo indicação)

- **Tratamentos** (`sections/`): `tratamento-abertura`, `tratamento-capa`, `tratamento-nome`, `tratamento-conteudo`, `tratamento-cuidados`, `tratamento-grupo` (**cliente**, recolhe os grupos no celular), `tratamento-valores`, `tratamento-regiao`, `tratamento-outros`, `tratamento-sumario`, `tratamento-fecho`, `tratamento-util.ts`, `tratamento-indice.module.css`. `treatments.ts` ganhou `layout?: "limite" | "linha" | "colunas"` (como o conteúdo se organiza) e `hasCareNotes()`.
- **Sobre**: `sobre-hero`, `sobre-ensaio`, `sobre-formacao`, `sobre-consultorio`, `sobre-sections.module.css`.
- **Contato**: `contato-hero`, `contato-mapa`, `contato-fecho` (só o formulário, `AgendarCTA`, `cta_final`), `contato-endereco` (`EnderecoLinha`, compõe o endereço com CEP), `contact-methods` (linhas com fio), `contato-sections.module.css`.
- **Apoio**: `apoio-hero` (prop `mobileMark`), `apoio-cabeca`, `apoio-duas` (prop `larga`), `apoio-declaracao`, `apoio-passos`, `apoio-qa`, `apoio-principios`, `apoio-linha`, `apoio-sentimentos`, `apoio-tempo`, `apoio-cinco`, `apoio-aneis`, `apoio-metadata.ts`.
- **Legal**: `legal-shell` (`sections`, `notes`, `children`; exporta `LegalHeading`) e `legal-shell.module.css`.
- **Agendamento/obrigado**: `obrigado-heading` (**cliente**, foca o H1 e lê o nome do `sessionStorage`), `lib/agendamento-handoff.ts`, `forms/agendamento-form.module.css`.

### 13.4 Metadados (6.4)

- Título de até 60 caracteres e descrição de até 155, medidos por `scripts/check-site.mjs`. `buildMetadata` junta "| Dra. Ana Beatriz" só quando o título não cita o nome; as páginas de apoio, tratamentos, sobre e contato definem o título completo (`title.absolute`) porque o sufixo estouraria o limite.
- `lastReviewed`/`reviewedBy` saíram do JSON-LD até a Dra. confirmar a revisão de conteúdo.
- `/obrigado` e `/admin` não têm canonical indexável; o `Analytics` não carrega em `/admin` e o banner de cookies também não.
- Breadcrumb visível (`Breadcrumbs`) e `BreadcrumbList` em todas as internas, incluindo as legais.

### 13.5 Textos e rótulos

- Rótulos de CTA: só o vocabulário fechado de 0.2 ("Agendar pelo WhatsApp", "Tirar dúvidas no WhatsApp", "Preencher formulário", "Como chegar", "Ligar" e, depois do envio, "Continuar no WhatsApp"). Os rótulos "Falar pelo WhatsApp", "Agendar avaliação" e "Falar agora pelo WhatsApp" foram aposentados.
- "A orientação por WhatsApp não substitui o exame." e as respostas de pagamento, duração, convênio e avaliação vêm de `respostas` (`content.ts`). A pergunta da avaliação é "O que inclui a avaliação?".

### 13.6 Eventos e conversão

- Nomes inalterados. Novas posições (`location`): `treatment_page`, `treatment_region`, `treatment_steps`, `treatment_warning`, `treatment_pager`, `treatments_index`, `treatments_hero`, `appointment_page`, `form_alt`, `form_error_fallback`, `contact_page`, `contact_map`, `sobre_consultorio`, `first_visit_hero`, `valores_hero`, `urgency_hero`, `urgency_midpage`, `fear_hero`, `fear_page`, `breathing_guide`, `thank_you`, `not_found`.
- **Conversão única:** `lead_created` dispara só em `/obrigado` (`ThankYouActions`), uma vez por sessão, guiado pelo `sessionStorage`. Sem `sessionStorage`, o formulário dispara uma vez. `appointment_form_submit` é evento à parte e **não** vira `Lead` do Meta (`analytics.ts`). No Google Ads e no GA4, importar `lead_created`.
- Resposta `trap: true` da API (honeypot ou envio em menos de 3 s): o formulário vai a `/obrigado` sem gravar nada nem contar conversão.

### 13.7 Contrato do formulário com `/api/leads`

- Corpo: campos de `appointmentSchema` mais `attribution` e `formStartedAt` (ms, quando o formulário abriu).
- Respostas, sempre `no-store`: 200 `{ok, persisted, emailed, trap?}`; 400 `invalid_json`; 403 `forbidden`; 413 `payload_too_large`; 422 `validation` com `fieldErrors` (e `issues` no formato antigo, que o formulário lê); 429 `rate_limited` com `retryAfter` e cabeçalho `Retry-After`; 503 `delivery_failed`.
- O formulário mostra erro por campo no 422, orientação com tempo no 429, "problema do nosso lado" nos 5xx (incluindo 503) e mensagem de conexão se a rede falhar; em todos mantém os dados e oferece WhatsApp (`form_error_fallback`).
- Limites: 30 requisições por 10 min por IP antes de ler o corpo e 5 por 10 min depois de um corpo válido (em memória, por instância).

### 13.8 Pendências conhecidas

- **Dra. Ana confirmar:** (a renomeação para "Remoção de dentes inclusos e cirurgias na boca" já foi feita, ver 0.1; a lista completa e atual está em 0.7) revisão de conteúdo (reativa `lastReviewed`); horário (`hours`, vazio); estacionamento e acessibilidade (sem fato, `/contato` não tem FAQ).
- **Jurídico:** prazo de retenção, Encarregado (DPO), base legal da atribuição de campanha (o texto do aceite fala só em contato e atendimento), transferência internacional, nota sobre as tags do Google sem cookies.
- **Produção:** `ADMIN_PASSWORD` (12 caracteres ou mais) e `ADMIN_SESSION_SECRET` (32 ou mais) na Vercel; IDs de medição só depois de conferir que `consent-default` vem antes de `gtag/js`/`gtm.js`; rate limit continua por instância.
- **Ferramentas:** o script `lint` existe (ver 0.6). Lighthouse, teste de leitor de tela e `next build` com `check:site` no modo padrão dependem de um build de produção, que o diretor roda.
- **Celular:** o implante tem cerca de 12 telas de rolagem (meta era 9). O guia de respiração só foi testado em Chrome desktop e usa `:has()`.
- **Endereço:** `siteConfig.address.full` não traz o CEP nem "(região da Freguesia do Ó)"; as páginas compõem o endereço pelos campos.


---

## Apêndice A. Histórico das correções (antigas seções 10, 11 e 12)

Só registro. O que ainda vale está em 0 e 13. Onde este apêndice citar `Reveal`, `WhatsAppFloatingButton`, `FloatingWhatsApp` ou rótulos de botão antigos, esses itens foram removidos ou trocados (ver 0.2 e 0.3).

### A.10 (antiga 10) Notas da Fundação (o que a implementação mudou em relação ao texto acima)

Registro da primeira equipe. Onde esta seção e as seções 1 a 9 discordarem, vale esta seção (e o código).

**Caminhos que mudaram**
- Marca e Fio ficam em `src/components/brand/`: `logo.tsx` (`Monogram`, `Symbol`, `Logo`), `fio-rule.tsx` (`FioRule`), `fio-smile.tsx` (`FioSmile`, recebe o botão como `children`), `fio-progress.tsx` (`FioProgress`) e `fio-rail.tsx` (`FioRail`, props `stops: {id, label}[]`). Não existe `src/components/fio/` nem `ui/logo.tsx`.
- `RevealObserver` está em `src/components/motion/reveal-observer.tsx` (montado em `SiteShell`).
- `WhatsAppFloatingButton` continua em `layout/whatsapp-floating-button.tsx` (não `floating-whatsapp.tsx`); o estado visível é a classe `.flut-on`.
- Novos em `layout/`: `site-shell.tsx` (`SiteShell`: link de pular, `Header`, `<main id="conteudo">`, `Footer`, barra, flutuante e `RevealObserver`; usado por `(site)/layout.tsx` e pelo 404), `nav-links.tsx` (`NavLinks`, cliente) e `menu-sheet.tsx` (`MenuSheet`, cliente).
- `src/components/ui/tracked-link.tsx` (`TrackedLink`) e `ui/cta.tsx` como na especificação. O `tracked-button-link.tsx` continua porque `HowItWorks` o usa (link de texto rastreado); aceita só `ButtonVariant` e `ButtonSize` atuais.
- As versões antigas de `Button`, `Input`, `Label` e `BrandSymbol` foram copiadas sem alteração para `src/components/admin/admin-ui.tsx`; só as importações de `admin-login.tsx` mudaram.

**Props que mudaram**
- `PhoneCTA`: `as?: "botao" | "texto"` (em vez de `variant="texto"`, porque `variant` é a variante do botão). `WhatsAppCTA`, `PhoneCTA`, `AgendarCTA` e `MapCTA` aceitam também `block` (largura toda); `WhatsAppCTA` e `AgendarCTA` aceitam `iconOnly`.
- `Section`: `hideFloating?: boolean` (grava `data-hide-floating`; o rodapé já grava).
- `FioRule`/`Reveal`/`IndexList`/`FAQ`/`TrustBlock` marcam `data-reveal` no próprio elemento; `RevealObserver` põe `.in` uma vez. Fios dentro de um `[data-reveal]` também se desenham.
- `ErrorSummary`: props `errors: {id, message}[]`, `id?`, `title?`. `ChipRadio` e `Checkbox` recebem `label` e os props nativos do `<input>`. `FieldError` mostra "Atenção:" e **não** tem `role="alert"` (só o `ErrorSummary` tem).
- `ArchPortrait` já renderiza o `<figure>` com a legenda "Fig. N" (props `caption?`, `fig?`, `priority?`, `sizes?`).
- `PageHero`: `visual="arco"` usa `Monogram` 96px dentro do arco (omitido abaixo de 760px).
- ~~Apelidos antigos de `Button`, `PageHero`, `SectionHeading` e `Reveal`~~: **removidos em 13.** `Button`/`ButtonLink` aceitam só `primario`, `contorno`, `ouro`, `contorno-claro`, `texto` e os tamanhos `md`/`sm`; `PageHero` só `kicker`, `lede`, `actions`; `SectionHeading` só `lede` e `level`.

**Ajustes técnicos**
- O fallback da Bodoni em `layout.tsx` é `["Didot", "Georgia", "serif"]`: o `next/font` não põe aspas e `Bodoni 72` (nome com número) invalida a declaração `font-family` inteira.
- O espaçamento do cabeçalho e da barra vai na classe `.site-shell` (e não no `body`), para não deslocar o `/admin`.
- Os breakpoints foram declarados como lista **completa e em ordem** (`xs 375, sm 640, tab 760, md 768, lg 1024, desk 1100, xl 1280, wide 1440, 2xl 1536`): só estender faria os novos caírem depois de `2xl` no CSS e quebraria a cascata.
- **Classes `.t-*`, `.btn-*`, `.idx-*` etc. vivem em `@layer components`**, e o Tailwind descarta classes dessa camada que não aparecem **por extenso** no código. Nunca monte esses nomes com template string (`` `t-${size}` ``): use um mapa com os nomes escritos (como `DisplayHeading` e `IndexList` fazem). O `tailwind.config.ts` tem uma `safelist` de segurança para os tamanhos de título.
- `cn()` (em `src/lib/utils.ts`) usa `extendTailwindMerge` com `text-display-*` no grupo `font-size`. As classes `.t-*` não passam pelo merge.
- Cor `ring` e `background`/`foreground` antigas do Tailwind, `fontSize.display-*`, `.eyebrow`, `.lede`, `.gold-rule`, `.gold-diamond`, `.surface`, `.section-y` foram apagados em 13, exceto `.surface` e `.no-scrollbar`, que o `/admin` ainda usa.
- Cookies: texto encurtado para caber em 2 linhas a 360px ("Cookies essenciais sempre ativos; os de medição só com a sua autorização. Veja a Política de Privacidade."). Altura medida: 107px (14,4% de 740px). Recusar e Aceitar são idênticos.
- Botão flutuante: ganhou um anel `osso` de 2px (além da sombra única) para continuar visível sobre as seções `verde` e `noite`.
- `FioRail`: o tom (osso, papel, noite, verde) vem da seção que está sob o centro da janela (não do ponto atual); os losangos ficam numa faixa (`.rail-track`) entre o numeral e o texto vertical "CRO-SP"; sem JavaScript o trilho não é exibido (`html:not(.js) .rail`).
- `/obrigado` e as demais páginas continuam usando o `track()` e os eventos de sempre; todo link novo de WhatsApp/telefone/mapa/agendamento nasce dos quatro CTAs.

**Servidor de desenvolvimento**
- O servidor em `localhost:3100` NÃO relê `tailwind.config.ts` ao salvar (cores, breakpoints e `safelist` novos só aparecem depois de reiniciar o `next dev`). Mudanças em `globals.css` e nos componentes recarregam normalmente.

### A.11 (antiga 11) Correção 1 (revisão de três críticos): o que mudou e vale mais que o texto acima

**Ambiente.** Mudanças em `tailwind.config.ts` (os `screens` novos) só chegam ao CSS depois de **reiniciar** o `next dev`: o servidor em `:3100` foi reiniciado e `grep -F 'tab\:' layout.css` agora devolve 21 ocorrências. As grades críticas não dependem mais de utilitário responsivo: `.pg-text`/`.pg-fig` (hero das páginas internas, em `globals.css`) e CSS modules (`editorial.module.css`, `footer.module.css`, `hero.module.css`). `next.config.mjs` ganhou `devIndicators: false`.

**Home, ordem e tons:** capa (osso) + declaração em 3 colunas · tratamentos (papel) · **declaração da Dra. (noite, `declaration-section.tsx`: a citação em Bodoni itálico até 96px, símbolo claro em marca d'água)** · a doutora (osso, retrato `dra-ana.webp` em arco com filete, "Fig. 2", sem chip) · implante e buco-maxilo (papel, duas linhas de sumário, sem cartões nem selos: a formação vira a linha "Formação: ABO Central · APCD Central") · como funciona (verde, `IndexList variant="passos"`, título à esquerda e sticky) · onde estamos (osso; mapa com filtro `grayscale+sepia+hue-rotate` para a paleta) · dúvidas (papel; título e botão presos à esquerda, **8** perguntas em `<FAQ>`; o JSON-LD recebe exatamente as mesmas 8: `HOME_FAQS = homeFaqs.slice(0, FAQ_MAX)`) · fecho (**verde**, botões lado a lado, arco de sorriso mais largo que o botão; o trio endereço/contato saiu, o rodapé o traz) · rodapé (noite). `home.module.css` e o invólucro `.legacy` foram apagados.

**Componentes.** `AboutPreview`, `AreasSection` (props `tone`, `id`), `HowItWorks`, `LocationSection` (prop `tone`) e `FAQSection` (props `id`, `tone`) são **servidor**, sem framer-motion; `FAQAccordion` foi apagado. `FAQ` não corta mais em silêncio: exporta `FAQ_MAX = 8` e avisa no console em desenvolvimento se receber mais; **a página escolhe as perguntas e passa a mesma lista ao `<FAQ>` e ao `faqSchema`**. `reveal.tsx` perdeu `RevealGroup`, `revealItem` e o import de framer-motion. `TrackedButtonLink` aceita as variantes novas (`ButtonVariant`). `TrackedLink` externo com `aria-label` acrescenta " (abre em nova aba)" ao rótulo. `SectionHeading` esconde o folio no celular (some a linha solta "Sumário"). `.site-shell .eyebrow` e `.site-shell .surface` (legado das páginas internas) passam a itálico sem caixa-alta e a superfície plana sem raio nem sombra; o `/admin` não muda.

**Capa.** Celular: título, texto e o botão de WhatsApp (verde, largura total) vêm **antes** do retrato; o masthead some abaixo de 760px (CRO e bairro descem para depois do retrato); "Ver tratamentos" e "Prefere ligar?" ficam depois do retrato no celular e ao lado do botão a partir de 760px (o mesmo link existe duas vezes no HTML, um oculto por CSS em cada faixa). A composição de duas colunas (H1 + texto à esquerda, retrato à direita) vale a partir de **960px** (e o retrato inteiro cabe em 768px de altura). O retrato ganhou o segundo fio dourado a 14px e a linha de base. Espaçamento de seção: `--sec-y: clamp(4rem, 1.6rem + 7vw, 8.75rem)` (64px no celular).

**Rodapé.** Marca, endereço e contato à esquerda (5 colunas); Navegação, Para você e Tratamentos à direita (7). No celular, listas em duas colunas. O trilho some quando o rodapé entra na tela.

**Celular.** A barra fixa (`MobileActionBar`) some enquanto `section[data-hide-floating]` está na tela (o fecho tem o mesmo botão). O menu em folha abre com "Agendar pelo WhatsApp" no topo, o foco inicial vai para "Fechar", e depois de navegar o foco não volta ao botão "Menu". Botão flutuante: oculto a partir de 1100px.

**Medição.** `situation_select {need}` (novo, debounce 600ms) registra a escolha; `care_need_click {need, href}` voltou a significar clique no link do painel (mesmo ponto de antes). O `location="care_needs"` foi aposentado: `situation` o substitui (cliques de WhatsApp do painel: `whatsapp_click` com `location="situation"`). `location="faq"` é novo (botão "Tirar dúvidas no WhatsApp").

**Robustez.** Fios: `html.js:not(.reveal-off)`; se a hidratação não cancelar o temporizador do `<head>` em 5s, `reveal-off` mostra tudo. O seletor só esconde a lista de links com `html.sel-ready`. Movimento reduzido no `BreathingGuide`: o botão some por CSS e o botão de WhatsApp fica sempre visível; `start()` nunca é mudo. `error.tsx` tem `<main id="conteudo">`. `FioRail` avisa em desenvolvimento se um `id` de ponto não existir. Os comentários `eslint-disable` de regras inexistentes foram removidos (`npx eslint src` não deve mais acusar "Definition for rule not found").

**Página interna em 15 linhas** (referência para as outras equipes; os caminhos reais são `src/components/brand/*`, não `fio/*`):

```tsx
<PageHero kicker="Tratamento" title="Clareamento dental" lede="..." breadcrumbs={[...]}
  actions={<><WhatsAppCTA location="hero_clareamento" /><AgendarCTA location="hero_clareamento" /></>} />
<Section tone="papel" id="como-funciona" aria-labelledby="cf-titulo">
  <Container>
    <SectionHeading id="cf-titulo" eyebrow="Como funciona" title="..." />
    <IndexList variant="passos" items={passos} />
  </Container>
</Section>
<FAQSection items={faqs} />            {/* a MESMA lista vai ao faqSchema(faqs) */}
<CTASection tone="verde" />
```
Use `.pg-text`/`.pg-fig` e módulos CSS para colunas; não dependa de `tab:`/`desk:` para estrutura de grade.

### A.12 (antiga 12) Correção 2 (revisão de três críticos): o que mudou e vale mais que o texto acima

**Gutter único (R2).** `--rail: 56px` vale em **todas** as páginas a partir de 1100px e `--wrap-max` é 1480px (1640px a partir de 1700px). `.wrap`, `.hdr-in`, o rodapé e o `PageHero` usam `padding-left: calc(var(--pad) + var(--rail))`: logo, capa, miolo e rodapé começam no mesmo x (128px a 1440). `.has-rail` virou só um marcador (o gutter não depende mais dele). Nunca centralize o miolo com `max-w-* mx-auto`. Grade: `Grid12` (`ui/grid12.tsx`, `split` 7-5, 5-7, 8-4, 3-9; abaixo de 760px uma coluna).

**Cabeçalho (R2-01, R11).** De 1100 a 1279px o botão mostra "Agendar" (`compactLabel`), a linha "Cirurgiã-dentista" some e os itens do menu ficam a 10px; `.hdr .btn` é `nowrap`. O losango de "Urgência" é vazado (5px). **Botão flutuante removido** (componente e CSS apagados).

**Capa (R4 desktop, R1 e R2 celular, R2-03).** O kicker é uma frase completa dentro do H1 ("Dentista particular na Freguesia do Ó", seguido de um ponto só para leitor de tela) e o título é "Atendimento acolhedor, claro e sem pressão.". O masthead (CRO) aparece também no celular. O texto de apoio no celular tem só a primeira frase. Em telas baixas (<= 780px) a capa se compacta para o rosto inteiro ficar acima da barra, com ou sem o aviso de cookies. Retrato maior (540px), fundo `papel`, **um só fio** (o filete deslocado saiu) e base de 1px. **Barra fixa:** continua desde o primeiro pixel (DIRECAO e critério de aceite); a sugestão de escondê-la enquanto o botão da capa está visível foi **recusada**. A barra do celular não tem mais o mapa: o evento `map_click` com `location="mobile_bar"` deixou de existir (o mapa segue em `location_section` e no menu).

**Declaração + três colunas (R5).** Três colunas iguais com subgrade (títulos e corpos alinhados), fio superior de 100% da coluna, sem divisórias verticais; a frase ocupa 10 colunas.

**Seletor e sumário (R6, R13, R2-04, R2-07, R2-08).** Numeração do seletor em letras (A a G). Sem escolha, a coluna da direita (desktop) mostra um cartão noite com o convite. No celular, a linha tem chevron (não o losango) e o painel só abre com toque/clique, Enter ou ao sair do grupo (setas só marcam); no desktop o painel já está numa coluna própria e abre na hora; `aria-controls`, `role=region` e o `role=status` dizem como abrir. "Todos os tratamentos" é `<h3>` com fio acima. Os fios das listas usam atraso máximo de 8 x 40ms e 520ms (nada de "escada"). `IndexRow` e `IndexEnd` (`ui/index-list.tsx`) são o molde de qualquer lista com fios; o seletor e o sumário os usam. O trecho de cada tratamento vai também num `sr-only` dentro do link (o cartão noite continua visual).

**Áreas, como funciona, localização, dúvidas (R7, R9, R10, R2-02).** Cada área tem **um** link com seta ("Conhecer ...") e a seção termina num botão único "Agendar avaliação" (`scheduling_intent`, `location="areas"`); "Cirurgia buco-maxilo-facial" em frase, com a palavra de hífens inteira. "Como funciona" perdeu o botão de WhatsApp (fica só o link da primeira consulta), com título em 6 colunas. Localização: sem a linha "Agendamento" (a linha "Horário" só existe se `siteConfig.hours` estiver preenchido), "Como chegar" é botão e "Agendar" é link, e o mapa tem janela em arco com fio dourado (o Google não permite esconder os pontos de comércio do mapa incorporado). **Dúvidas na home: todas as 16 perguntas** vão ao HTML e ao JSON-LD; 8 aparecem abertas à vista e as outras 8 ficam em "Ver todas as perguntas" (`<details>`). `FAQ_MAX` virou 16 por lista.

**Fecho (R3).** `CTASection tone="noite"` na home (segunda cena de impacto, H2 em itálico até 120px) e um fio dourado de 1px no topo do rodapé. O arco de sorriso (`FioSmile`) é uma meia-elipse de borda de CSS sob o botão, 12 a 20px mais larga que ele, sem SVG medido; o botão e o parágrafo começam no mesmo x.

**Rodapé (R14, R10 celular).** Nome em até 40px, contatos mais juntos, texto legal em 14px, marca d'água só do monograma AB, sem cruzar o texto. No celular o bloco de contato fica enxuto, "Tratamentos" é um `<details>` recolhido e os links legais têm 44px de altura.

**Trilho (R8, R2-10).** Um losango por seção da home (9: capa, tratamentos, declaração, a doutora, implante e buco-maxilo, como funciona, onde, dúvidas, agendar); o numeral acompanha o losango cheio. O tom é calculado **por peça** (numeral, cada losango e o "CRO-SP"): cada uma lê a seção sob o próprio centro (`data-t`); numeral e CRO levam uma plaquinha na cor da seção. Paradas com `tabIndex={-1}` (o trilho é atalho de mouse e toque; teclado usa landmarks e o link de pular). A ordem de Tab não passa mais por 9 losangos.

**Celular (R8, R11, mobile R15).** Abaixo de 380px os botões laterais da barra têm 44px e o rótulo é "Agendar pelo WhatsApp" inteiro (o rótulo curto só abaixo de 340px); o aviso de cookies fica mais baixo (Recusar e Aceitar continuam idênticos). O menu em folha tem itens de até 34px, o losango de "Urgência" mudou para o lado do rótulo, o telefone entrou logo abaixo do formulário e os links de apoio ficam sob o rótulo "Para você". Na home "A doutora" mostra um parágrafo só no celular e o retrato recortado sobre `papel`, igual à capa.

**Páginas internas.** A ponte "LEGADO NAS PÁGINAS INTERNAS" de `globals.css` foi apagada em 13: todas as páginas foram refeitas e a confirmação foi por captura.

**Limpeza (R2-06).** `framer-motion` saiu do `package.json`, do lockfile e do `optimizePackageImports`. `Section` ainda aceita `folio` mas ignora (sem `data-folio`).

**Medição e acessibilidade (R2-11).** `TrackedLink` externo com `aria-label` já acrescenta " (abre em nova aba)" (inclusive nos botões compactos da barra). Eventos: `situation_select` na escolha; `care_need_click` só no clique do link do painel.

**Pendências (resolvido depois).** `BreathingGuide` já está montado em `/medo-de-dentista` (ver 0.3). O desenho do símbolo com a rolagem (R15) não foi feito.
