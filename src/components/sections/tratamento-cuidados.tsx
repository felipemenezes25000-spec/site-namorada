import type { ReactNode } from "react";
import Link from "next/link";
import { respostas } from "@/lib/content";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IndexList } from "@/components/ui/index-list";
import { ArrowIcon } from "@/components/ui/icons";
import { WhatsAppCTA } from "@/components/ui/cta";
import { TratamentoGrupo } from "./tratamento-grupo";
import styles from "./tratamento-cuidados.module.css";

/**
 * "O que considerar com cuidado" (DESIGN.md 5.4, momento 3): honestidade clínica. À esquerda o título
 * preso (sticky no desktop); à direita, na coluna 7, os grupos de definição (título em Hanken 500 +
 * lista com losango), só os que existem. `notFor` aparece aqui como frase de leitura, a menos que a
 * página já o tenha mostrado como declaração (linha "Limites" de `TratamentoDetalhes`). Sem cartões.
 * No celular todos os grupos recolhem (o conteúdo recolhido segue no HTML).
 */
export function TratamentoCuidados({
  tone = "papel",
  notFor,
  contraindications,
  preparation,
  aftercare,
  warningSigns,
  message,
}: {
  tone?: SectionTone;
  notFor?: string;
  contraindications?: string[];
  preparation?: string[];
  aftercare?: { title: string; description: string }[];
  warningSigns?: string[];
  message: string;
}) {
  const groups: { key: string; title: string; items: { title: ReactNode }[]; extra?: boolean }[] = [];
  if (contraindications?.length)
    groups.push({ key: "atencao", title: "Quando é preciso atenção", items: contraindications.map((c) => ({ title: c })) });
  if (preparation?.length)
    groups.push({ key: "antes", title: "Antes do procedimento", items: preparation.map((c) => ({ title: c })) });
  if (aftercare?.length)
    groups.push({
      key: "depois",
      title: "Depois do procedimento",
      items: aftercare.map((a) => ({
        title: (
          <>
            <span className={styles.strong}>{a.title}.</span> {a.description}
          </>
        ),
      })),
    });
  if (warningSigns?.length)
    groups.push({
      key: "sinais",
      title: "Quando procurar a Dra. Ana",
      items: warningSigns.map((c) => ({ title: c })),
      extra: true,
    });

  return (
    <Section tone={tone} id="cuidados" aria-labelledby="cuidados-titulo" className={styles.sec}>
      <Container>
        <div className="grid12">
          <div className={styles.head}>
            <Eyebrow>Antes de decidir</Eyebrow>
            <h2 id="cuidados-titulo" className="t-d2">
              O que considerar com cuidado
            </h2>
            {notFor && <p className={`t-lead ${styles.notFor}`}>{notFor}</p>}
          </div>

          {groups.length > 0 && (
            <div className={styles.groups}>
              {groups.map((g) => (
                <TratamentoGrupo key={g.key} id={`cuidados-${g.key}`} title={g.title} abertoNoCelular={false}>
                  {g.extra && (
                    <p className={`t-body ${styles.alerta}`}>
                      Se aparecer algum destes sinais, fale com a Dra. Ana sem demora.
                    </p>
                  )}
                  <IndexList variant="fatos" items={g.items} />
                  {g.extra && (
                    <div className={styles.note}>
                      <p className={styles.noteTxt}>{respostas.orientacaoWhatsapp}</p>
                      <div className={styles.noteActions}>
                        <WhatsAppCTA
                          location="treatment_warning"
                          message={message}
                          label="Tirar dúvidas no WhatsApp"
                          variant="texto"
                        />
                        <Link href="/urgencia-odontologica" className={`link ${styles.urgencia}`}>
                          Ver orientações de urgência
                          <ArrowIcon size={18} />
                        </Link>
                      </div>
                    </div>
                  )}
                </TratamentoGrupo>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
