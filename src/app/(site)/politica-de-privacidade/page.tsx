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
            <p className="text-sm text-brand-ink/50">Última atualização: 8 de junho de 2026.</p>

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
            <p>O tratamento dos seus dados se baseia em diferentes fundamentos da LGPD, conforme a finalidade:</p>
            <ul>
              <li><strong>Consentimento</strong> (art. 7º, I): para o envio do formulário, o uso de cookies de medição e a comunicação por mensagens;</li>
              <li><strong>Execução de procedimentos preliminares e do atendimento solicitado por você</strong> (art. 7º, V): para entrar em contato e dar continuidade ao agendamento;</li>
              <li><strong>Tutela da saúde, por profissional de saúde</strong> (art. 11, II, “f”): para informações estritamente necessárias ao atendimento, sempre sob sigilo profissional;</li>
              <li><strong>Cumprimento de obrigação legal ou regulatória</strong> (art. 7º, II): para a guarda de prontuário e documentos exigidos na área odontológica.</li>
            </ul>
            <p>
              Você pode revogar o consentimento a qualquer momento, sem que isso
              afete a licitude do tratamento já realizado.
            </p>

            <h2>5. Compartilhamento</h2>
            <p>
              Não vendemos os seus dados. Utilizamos provedores de tecnologia
              estritamente para operar o atendimento e o site, sempre com
              obrigação de confidencialidade:
            </p>
            <ul>
              <li><strong>Vercel</strong> — hospedagem e entrega do site;</li>
              <li><strong>Supabase</strong> — armazenamento seguro dos dados enviados no formulário de agendamento;</li>
              <li><strong>WhatsApp (Meta Platforms)</strong> — canal de mensagens para contato e agendamento;</li>
              <li><strong>Google</strong> — Google Maps (mapa do consultório) e Google Analytics (medição de uso, de forma anônima e mediante o seu consentimento);</li>
              <li><strong>Meta</strong> — Meta Pixel (mensuração de campanhas, mediante o seu consentimento).</li>
            </ul>
            <p>
              <strong>Transferência internacional:</strong> algumas dessas
              ferramentas (como Google e Meta) podem processar dados em servidores
              fora do Brasil. Esse tratamento ocorre apenas mediante o seu
              consentimento e segue as salvaguardas previstas na LGPD (art. 33).
              Você pode revogar o consentimento a qualquer momento em
              <strong> Gerenciar cookies</strong>, no rodapé do site.
            </p>
            <p>
              Cada um desses provedores trata os dados conforme as suas próprias
              políticas de privacidade. Recomendamos consultar os avisos do Google,
              da Meta e dos demais serviços para detalhes sobre como operam.
            </p>

            <h2>6. Cookies e ferramentas de análise</h2>
            <p>
              Cookies essenciais ao funcionamento do site são sempre ativos.
              Cookies de medição (Google Analytics) e de campanha (Meta Pixel) só
              são carregados <strong>após o seu consentimento</strong> no banner de
              cookies. Você pode revisar ou revogar essa escolha a qualquer momento
              clicando em <strong>Gerenciar cookies</strong>, no rodapé de todas as
              páginas. Também é possível bloquear cookies nas configurações do seu
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
            <p>
              Não tomamos decisões automatizadas que produzam efeitos jurídicos
              sobre você ou que afetem seus interesses de forma significativa. Os
              dados de navegação são usados apenas de forma agregada e anônima para
              melhorar o site.
            </p>
            <p>
              Se entender que seus direitos não foram atendidos, você pode
              apresentar reclamação à <strong>Autoridade Nacional de Proteção de
              Dados (ANPD)</strong> pelos canais oficiais disponíveis em{" "}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">gov.br/anpd</a>.
            </p>

            <h2>8. Dados de crianças e adolescentes</h2>
            <p>
              O atendimento de menores de 18 anos ocorre sempre com a presença e o
              consentimento de ao menos um dos pais ou do responsável legal, no
              melhor interesse da criança ou do adolescente, conforme o art. 14 da
              LGPD. Não coletamos intencionalmente dados de menores por este site
              sem essa autorização.
            </p>

            <h2>9. Segurança e retenção</h2>
            <p>
              Adotamos medidas razoáveis para proteger os seus dados contra acesso
              não autorizado. Os dados de contato enviados pelo formulário são
              mantidos enquanto durar o relacionamento de atendimento. Documentos e
              registros clínicos, quando existirem, são guardados pelo prazo mínimo
              exigido para prontuários na área da saúde (em regra, 20 anos a contar
              do último registro, conforme as normas aplicáveis). Encerradas as
              finalidades e os prazos legais, os dados são eliminados ou
              anonimizados. Você pode solicitar a exclusão dos dados de contato a
              qualquer momento.
            </p>

            <h2>10. Alterações</h2>
            <p>
              Esta política pode ser atualizada para refletir melhorias ou
              mudanças legais. A versão vigente estará sempre disponível nesta
              página, com a data de atualização.
            </p>

            <p className="mt-10 rounded-2xl border border-brand-ink/[0.07] bg-brand-beige/30 p-5 text-sm">
              <strong>Encarregado pelo tratamento de dados (DPO):</strong> as
              funções de encarregado são exercidas pelo próprio controlador. Para
              qualquer solicitação relativa aos seus dados pessoais, utilize o
              e-mail <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>,
              canal oficial de privacidade. Respondemos no menor prazo possível,
              observados os limites da LGPD.
            </p>
          </LegalShell>
        </div>
      </section>
    </>
  );
}
