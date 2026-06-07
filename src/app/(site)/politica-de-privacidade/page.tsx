import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { LegalShell } from "@/components/sections/legal-shell";

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidade",
  description:
    "Como a Dra. Ana Beatriz Lemos Souza coleta, utiliza e protege os seus dados pessoais, conforme a Lei Geral de Proteção de Dados (LGPD).",
  path: "/politica-de-privacidade",
});

export default function PrivacidadePage() {
  return (
    <>
      <PageHero
        eyebrow="Privacidade"
        title="Política de Privacidade"
        description="Esta política explica como tratamos os seus dados pessoais com transparência e segurança, em conformidade com a LGPD (Lei nº 13.709/2018)."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Política de Privacidade" }]}
      />

      <section className="section-y bg-brand-bone">
        <div className="container">
          <LegalShell>
            <p className="text-sm text-brand-ink/50">Última atualização: [data].</p>

            <h2>1. Quem é o responsável pelos seus dados</h2>
            <p>
              O responsável pelo tratamento dos dados (controlador) é{" "}
              <strong>{siteConfig.doctorName}</strong> ({siteConfig.title}, {siteConfig.cro}),
              com atendimento em {siteConfig.address.full}. Para qualquer questão
              relacionada à privacidade, entre em contato pelo e-mail{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>

            <h2>2. Quais dados coletamos</h2>
            <p>Coletamos apenas os dados necessários para o atendimento e o contato:</p>
            <ul>
              <li><strong>Dados fornecidos por você</strong> no formulário de agendamento: nome, WhatsApp, e-mail (opcional), tratamento de interesse, melhor dia e período, queixa principal e como nos conheceu.</li>
              <li><strong>Dados de navegação</strong>, quando habilitados: informações anônimas de uso do site (páginas visitadas, cliques) por meio de ferramentas de análise.</li>
            </ul>
            <p>
              Não solicitamos, por este site, dados sensíveis de saúde detalhados.
              Informações clínicas são tratadas exclusivamente no ambiente do
              consultório, sob sigilo profissional.
            </p>

            <h2>3. Para que usamos os seus dados</h2>
            <ul>
              <li>Entrar em contato e agendar a sua avaliação;</li>
              <li>Confirmar consultas e enviar lembretes;</li>
              <li>Responder dúvidas e dar continuidade ao atendimento;</li>
              <li>Melhorar a experiência e o conteúdo do site (dados anônimos).</li>
            </ul>

            <h2>4. Base legal</h2>
            <p>
              O tratamento dos seus dados se baseia no seu <strong>consentimento</strong>
              {" "}(art. 7º, I, da LGPD), manifestado ao marcar a caixa de autorização
              no formulário, e, quando aplicável, no legítimo interesse para a
              prestação do atendimento solicitado.
            </p>

            <h2>5. Compartilhamento</h2>
            <p>
              Não vendemos os seus dados. Podemos utilizar provedores de
              tecnologia (por exemplo, hospedagem, banco de dados e mensageria de
              WhatsApp) estritamente para operar o atendimento, sempre com
              obrigação de confidencialidade. [Liste aqui os provedores utilizados,
              ex.: Vercel, Supabase, provedor de WhatsApp.]
            </p>

            <h2>6. Cookies e ferramentas de análise</h2>
            <p>
              Este site pode utilizar cookies e ferramentas como Google Analytics e
              Meta Pixel para entender o uso das páginas e mensurar campanhas, de
              forma agregada. Você pode gerenciar cookies nas configurações do seu
              navegador.
            </p>

            <h2>7. Seus direitos como titular</h2>
            <p>Conforme a LGPD, você pode, a qualquer momento:</p>
            <ul>
              <li>Confirmar a existência de tratamento dos seus dados;</li>
              <li>Acessar, corrigir ou atualizar seus dados;</li>
              <li>Solicitar a anonimização ou a exclusão dos dados desnecessários;</li>
              <li>Revogar o consentimento;</li>
              <li>Solicitar a portabilidade, nos termos da lei.</li>
            </ul>
            <p>
              Para exercer esses direitos, escreva para{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>

            <h2>8. Segurança e retenção</h2>
            <p>
              Adotamos medidas razoáveis para proteger os seus dados contra acesso
              não autorizado. Mantemos as informações apenas pelo tempo necessário
              às finalidades descritas ou conforme exigências legais aplicáveis à
              área da saúde.
            </p>

            <h2>9. Alterações</h2>
            <p>
              Esta política pode ser atualizada para refletir melhorias ou
              mudanças legais. A versão vigente estará sempre disponível nesta
              página, com a data de atualização.
            </p>

            <p className="mt-10 rounded-2xl border border-brand-ink/[0.07] bg-brand-beige/30 p-5 text-sm">
              <strong>Aviso:</strong> este documento é um modelo inicial e deve ser
              revisado por um(a) profissional jurídico(a) e adequado à realidade do
              consultório antes da publicação definitiva.
            </p>
          </LegalShell>
        </div>
      </section>
    </>
  );
}
