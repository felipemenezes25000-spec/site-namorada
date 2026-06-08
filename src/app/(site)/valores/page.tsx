import type { Metadata } from "next";
import {
  Check,
  MessageCircle,
  CalendarDays,
  ShieldCheck,
  CreditCard,
  Heart,
  Clock,
  FileText,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { Reveal } from "@/components/ui/reveal";

const PATH = "/valores";

export const metadata: Metadata = buildMetadata({
  title:
    "Como funcionam os valores — Dra. Ana Beatriz Lemos Souza",
  description:
    "Entenda como funciona o investimento no atendimento odontológico com a Dra. Ana Beatriz: atendimento particular, orçamento transparente após avaliação, sem pressão e com formas de pagamento flexíveis.",
  path: PATH,
  keywords: [
    "quanto custa dentista particular São Paulo",
    "valores dentista Bela Vista",
    "preço consulta odontológica São Paulo",
    "formas de pagamento dentista",
  ],
});

const principles = [
  {
    icon: Heart,
    title: "Atendimento exclusivamente particular",
    description:
      "Não trabalhamos com convênios ou planos de saúde. Isso permite dedicar o tempo necessário a cada consulta, sem limitações de tabela ou de procedimentos cobertos.",
  },
  {
    icon: FileText,
    title: "Orçamento só após avaliação clínica",
    description:
      "Cada caso é único. Não é possível passar valores antes de examinar, porque o diagnóstico define o que de fato precisa ser feito. Após a avaliação, você recebe o plano completo com etapas e investimento.",
  },
  {
    icon: Clock,
    title: "Sem pressão para fechar na hora",
    description:
      "Você recebe o plano, leva para casa se quiser, pensa com calma e decide no seu tempo. Não existe venda na consulta.",
  },
  {
    icon: CreditCard,
    title: "Pix, débito e crédito",
    description:
      "O pagamento pode ser feito por Pix, cartão de débito ou cartão de crédito. No crédito, o parcelamento segue as condições da operadora do seu cartão.",
  },
  {
    icon: ShieldCheck,
    title: "Transparência em cada etapa",
    description:
      "Antes de qualquer procedimento, você sabe o que será feito, por que está sendo indicado e quanto custa. Sem surpresas no final.",
  },
];

const whyParticular = [
  "Consultas de 40 a 60 minutos, com atenção exclusiva",
  "Sem limite de tempo imposto por convênio",
  "Materiais e técnicas escolhidos pelo que é melhor para cada caso",
  "Planejamento individual, não padronizado por tabela",
  "Acompanhamento próximo durante e após o tratamento",
  "Comunicação direta com a Dra. Ana pelo WhatsApp",
];

const faqs = [
  {
    q: "Por que a Dra. Ana não atende convênio?",
    a: "Para garantir consultas com tempo adequado, materiais de qualidade e planejamento individual. O convênio limita tempo, procedimentos e valores, o que pode comprometer o cuidado.",
  },
  {
    q: "Posso parcelar o tratamento?",
    a: "O pagamento pode ser feito via Pix, débito ou crédito. No cartão de crédito, o parcelamento segue as condições da operadora do seu cartão.",
  },
  {
    q: "Por que não passam orçamento por telefone ou WhatsApp?",
    a: "Porque cada caso depende de exame clínico. Dar valores sem avaliar seria irresponsável e poderia gerar expectativas incorretas. O orçamento é apresentado após a avaliação, de forma transparente.",
  },
  {
    q: "A avaliação tem custo?",
    a: "Sim. A avaliação é uma consulta completa, com exame clínico, diagnóstico e plano de cuidado. O valor é informado de forma transparente no momento do agendamento.",
  },
  {
    q: "Preciso pagar tudo de uma vez?",
    a: "O plano de tratamento pode ser dividido em etapas, com pagamentos conforme as consultas realizadas. Isso é definido de forma prática na avaliação.",
  },
];

export default function ValoresPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Como funcionam os valores", path: PATH },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Investimento"
        title="Como funcionam os valores"
        description="Transparência é a base de qualquer relação de confiança. Entenda como funciona o investimento no seu cuidado odontológico com a Dra. Ana Beatriz."
        breadcrumbs={[
          { name: "Início", href: "/" },
          { name: "Como funcionam os valores" },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <TrackedButtonLink
            href="/agendamento"
            variant="primary"
            size="md"
            event="scheduling_intent"
            eventParams={{ location: "valores_hero" }}
          >
            <CalendarDays className="size-4" strokeWidth={1.7} />
            Agendar avaliação
          </TrackedButtonLink>
          <TrackedButtonLink
            href={whatsappLink(waMessages.questions)}
            external
            variant="whatsapp"
            size="md"
            event="whatsapp_click"
            eventParams={{ location: "valores_hero" }}
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            Tirar dúvidas no WhatsApp
          </TrackedButtonLink>
        </div>
      </PageHero>

      {/* Princípios de precificação */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" />{" "}
                Transparência
              </p>
              <h2 className="mt-4 text-display-sm">
                O que você precisa saber antes de agendar
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Não publicamos tabelas de preço porque cada caso depende de
                avaliação clínica. Mas acreditamos que você merece clareza sobre
                como funciona.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div className="surface h-full p-7">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-green/[0.07] text-brand-green">
                      <Icon className="size-6" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-xl text-brand-green">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                      {p.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Por que atendimento particular */}
      <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
        <div className="container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" />{" "}
                Por que particular
              </p>
              <h2 className="mt-4 text-display-sm">
                O que o atendimento particular garante para você
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Não atender convênio não é falta de opção — é uma escolha para
                oferecer o melhor cuidado possível.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {whyParticular.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-brand-ink/[0.07] bg-white p-4 shadow-sm"
                  >
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-brand-green"
                      strokeWidth={2}
                    />
                    <span className="text-sm leading-relaxed text-brand-ink/75">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Resumo de formas de pagamento */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="surface relative overflow-hidden p-8 sm:p-12">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-brand-gold/10 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <Reveal>
                <p className="eyebrow flex items-center gap-3">
                  <span className="inline-block h-px w-7 bg-brand-gold/70" />{" "}
                  Resumo
                </p>
                <h2 className="mt-4 text-display-sm">
                  Na prática, funciona assim
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <ol className="mt-6 space-y-4 text-brand-ink/75">
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 font-display text-sm text-brand-gold-ink">
                      1
                    </span>
                    <span className="text-sm leading-relaxed">
                      Você agenda a avaliação pelo WhatsApp ou formulário.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 font-display text-sm text-brand-gold-ink">
                      2
                    </span>
                    <span className="text-sm leading-relaxed">
                      Na consulta, a Dra. Ana faz o exame clínico, explica o
                      diagnóstico e monta o plano de cuidado.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 font-display text-sm text-brand-gold-ink">
                      3
                    </span>
                    <span className="text-sm leading-relaxed">
                      Você recebe o plano com etapas, prioridades e investimento
                      — e decide no seu tempo.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 font-display text-sm text-brand-gold-ink">
                      4
                    </span>
                    <span className="text-sm leading-relaxed">
                      Pagamento via Pix, débito ou crédito, conforme as
                      consultas realizadas.
                    </span>
                  </li>
                </ol>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Dúvidas sobre valores"
        title="Perguntas frequentes"
        whatsappMessage={waMessages.questions}
      />

      <CTASection />
    </>
  );
}
