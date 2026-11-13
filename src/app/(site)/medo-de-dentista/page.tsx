import type { Metadata } from "next";
import { localeTexto } from "@/lib/site-config";
import {
  breadcrumbSchema,
  buildMetadata,
  exclusiveFaqs,
  faqSchema,
  medicalWebPageSchema,
} from "@/lib/seo";
import { respostas } from "@/lib/content";
import { buttonClasses } from "@/components/ui/button";
import { waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { IndexList } from "@/components/ui/index-list";
import { Section } from "@/components/ui/section";
import { TrackedLink } from "@/components/ui/tracked-link";
import { WhatsAppCTA } from "@/components/ui/cta";
import { BreathingGuide } from "@/components/sections/breathing-guide";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { ApoioAneis } from "@/components/sections/apoio-aneis";
import { ApoioCabeca } from "@/components/sections/apoio-cabeca";
import { ApoioDeclaracao } from "@/components/sections/apoio-declaracao";
import { ApoioDuas } from "@/components/sections/apoio-duas";
import { ApoioHero } from "@/components/sections/apoio-hero";
import { ApoioSentimentos } from "@/components/sections/apoio-sentimentos";
import { ApoioAutoria } from "@/components/sections/apoio-autoria";

const PATH = "/medo-de-dentista";
const TITLE = "Medo de dentista? Atendimento acolhedor | Dra. Ana Beatriz";

export const metadata: Metadata = buildMetadata({
  absoluteTitle: TITLE,
  description: `Medo de ir ao dentista? Na ${localeTexto("bairroRegiao")}, a Dra. Ana começa pela conversa e segue no seu ritmo, com pausas combinadas com você.`,
  path: PATH,
});

const feelings = [
  {
    title: "Medo da dor durante o atendimento",
    text: "É um receio comum. Aqui, o atendimento é feito com atenção ao conforto em cada etapa, e você pode avisar quando quiser uma pausa.",
  },
  {
    title: "Vergonha do estado atual dos dentes",
    text: "Não existe julgamento. O ponto de partida é sempre onde você está hoje, com acolhimento.",
  },
  {
    title: "Experiências ruins no passado",
    text: "Uma vivência difícil deixa marcas. Aqui, a proposta é construir uma nova relação, com calma.",
  },
  {
    title: "Ansiedade com barulhos, agulhas ou o ambiente",
    text: "Tudo é explicado antes, no seu tempo, para que nada chegue de surpresa.",
  },
  {
    title: "Vergonha de ter demorado a voltar",
    text: "Retomar os cuidados é sempre bem-vindo. O foco é ajudar, não cobrar pelo tempo que passou.",
  },
];

const care = [
  {
    title: "Escuta sem pressa",
    description:
      "Antes de qualquer procedimento, a conversa. A primeira consulta pode ser apenas uma conversa e avaliação.",
  },
  {
    title: "Cada passo explicado",
    description:
      "Tudo é dito em linguagem simples, antes de começar, para você ter clareza e controle.",
  },
  {
    title: "Anestesia e pausas combinadas com você",
    description:
      "Você pode pedir uma pausa ou combinar um sinal a qualquer momento. A anestesia é aplicada com cuidado para o seu conforto.",
  },
  {
    title: "Ritmo respeitado",
    description:
      "Nada é feito com pressa e você não precisa resolver tudo no mesmo dia. O ambiente é calmo e acolhedor, do primeiro contato ao retorno.",
  },
];

/** A mesma lista vai ao <FAQ> (via FAQSection) e ao JSON-LD; nenhuma pergunta repete a da home. */
const faqs = [
  {
    q: "E se eu sentir vergonha do estado dos meus dentes?",
    a: "Ninguém vai julgar você. A função da consulta é justamente acolher e ajudar, partindo de onde você está hoje. Muita gente chega exatamente assim e dá o primeiro passo com tranquilidade.",
  },
  {
    q: "Posso pedir para parar se a ansiedade aparecer?",
    a: "Pode, sim, a qualquer momento. O atendimento respeita o seu ritmo e o seu conforto. Combinar sinais e pausas faz parte de um cuidado humanizado.",
  },
  {
    q: "Faz muito tempo que não vou ao dentista. Tem problema?",
    a: "Nenhum. Retomar os cuidados é sempre possível, e a avaliação serve para organizar prioridades com calma, sem cobrança.",
  },
  {
    q: "A primeira consulta já envolve procedimento?",
    a: "Não necessariamente. A primeira consulta pode ser apenas uma conversa e avaliação. Nada é feito sem a sua autorização e sem que você esteja confortável.",
  },
  {
    q: "Posso conversar antes de decidir marcar?",
    a: `Sim. Você pode falar pelo WhatsApp para tirar dúvidas, contar o que sente e entender como funciona antes de agendar. Sem compromisso. ${respostas.orientacaoWhatsapp}`,
  },
  {
    q: "Vou saber o que vai acontecer antes de cada etapa?",
    a: "Sim. Cada etapa é explicada antes de começar, em linguagem simples, para que você tenha clareza e controle sobre o que acontece.",
  },
];

const pageSchema = medicalWebPageSchema({
  path: PATH,
  name: TITLE,
  description: `Atendimento acolhedor para quem tem medo ou ansiedade de ir ao dentista, com a Dra. Ana Beatriz, na ${localeTexto("bairroRegiao")}.`,
});

/**
 * /medo-de-dentista (DESIGN.md 5.10): osso (abertura com os anéis do guia) · papel (sentimentos) ·
 * noite #respirar (guia de respiração) · papel (como tornamos mais leve) · osso (o primeiro passo
 * é só uma conversa) · papel (dúvidas) · osso (fecho com waMessages.fear).
 */
export default function MedoDeDentistaPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema,
          faqSchema(exclusiveFaqs(faqs)),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Medo de dentista", path: PATH },
          ]),
        ]}
      />

      <ApoioHero
        kicker="Acolhimento"
        title={
          <>
            <span className="block">Sente medo de ir ao dentista?</span>{" "}
            <span className="block">Você não está só.</span>
          </>
        }
        lede="O medo do dentista é mais comum do que parece, e não é motivo de vergonha. Aqui, o atendimento começa pela escuta e segue no seu ritmo, com explicação clara e foco no seu conforto a cada etapa."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Medo de dentista" }]}
        actions={
          <>
            <WhatsAppCTA location="fear_hero" message={waMessages.fear} />
            <TrackedLink
              href="#respirar"
              event="cta_click"
              eventParams={{ location: "fear_hero", target: "breathing_guide" }}
              className={buttonClasses("contorno", "md")}
            >
              Ir ao guia de respiração
            </TrackedLink>
          </>
        }
        mobileMark={<ApoioAneis mini />}
        aside={<ApoioAneis />}
      />

      <Section tone="papel" id="sentimentos" aria-labelledby="sentimentos-titulo">
        <Container>
          <ApoioCabeca
            id="sentimentos-titulo"
            kicker="Você não está só"
            title="Você reconhece algum destes sentimentos?"
          >
            Se algo aqui soa familiar, saiba que é absolutamente compreensível, e que existe um
            caminho mais leve para cuidar da sua saúde bucal.
          </ApoioCabeca>
          <div className="mt-12">
            <ApoioSentimentos items={feelings} fecho="Você pode começar por uma conversa." />
          </div>
        </Container>
      </Section>

      <Section tone="noite" id="respirar" aria-labelledby="respirar-titulo">
        <BreathingGuide />
      </Section>

      <Section tone="papel" id="mais-leve" aria-labelledby="mais-leve-titulo">
        <Container>
          <ApoioDuas
            esquerda={
              <ApoioCabeca
                id="mais-leve-titulo"
                empilhar
                kicker="Cuidado humanizado"
                title="Como tornamos a experiência mais leve"
              >
                Cada detalhe do atendimento é pensado para devolver a você a sensação de confiança e
                controle. O cuidado é construído junto, no seu tempo.
              </ApoioCabeca>
            }
            direita={<IndexList variant="passos" items={care} />}
          />
        </Container>
      </Section>

      <ApoioDeclaracao
        id="primeiro-passo"
        tone="osso"
        size="d3"
        kicker="Sem pressão"
        title="O primeiro passo é só uma conversa"
        actions={
          <>
            <WhatsAppCTA location="fear_page" message={waMessages.fear} />
            <TrackedLink
              href="/primeira-consulta"
              event="cta_click"
              eventParams={{ location: "fear_page", target: "primeira_consulta" }}
              className={buttonClasses("texto", "md")}
            >
              Como é a primeira consulta
              <ArrowIcon />
            </TrackedLink>
          </>
        }
      >
        <p>
          A primeira consulta é, antes de tudo, uma conversa. Você não precisa chegar sabendo o que
          precisa, nem decidir nada na hora, e não há pressão para fechar tratamento.
        </p>
        <p>
          É um momento para a Dra. Ana entender a sua história, esclarecer dúvidas e, juntos, pensar
          nos próximos passos com calma.
        </p>
      </ApoioDeclaracao>

      <FAQSection
        items={faqs}
        tone="papel"
        eyebrow="Dúvidas sobre o atendimento"
        title="Perguntas frequentes"
        whatsappMessage={waMessages.fear}
      />

      <CTASection tone="osso" message={waMessages.fear} />

      <ApoioAutoria tone="papel" />
    </>
  );
}
