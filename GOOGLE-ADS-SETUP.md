# Google Ads — guia de ativação (passo a passo)

O site já está **pronto no código**: eventos de medição (`whatsapp_click`,
`phone_click`, `email_click`, `lead_created`…), Consent Mode v2, captura de gclid/UTM no formulário e
página `/obrigado`. O que falta são as **contas Google** (só você pode criar)
e os **IDs nas variáveis de ambiente**. Siga na ordem.

---

## 1. Google Search Console (antes de qualquer anúncio)

1. Acesse https://search.google.com/search-console e adicione a propriedade
   **Domínio**: `draanabeatrizodonto.com.br` (verificação via DNS, no painel
   onde o domínio foi registrado).
2. Envie o sitemap: `https://www.draanabeatrizodonto.com.br/sitemap.xml`.
3. Em "Inspeção de URL", cole a home e clique **Solicitar indexação**.
   Repita para `/tratamentos`, `/agendamento` e `/urgencia-odontologica`.
4. Em 2–4 semanas, confira se `site:draanabeatrizodonto.com.br` no Google
   retorna as páginas.

## 2. Google Business Profile (o passo de maior retorno — grátis)

1. https://business.google.com → criar/reivindicar o perfil:
   **Dra. Ana Beatriz Lemos Souza — Cirurgiã-Dentista**, categoria "Dentista",
   endereço R. Rio Verde, 1029 — Vila Bruna, telefone (11) 93922-2289, site
   https://www.draanabeatrizodonto.com.br.
2. Complete TUDO: horários reais, fotos do consultório e da Dra. (mínimo 10),
   serviços (limpeza, clareamento, restaurações, implante dentário, remoção de dentes inclusos e cirurgias na boca, urgência).
   Não use nome de especialidade nem forma de pagamento nos textos do perfil.
3. O site não tem botão "Avaliar no Google" (não há link de avaliação no
   `src/lib/site-config.ts`); o link de avaliação fica só no perfil e nas
   mensagens da clínica.
4. Rotina: pedir avaliação a **todo** paciente atendido (meta: 50 em 6 meses).

## 3. Google Tag Manager + GA4

1. Crie um contêiner Web em https://tagmanager.google.com → anote o `GTM-XXXXXXX`.
2. Crie uma propriedade GA4 em https://analytics.google.com → anote o `G-XXXXXXXXXX`.
3. Antes de ligar, confira que a Política de Privacidade descreve as tags do Google
   (com o ID definido, elas carregam para todos os visitantes, e sem aceite enviam
   pings sem cookie).
4. Defina na Vercel (Settings → Environment Variables, escopo Production):
   - `NEXT_PUBLIC_GTM_ID = GTM-XXXXXXX`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX`
     Com o GTM definido, o site só envia eventos ao `dataLayer`: configure o GA4 e o
     Google Ads **dentro do contêiner** (o site não carrega o gtag.js direto).
5. Faça um redeploy. O site injeta as tags com **Consent Mode v2** automaticamente
   (armazenamento negado até o aceite do banner — conforme LGPD).

## 4. Conversões do Google Ads

1. Crie a conta em https://ads.google.com (modo especialista, pule a campanha
   guiada inicial). Anote o ID `AW-XXXXXXXXX`.
2. No GTM, crie 2 tags **Google Ads Conversion Tracking**:
   - **Lead formulário** — acionador: evento personalizado `lead_created`, que o
     site dispara uma vez em `/obrigado`. Contagem: **uma por lead**. É a
     conversão principal.
   - **Clique no WhatsApp** — acionador: evento personalizado `whatsapp_click`
     (o site já envia esse evento ao dataLayer). Contagem: **uma por clique**.
     Marque como conversão secundária (interesse); `phone_click` e `email_click`
     seguem a mesma lógica.
     (Adicione também a tag "Conversion Linker", acionador All Pages.)
3. No Google Ads, marque `lead_created` como **conversão primária** e as de clique como secundárias.
4. **Teste antes de gastar**: GTM Preview (Tag Assistant) → clique num botão
   de WhatsApp do site → a tag deve disparar. Envie um lead de teste no
   formulário → `lead_created` deve disparar em `/obrigado`.

## 5. Conversões offline (fase 2 — otimizar por paciente, não por clique)

Cada lead do formulário agora chega **com o gclid** (no e-mail e no Supabase,
coluna `gclid`). Quando um lead virar consulta de verdade:

1. Exporte (planilha) os leads convertidos com gclid + data/hora.
2. Google Ads → Metas → Conversões → Importar → "Importar de arquivo".
3. Com volume, troque a conversão primária para essa — o algoritmo passa a
   buscar pacientes, não cliques.

## 6. Estrutura de campanha, palavras-chave e orçamento

A estratégia completa (2 campanhas, grupos por tratamento, negativas, orçamento
e regras do CFO para os textos) está documentada no relatório da análise, fora
deste repositório público. Resumo do que NÃO pode no anúncio: "avaliação gratuita", preço, forma de
pagamento (Pix, débito, crédito), promessa de resultado, "antes e depois",
foto de procedimento em andamento, "especialista", superlativo e "popular". Obrigatório: nome + Cirurgiã-Dentista + CRO-SP 177801.

## Variáveis de ambiente (referência)

| Variável                        | Onde conseguir                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_GTM_ID`            | tagmanager.google.com                                                                                                                                              |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | analytics.google.com                                                                                                                                               |
| `NEXT_PUBLIC_GOOGLE_ADS_ID`     | ads.google.com (só quando não se usa o GTM)                                                                                                                        |
| `NEXT_PUBLIC_META_PIXEL_ID`     | business.facebook.com (opcional, p/ Meta Ads; só carrega depois do aceite)                                                                                         |
| `NEXT_PUBLIC_SITE_URL`          | **Opcional.** O código já usa `https://www.draanabeatrizodonto.com.br`; se definir, use exatamente esse valor (um valor errado quebrou a indexação em 2026-06-10). |
