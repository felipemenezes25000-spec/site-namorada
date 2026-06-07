import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { LegalShell } from "@/components/sections/legal-shell";

export const metadata: Metadata = buildMetadata({
  title: "Termos de Uso",
  description:
    "Termos e condições de uso do site institucional da Dra. Ana Beatriz Lemos Souza.",
  path: "/termos-de-uso",
});

export default function TermosPage() {
  return (
    <>
      <PageHero
        eyebrow="Termos"
        title="Termos de Uso"
        description="Ao navegar neste site, você concorda com as condições descritas abaixo."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Termos de Uso" }]}
      />

      <section className="section-y bg-brand-bone">
        <div className="container">
          <LegalShell>
            <p className="text-sm text-brand-ink/50">Última atualização: [data].</p>

            <h2>1. Sobre este site</h2>
            <p>
              Este site é mantido por <strong>{siteConfig.doctorName}</strong>{" "}
              ({siteConfig.title}, {siteConfig.cro}) e tem caráter
              exclusivamente <strong>informativo</strong>. Seu objetivo é
              apresentar a profissional, os tratamentos oferecidos e facilitar o
              contato e o agendamento.
            </p>

            <h2>2. Conteúdo informativo, não substitui consulta</h2>
            <p>
              As informações aqui publicadas não constituem diagnóstico, prescrição
              ou recomendação de tratamento. Qualquer decisão clínica depende de uma
              avaliação individual e presencial. Não há promessa de resultados:
              cada caso é único e avaliado de forma personalizada.
            </p>

            <h2>3. Uso adequado</h2>
            <p>Ao utilizar este site, você concorda em:</p>
            <ul>
              <li>Fornecer informações verdadeiras nos formulários;</li>
              <li>Não utilizar o site para fins ilícitos ou que prejudiquem terceiros;</li>
              <li>Não tentar acessar áreas restritas sem autorização.</li>
            </ul>

            <h2>4. Propriedade intelectual</h2>
            <p>
              A marca, o logotipo, os textos e os elementos visuais deste site
              pertencem a {siteConfig.doctorName} e não podem ser reproduzidos sem
              autorização prévia.
            </p>

            <h2>5. Links e serviços de terceiros</h2>
            <p>
              O site pode conter links para serviços externos, como WhatsApp,
              Google Maps e Instagram. Não nos responsabilizamos pelo conteúdo ou
              pelas políticas desses serviços.
            </p>

            <h2>6. Agendamentos e contato</h2>
            <p>
              O envio do formulário ou o contato pelo WhatsApp representa uma
              <strong> solicitação</strong> de agendamento, que será confirmada
              diretamente pela equipe. O envio, por si só, não garante data e
              horário até a confirmação.
            </p>

            <h2>7. Comunicação ética em odontologia</h2>
            <p>
              Este site segue as normas de publicidade odontológica. Não utilizamos
              promessas de resultado, sensacionalismo ou imagens de pacientes sem o
              devido consentimento.
            </p>

            <h2>8. Alterações</h2>
            <p>
              Estes termos podem ser atualizados a qualquer momento. A versão
              vigente estará sempre disponível nesta página.
            </p>

            <h2>9. Contato</h2>
            <p>
              Dúvidas sobre estes termos podem ser enviadas para{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>

            <p className="mt-10 rounded-2xl border border-brand-ink/[0.07] bg-brand-beige/30 p-5 text-sm">
              <strong>Aviso:</strong> documento-modelo inicial. Recomenda-se revisão
              jurídica antes da publicação definitiva.
            </p>
          </LegalShell>
        </div>
      </section>
    </>
  );
}
