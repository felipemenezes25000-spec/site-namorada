import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata, faqSchema, medicalWebPageSchema } from "@/lib/seo";
import { locale, localeTexto } from "@/lib/site-config";
import { respostas } from "@/lib/content";
import { waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { IndexList } from "@/components/ui/index-list";
import { Section } from "@/components/ui/section";
import { TrustBlock } from "@/components/ui/trust-block";
import { PhoneCTA, WhatsAppCTA } from "@/components/ui/cta";
import { FAQSection } from "@/components/sections/faq-section";
import { ApoioAutoria } from "@/components/sections/apoio-autoria";
import { ApoioCabeca } from "@/components/sections/apoio-cabeca";
import { ApoioDeclaracao } from "@/components/sections/apoio-declaracao";
import { ApoioDuas } from "@/components/sections/apoio-duas";
import { ApoioHero } from "@/components/sections/apoio-hero";
import { ApoioPassos } from "@/components/sections/apoio-passos";
import colunas from "@/components/sections/apoio-colunas.module.css";

const PATH = "/urgencia-odontologica";
const TITLE = `Urgência odontológica na ${locale.regiao} | Dra. Ana Beatriz`;
const DESCRIPTION = `Dor de dente, dente quebrado, gengiva inchada ou siso inflamado? Fale com a Dra. Ana pelo WhatsApp. ${localeTexto("bairroRegiao")}.`;

export const metadata: Metadata = buildMetadata({
  absoluteTitle: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Triagem em duas listas que nunca se sobrepõem. Texto a validar pela Dra. Ana antes de ir ao ar
 * como definitivo. Consultório: o que a Dra. Ana atende. Emergência: o que não espera resposta
 * de WhatsApp (192 ou pronto-socorro).
 */
const whenToSeek = [
  "Dor de dente intensa ou latejante",
  "Dente quebrado, trincado ou que saiu do lugar (batida na boca)",
  "Sangramento na gengiva que não para",
  "Abscesso (pus) na gengiva, sem dificuldade para respirar ou engolir",
  "Siso inflamado ou dolorido",
  "Sensibilidade intensa e súbita",
  "Restauração, faceta ou coroa que caiu ou quebrou",
];

const emergencySigns = [
  "Dificuldade para respirar ou engolir",
  "Inchaço que cresce rápido no rosto ou no pescoço",
  "Febre alta com inchaço",
  "Desmaio",
  "Trauma na cabeça",
];

const whatToDo = [
  "Respire fundo e tente manter a calma.",
  "Para inchaço, use compressa fria por fora do rosto (nunca calor).",
  "Evite alimentos muito quentes, gelados ou duros do lado afetado.",
  "Se um dente inteiro saiu, guarde-o em soro fisiológico ou leite e leve o quanto antes.",
  "Não coloque aspirina ou outros comprimidos diretamente sobre a gengiva.",
  "Analgésicos só conforme orientação: evite se automedicar.",
];

const steps = [
  {
    title: "Fale pelo WhatsApp",
    description: "Descreva o que você está sentindo e o que aconteceu, com calma, no seu tempo.",
  },
  {
    title: "Receba orientação",
    description: "A Dra. Ana orienta os primeiros cuidados para aliviar o desconforto até o atendimento.",
  },
  {
    title: "Horário combinado",
    description: "A Dra. Ana define um horário de atendimento, com prioridade para urgências.",
  },
  {
    title: "O atendimento",
    description: "Com foco em alívio e no cuidado com o conforto durante o atendimento, num ambiente acolhedor.",
  },
];

/** A mesma lista vai ao <FAQ> (via FAQSection) e ao JSON-LD; nenhuma pergunta repete a da home. */
const faqs = [
  {
    q: "A Dra. Ana atende urgência no mesmo dia?",
    a: "Conforme a agenda. Ao descrever o caso pelo WhatsApp, você recebe a orientação inicial, e a Dra. Ana informa o primeiro horário disponível.",
  },
  {
    q: "Dor de dente é sempre urgência?",
    a: "Nem sempre, mas dor não deve ser ignorada. Mesmo uma dor leve que vai e volta pode indicar algo que merece avaliação. Fale com a Dra. Ana para entender o momento certo para o atendimento.",
  },
  {
    q: "O que é caso de consultório e o que é caso de pronto-socorro?",
    a: "Dor de dente, dente quebrado, sangramento na gengiva, abscesso, siso inflamado ou restauração que caiu podem ser atendidos no consultório. Dificuldade para respirar ou engolir, inchaço que cresce rápido no rosto ou no pescoço, febre alta com inchaço, desmaio ou trauma na cabeça: ligue 192 (SAMU) ou vá a um pronto-socorro agora.",
  },
  {
    q: "O que fazer se um dente saiu inteiro?",
    a: "Guarde o dente em soro fisiológico ou leite e leve o quanto antes. Fale com a Dra. Ana pelo WhatsApp para receber orientação.",
  },
  {
    q: "Como funciona o valor de um atendimento de urgência?",
    a: "O atendimento é particular. O foco inicial é aliviar a dor e estabilizar a situação; depois, a Dra. Ana explica com transparência os próximos passos e o orçamento, sem compromisso de fechar tratamento na hora.",
  },
];

/**
 * /urgencia-odontologica (DESIGN.md 5.9): página de destino de anúncio, sem alarmismo. osso (aviso de
 * emergência, WhatsApp e telefone na abertura, acima da barra no celular) · papel (quando procurar,
 * com o pronto-socorro) · osso (o que fazer) · verde (como funciona) · noite (faixa de ação) ·
 * papel (dúvidas) · osso (autoria).
 */
export default function UrgenciaOdontologicaPage() {
  return (
    <>
      <JsonLd
        data={[
          medicalWebPageSchema({
            path: PATH,
            name: TITLE,
            description: `Orientação e atendimento de urgência odontológica com a Dra. Ana Beatriz, na ${localeTexto("bairroRegiaoCidade")}.`,
          }),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Urgência odontológica", path: PATH },
          ]),
        ]}
      />

      <ApoioHero
        ampla
        actionsRow
        kicker="Urgência odontológica"
        title="Está com dor ou um problema que não pode esperar?"
        lede="Fale com a Dra. Ana pelo WhatsApp. Você recebe orientação inicial, e ela combina o atendimento o quanto antes."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Urgência odontológica" }]}
        aviso={
          <p className="m-0">
            <strong>Emergência:</strong> dificuldade para respirar ou engolir, inchaço que cresce
            rápido no rosto ou no pescoço, febre alta com inchaço, desmaio ou trauma na cabeça. Nesses
            casos, ligue{" "}
            <a href="tel:192" className="link">
              192 (SAMU)
            </a>{" "}
            ou vá a um pronto-socorro agora.
          </p>
        }
        actions={
          <>
            <WhatsAppCTA location="urgency_hero" message={waMessages.urgency} />
            <PhoneCTA location="urgency_hero" label="Ligar" />
          </>
        }
        note={respostas.orientacaoWhatsapp}
        aside={<TrustBlock variant="bloco" />}
      />

      <Section tone="papel" id="quando-procurar" aria-labelledby="quando-procurar-titulo">
        <Container>
          <ApoioDuas
            esquerda={
              <ApoioCabeca
                id="quando-procurar-titulo"
                empilhar
                kicker="Sinais que pedem atenção"
                title="Quando procurar atendimento de urgência"
              >
                Alguns sinais pedem cuidado o quanto antes. Se você se identificar com qualquer um
                deles, fale com a Dra. Ana.
              </ApoioCabeca>
            }
            direita={<IndexList variant="fatos" items={whenToSeek.map((t) => ({ title: t }))} />}
          />
          <aside className={colunas.socorro} aria-labelledby="pronto-socorro-titulo">
            <h3 id="pronto-socorro-titulo" className="display">
              Quando ligar 192 ou ir a um pronto-socorro
            </h3>
            <p className="t-body">
              Estes sinais não esperam resposta de WhatsApp. Ligue{" "}
              <a href="tel:192" className="link">
                192 (SAMU)
              </a>{" "}
              ou vá a um pronto-socorro agora:
            </p>
            <IndexList variant="fatos" items={emergencySigns.map((t) => ({ title: t }))} />
          </aside>
        </Container>
      </Section>

      <Section tone="osso" id="enquanto-isso" aria-labelledby="enquanto-isso-titulo">
        <Container>
          <ApoioCabeca
            id="enquanto-isso-titulo"
            kicker="Primeiros cuidados"
            title="O que fazer enquanto você espera a resposta"
          >
            Estas orientações simples ajudam a reduzir o desconforto até o atendimento. Vá com calma.
          </ApoioCabeca>
          <div className="mt-12">
            <ApoioPassos modo="orientacoes" items={whatToDo.map((t) => ({ title: t }))} />
          </div>
        </Container>
      </Section>

      <Section tone="verde" id="como-funciona" aria-labelledby="como-funciona-titulo">
        <Container>
          <ApoioCabeca
            id="como-funciona-titulo"
            kicker="Passo a passo"
            title="Como funciona o atendimento de urgência"
          />
          <div className="mt-12">
            <ApoioPassos items={steps} />
          </div>
        </Container>
      </Section>

      <ApoioDeclaracao
        id="agora"
        tone="noite"
        hideFloating
        title="Está com dor agora? Não espere."
        actions={
          <>
            <WhatsAppCTA location="urgency_midpage" message={waMessages.urgency} variant="ouro" />
            <PhoneCTA location="urgency_midpage" variant="contorno-claro" />
          </>
        }
      >
        <p>
          Fale com a Dra. Ana pelo WhatsApp e receba orientação para aliviar o desconforto até o
          atendimento.
        </p>
      </ApoioDeclaracao>

      <FAQSection
        items={faqs}
        tone="papel"
        eyebrow="Dúvidas sobre urgência"
        title="Perguntas frequentes"
        whatsappMessage={waMessages.urgency}
      />

      <ApoioAutoria tone="osso" />
    </>
  );
}
