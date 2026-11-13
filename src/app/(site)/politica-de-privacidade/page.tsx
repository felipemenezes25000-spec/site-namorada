import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PRIVACY_POLICY_VERSION, formatDatePtBR } from "@/lib/content";
import { PageHero } from "@/components/sections/page-hero";
import {
  LegalHeading,
  LegalLinkLine,
  LegalShell,
  type LegalSection,
} from "@/components/sections/legal-shell";

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidade | Dra. Ana Beatriz",
  description:
    "Quais dados este site recebe, para que servem, com quem passam e como você exerce seus direitos pela LGPD. Texto da Dra. Ana Beatriz Lemos Souza.",
  path: "/politica-de-privacidade",
});

const SECOES: LegalSection[] = [
  { id: "responsavel", title: "Quem cuida dos seus dados" },
  { id: "dados", title: "Quais dados o site recebe" },
  { id: "finalidades", title: "Para que usamos" },
  { id: "base-legal", title: "Por que podemos usar" },
  { id: "quem-recebe", title: "Quem mais recebe os dados" },
  { id: "cookies", title: "Cookies e medição" },
  { id: "direitos", title: "Seus direitos" },
  { id: "criancas", title: "Crianças e adolescentes" },
  { id: "seguranca", title: "Segurança e guarda" },
  { id: "alteracoes", title: "Mudanças nesta política" },
];

const MAIL = `mailto:${siteConfig.email}`;

export default function PrivacidadePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Política de Privacidade", path: "/politica-de-privacidade" },
        ])}
      />
      <PageHero
        kicker="LGPD · Lei nº 13.709/2018"
        title="Política de Privacidade"
        lede={<span className="t-folio">Atualizado em {formatDatePtBR(PRIVACY_POLICY_VERSION)}</span>}
        visual="none"
        className="pb-10 tab:pb-12 desk:pb-14"
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Política de Privacidade" }]}
      />

      <LegalShell
        sections={SECOES}
        notes={
          <>
            <p>
              <strong>Em resumo.</strong> Pedimos só o que é preciso para entrar em contato com você.
              As ferramentas de medição só guardam cookies se você aceitar.
            </p>
            <p>Para pedir acesso, correção ou exclusão dos seus dados, escreva para:</p>
            <LegalLinkLine>
              <a href={MAIL}>{siteConfig.email}</a>
            </LegalLinkLine>
          </>
        }
      >
        <p>
          Este texto explica, em linguagem direta, o que acontece com os seus dados quando você usa este
          site, conforme a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018). Ele descreve o que
          o site faz hoje. Se algo mudar, a data acima muda junto.
        </p>

        <LegalHeading id="responsavel" sections={SECOES} />
        <p>
          Quem decide como os dados são tratados (a controladora) é <strong>{siteConfig.doctorName}</strong>{" "}
          ({siteConfig.title}, {siteConfig.cro}), com atendimento em {siteConfig.address.full}.
        </p>
        <p>
          Para qualquer assunto sobre privacidade, este é o nosso canal de contato para pedidos sobre
          dados pessoais:
        </p>
        <LegalLinkLine>
          <a href={MAIL}>{siteConfig.email}</a>
        </LegalLinkLine>

        <LegalHeading id="dados" sections={SECOES} />

        <h3>Quando você envia o formulário de agendamento</h3>
        <ul>
          <li>nome completo e WhatsApp, que são obrigatórios;</li>
          <li>e-mail, se você quiser informar;</li>
          <li>tratamento de interesse, período preferido e melhor dia;</li>
          <li>se você tem exame radiográfico (sim ou não). O site não recebe a imagem do exame;</li>
          <li>queixa principal ou observação, se você quiser escrever;</li>
          <li>como você conheceu o consultório, se você quiser informar;</li>
          <li>o seu aceite desta política, com data, hora e a versão do texto que você aceitou.</li>
        </ul>
        <p>
          <strong>Dados de saúde.</strong> A queixa e a informação sobre radiografia podem revelar dados
          sobre a sua saúde. A LGPD chama isso de dado sensível. Por isso o campo da queixa é opcional,
          e tratamos essas informações com base no seu consentimento, que você dá ao marcar a caixa do
          formulário. Escreva só o que quiser compartilhar. O restante você conta na consulta.
        </p>
        <p>
          O formulário também tem um campo escondido, que pessoas não veem, para barrar robôs. Se um robô
          o preencher, o envio é descartado.
        </p>

        <h3>Quando você escreve pelo WhatsApp</h3>
        <p>
          O que você digitar na conversa fica no WhatsApp (Meta) e no aparelho do consultório, fora
          deste site. A mensagem pode conter dado de saúde, se você descrever a sua queixa. Escreva só o
          que quiser compartilhar; o restante você conta na consulta.
        </p>

        <h3>De qual anúncio ou campanha você veio</h3>
        <p>
          Se você chegar por um anúncio, o endereço pode trazer códigos de campanha, que dizem de qual
          anúncio você veio. O site guarda esses códigos, a página em que você entrou e o site de origem
          na memória temporária da aba do navegador, e eles somem quando você fecha a aba. Se você
          aceitar os cookies, uma cópia fica guardada no navegador por até 90 dias; ao recusar ou mudar
          de ideia em Gerenciar cookies, essa cópia é apagada. Só são enviados junto com o formulário,
          se você o enviar. Servem para saber qual anúncio trouxe o contato.
        </p>

        <h3>Medição de uso do site</h3>
        <p>
          O site registra cliques em botões importantes (WhatsApp, telefone, e-mail, mapa, Instagram e
          agendamento) e o início e o envio do formulário. Cada registro leva apenas:
        </p>
        <ul>
          <li>em qual página e em qual botão a ação aconteceu;</li>
          <li>o tratamento ou a situação que você escolheu na página, quando houver.</li>
        </ul>
        <p>
          Não levam nome, telefone, e-mail nem texto digitado por você. Veja a{" "}
          <a href="#cookies">seção 6 (Cookies e medição)</a> para saber quando isso é guardado.
        </p>

        <h3>Dados técnicos</h3>
        <p>
          Como em qualquer site, o servidor de hospedagem recebe o endereço IP e dados do navegador e do
          aparelho para entregar as páginas. O site também usa o IP, na memória do servidor e por poucos
          minutos, para limitar envios repetidos do formulário (proteção contra abuso). Depois do envio, o
          seu primeiro nome e o tratamento escolhido ficam guardados na memória temporária da aba do
          navegador, só para personalizar a página de confirmação, e somem quando você fecha a aba.
        </p>

        <LegalHeading id="finalidades" sections={SECOES} />
        <ul>
          <li>entrar em contato com você e agendar a avaliação, confirmando dia e horário;</li>
          <li>dar continuidade ao atendimento e responder às suas dúvidas;</li>
          <li>
            se você veio de um anúncio, guardar a origem do clique, para saber qual anúncio trouxe o
            contato;
          </li>
          <li>
            medir, só se você aceitar os cookies, quais páginas e botões são mais usados;
          </li>
          <li>manter o site seguro e funcionando.</li>
        </ul>
        <p>Não vendemos os seus dados e não os usamos para decisões automatizadas sobre você.</p>

        <LegalHeading id="base-legal" sections={SECOES} />
        <p>
          O envio do formulário depende do seu <strong>consentimento</strong> (LGPD, art. 7º, I, e art. 11,
          I, para os dados de saúde). Você marca a caixa de aceite antes de enviar e pode retirar o
          consentimento quando quiser, escrevendo para <a href={MAIL}>{siteConfig.email}</a>. Isso não
          desfaz o que já foi feito com o seu consentimento anterior.
        </p>
        <p>
          Os cookies de medição e de campanha também dependem da sua autorização, dada no aviso de
          cookies (<a href="#cookies">seção 6, Cookies e medição</a>).
        </p>
        <p>
          O atendimento no consultório e o prontuário seguem as regras da profissão e da lei e ficam
          fora do site. Esta política trata do que passa por este site.
        </p>

        <LegalHeading id="quem-recebe" sections={SECOES} />
        <p>
          Usamos serviços de terceiros para o site funcionar. Eles tratam os dados só para esse fim e
          seguem as próprias políticas de privacidade.
        </p>
        <ul>
          <li>
            <strong>Vercel:</strong> hospedagem e entrega do site.
          </li>
          <li>
            <strong>Resend:</strong> envio do e-mail que avisa o consultório de que há um novo contato. O
            e-mail leva os dados do formulário e a origem do anúncio.
          </li>
          <li>
            <strong>Gmail (Google):</strong> o e-mail com os dados do formulário chega à caixa de entrada
            da Dra. Ana, que usa o Gmail.
          </li>
          <li>
            <strong>Supabase:</strong> banco de dados onde os contatos são guardados, quando esse serviço
            está ativado. O acesso é restrito à equipe do consultório, por senha.
          </li>
          <li>
            <strong>Google Maps:</strong> o mapa que mostra onde fica o consultório só carrega depois que
            você toca em &ldquo;Ver mapa&rdquo;. Antes disso, o site não faz nenhuma chamada ao Google
            Maps. Ao abrir o mapa, o Google recebe o seu IP e dados do navegador e segue a própria
            política.
          </li>
          <li>
            <strong>Google Analytics e Google Tag Manager</strong> (ferramentas que contam visitas e
            cliques), quando ativadas: veja a <a href="#cookies">seção 6, Cookies e medição</a>.
          </li>
          <li>
            <strong>Meta Pixel</strong> (ferramenta de medição de anúncios da Meta), quando ativado e só
            se você aceitar os cookies: veja a <a href="#cookies">seção 6, Cookies e medição</a>. Ao
            tocar em um botão de WhatsApp, você sai para o aplicativo da Meta e passa a seguir as regras
            dele.
          </li>
        </ul>
        <p>
          <strong>Servidores fora do Brasil.</strong> A hospedagem, o envio de e-mail, o banco de dados,
          o Gmail e as ferramentas de medição são serviços de empresas estrangeiras e podem tratar dados
          em servidores fora do Brasil, como nos Estados Unidos. Quando o tratamento depender do seu
          consentimento, como nos cookies de medição, ele só ocorre se você aceitar.
        </p>

        <LegalHeading id="cookies" sections={SECOES} />
        <p>
          Os cookies essenciais ao funcionamento do site ficam sempre ativos. O aviso de cookies guarda a
          sua escolha (aceitar ou recusar) no próprio aparelho.
        </p>
        <ul>
          <li>
            <strong>Google (Analytics e Tag Manager, quando ativados):</strong> as etiquetas carregam com
            todo o armazenamento negado, ou seja, sem gravar cookies de medição nem de publicidade, até
            você aceitar. Mesmo sem o aceite, o Google pode receber sinais técnicos que não usam cookies,
            como a página visitada, para medir e estimar resultados de forma agregada. Também ocultamos
            parte dos identificadores nos anúncios e mantemos o endereço de campanha na URL. Ao aceitar,
            a medição e os cookies passam a funcionar.
          </li>
          <li>
            <strong>Meta Pixel (quando ativado):</strong> só é carregado depois que você aceita. Se você
            recusar, ele não carrega.
          </li>
        </ul>
        <p>
          <strong>Origem do anúncio.</strong> Com o seu aceite, o site também guarda os códigos de
          campanha e a página de entrada na memória do navegador, por até 90 dias, para reconhecer quem
          volta outro dia.
        </p>
        <p>
          Você pode mudar de ideia a qualquer momento em <strong>Gerenciar cookies</strong>, no rodapé de
          todas as páginas. Também pode bloquear cookies nas configurações do navegador.
        </p>

        <LegalHeading id="direitos" sections={SECOES} />
        <p>Pela LGPD, você pode pedir a qualquer momento:</p>
        <ul>
          <li>a confirmação de que tratamos dados seus e o acesso a eles;</li>
          <li>a correção de dados incompletos ou desatualizados;</li>
          <li>
            a anonimização (tirar dos dados a ligação com você), o bloqueio ou a exclusão de dados
            desnecessários;
          </li>
          <li>a portabilidade dos dados (receber uma cópia para levar a outro serviço), nos termos da lei;</li>
          <li>informações sobre com quem compartilhamos os dados;</li>
          <li>a retirada do consentimento e a revisão do que já foi autorizado.</li>
        </ul>
        <p>
          Escreva para o e-mail abaixo. Pedimos alguns dados para confirmar que você é você, e
          respondemos pelo mesmo canal.
        </p>
        <LegalLinkLine>
          <a href={MAIL}>{siteConfig.email}</a>
        </LegalLinkLine>
        <p>
          Se achar que o seu direito não foi atendido, você pode reclamar à Autoridade Nacional de
          Proteção de Dados (ANPD):
        </p>
        <LegalLinkLine>
          <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
            gov.br/anpd<span className="sr-only"> (abre em nova aba)</span>
          </a>
        </LegalLinkLine>

        <LegalHeading id="criancas" sections={SECOES} />
        <p>
          O atendimento é para crianças a partir de 7 anos. O site não pergunta a idade de quem será
          atendido, por isso pedimos que, quando o paciente tem menos de 18 anos, o formulário seja
          preenchido e o consentimento dado por um dos pais ou pelo responsável legal, no melhor
          interesse da criança ou do adolescente (LGPD, art. 14). Este site não foi feito para coletar
          dados de menores sem essa autorização. Se os dados de um menor forem enviados sem ela, o
          responsável pode pedir a exclusão pelo e-mail desta política.
        </p>

        <LegalHeading id="seguranca" sections={SECOES} />
        <p>
          O site usa conexão segura (HTTPS), valida e limita os envios do formulário e restringe o acesso
          aos contatos guardados a quem trabalha no consultório. Nenhum sistema é totalmente livre de
          riscos, mas cuidamos disso com atenção.
        </p>
        <p>
          Os dados do formulário ficam guardados enquanto forem necessários para o contato e o
          atendimento, ou até você pedir a exclusão, salvo quando a lei exigir a guarda por mais tempo. O
          site não apaga os contatos sozinho depois de um prazo fixo. Sem o seu aceite de cookies, os códigos de
          campanha ficam só na aba do navegador e somem quando você a fecha. Com o aceite, uma cópia fica
          no navegador por até 90 dias.
        </p>

        <LegalHeading id="alteracoes" sections={SECOES} />
        <p>
          Podemos atualizar este texto para refletir mudanças no site ou na lei. A versão em vigor fica
          sempre nesta página, com a data de atualização. O envio do formulário registra a versão que você
          aceitou.
        </p>
      </LegalShell>
    </>
  );
}
