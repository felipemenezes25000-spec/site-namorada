import { MessageCircle } from "lucide-react";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { FAQAccordion } from "./faq-accordion";

export function FAQSection({
  items,
  eyebrow = "Dúvidas frequentes",
  title = "Perguntas que ouvimos com frequência",
  description = "Não achou a sua dúvida aqui? Manda no WhatsApp que a gente responde.",
  whatsappMessage = waMessages.questions,
}: {
  items: { q: string; a: string }[];
  eyebrow?: string;
  title?: string;
  description?: string;
  whatsappMessage?: string;
}) {
  return (
    <section id="faq" className="section-y bg-brand-bone">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow={eyebrow}
              title={title}
              description={description}
            />
            <Reveal delay={0.1}>
              <div className="mt-8 hidden lg:block">
                <ButtonLink href={whatsappLink(whatsappMessage)} external variant="secondary" size="md">
                  <MessageCircle className="size-4" strokeWidth={1.7} />
                  Tirar dúvidas no WhatsApp
                </ButtonLink>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <FAQAccordion items={items} />
            <div className="mt-6 lg:hidden">
              <ButtonLink href={whatsappLink(whatsappMessage)} external variant="secondary" size="md" className="w-full">
                <MessageCircle className="size-4" strokeWidth={1.7} />
                Tirar dúvidas no WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
