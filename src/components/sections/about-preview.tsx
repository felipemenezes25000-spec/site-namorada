import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { IndexList } from "@/components/ui/index-list";
import styles from "./editorial.module.css";

/**
 * "A doutora" (DESIGN.md 5.1, momento 3): retrato em arco com filete dourado e legenda
 * curta (sem número de figura), em enquadramento fechado no rosto (B-27: a capa já mostra o
 * retrato inteiro; aqui o mesmo arquivo aparece mais perto, com outro recorte), texto de apresentação e quatro fatos em lista com fios. Sem cartões, sem
 * sombra, sem chip sobre a foto. A citação da Dra. vive na declaração (DeclarationSection).
 * Servidor; só os fios dependem de JS.
 */
const FACTS = [
  "Avaliação completa e diagnóstico claro",
  "Plano de cuidado individualizado, feito com você",
  "Explicação de cada etapa antes de iniciar o tratamento",
  "Acompanhamento de perto, do início ao fim",
];

export function AboutPreview({ id = "a-doutora" }: { id?: string }) {
  return (
    <Section tone="osso" id={id} aria-labelledby={`${id}-titulo`} className={styles.secM}>
      <Container>
        <div className="grid12 items-center">
          <figure className={styles.aboutFig}>
            <div className={styles.arch}>
              <Image
                src="/dra-ana-trajetoria.jpg"
                alt={`${siteConfig.doctorName}, ${siteConfig.title.toLowerCase()}, sorrindo, de jaleco branco`}
                fill
                sizes="(min-width: 1100px) 460px, (min-width: 760px) 40vw, 90vw"
                className={styles.archImg}
              />
            </div>
            <figcaption className={styles.figCap}>
              <span className="t-cap">Atendimento particular</span>
            </figcaption>
          </figure>

          <div className={styles.aboutText}>
            <Eyebrow>Sobre a Dra. Ana</Eyebrow>
            <h2 id={`${id}-titulo`} className={`t-d3 ${styles.aboutTitle}`}>
              Uma odontologia que começa pela escuta e se constrói com confiança
            </h2>
            <p className="t-body">
              {siteConfig.doctorName} é {siteConfig.title.toLowerCase()} e acredita que cada
              sorriso carrega uma história. Seu trabalho une técnica e sensibilidade: avaliar com
              calma, explicar com clareza e planejar cada etapa junto com o paciente.
            </p>
            <p className={`t-body ${styles.aboutMore}`}>
              O foco está na odontologia preventiva, na saúde bucal, na função, na estética e
              no atendimento humanizado. A Dra. Ana também realiza cirurgias orais de pequeno e
              médio porte. Cada decisão é tomada com segurança e transparência sobre o que cada
              etapa pode oferecer, considerando riscos e benefícios e respeitando a autonomia do
              paciente.
            </p>

            <IndexList
              variant="fatos"
              className={styles.facts}
              items={FACTS.map((title) => ({ title }))}
            />

            <div className={styles.more}>
              <ButtonLink href="/sobre" variant="contorno">
                Conhecer a trajetória da Dra. Ana
                <ArrowIcon />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
