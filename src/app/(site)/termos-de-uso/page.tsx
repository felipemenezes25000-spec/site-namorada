import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { TERMS_VERSION, formatDatePtBR } from "@/lib/content";
import { PageHero } from "@/components/sections/page-hero";
import {
  LegalHeading,
  LegalLinkLine,
  LegalShell,
  type LegalSection,
} from "@/components/sections/legal-shell";

export const metadata: Metadata = buildMetadata({
  title: "Termos de Uso | Dra. Ana Beatriz",
  description:
    "Condições de uso do site da Dra. Ana Beatriz Lemos Souza: conteúdo informativo, agendamentos, links de terceiros e comunicação ética em odontologia.",
  path: "/termos-de-uso",
});

const SECOES: LegalSection[] = [
  { id: "sobre", title: "Sobre este site" },
  { id: "informativo", title: "Conteúdo informativo" },
  { id: "uso", title: "Uso adequado" },
  { id: "propriedade", title: "Propriedade intelectual" },
  { id: "terceiros", title: "Links e serviços de terceiros" },
  { id: "agendamentos", title: "Agendamentos e contato" },
  { id: "etica", title: "Comunicação ética" },
  { id: "foro", title: "Lei aplicável e foro" },
  { id: "alteracoes", title: "Mudanças nestes termos" },
  { id: "contato", title: "Contato" },
];

const MAIL = `mailto:${siteConfig.email}`;

export default function TermosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Termos de Uso", path: "/termos-de-uso" },
        ])}
      />
      <PageHero
        kicker="Regras deste site"
        title="Termos de Uso"
        lede={<span className="t-folio">Atualizado em {formatDatePtBR(TERMS_VERSION)}</span>}
        visual="none"
        className="pb-10 tab:pb-12 desk:pb-14"
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Termos de Uso" }]}
      />

      <LegalShell
        sections={SECOES}
        notes={
          <>
            <p>
              <strong>Em resumo.</strong> O site informa e facilita o contato. Ele não substitui a
              consulta, e o envio do formulário é um pedido de agendamento, que só vale depois da
              confirmação.
            </p>
            <p>
              Sobre os seus dados, veja a{" "}
              <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
            </p>
          </>
        }
      >
        <p>
          Estes termos explicam como o site funciona. Se você continuar usando o site, entendemos
          que leu as condições descritas abaixo.
        </p>

        <LegalHeading id="sobre" sections={SECOES} />
        <p>
          Este site é mantido por <strong>{siteConfig.doctorName}</strong> ({siteConfig.title},{" "}
          {siteConfig.cro}) e tem caráter <strong>informativo</strong>. Ele apresenta a profissional
          e os tratamentos e facilita o contato e o agendamento.
        </p>

        <LegalHeading id="informativo" sections={SECOES} />
        <p>
          As informações publicadas aqui não são diagnóstico, prescrição nem indicação de
          tratamento. Qualquer decisão clínica depende de avaliação individual e presencial. Não há
          promessa de resultado: cada caso é único e avaliado de forma personalizada.
        </p>

        <LegalHeading id="uso" sections={SECOES} />
        <p>Ao usar este site, pedimos que você:</p>
        <ul>
          <li>dê informações verdadeiras nos formulários;</li>
          <li>não use o site para fins ilícitos ou que prejudiquem outras pessoas;</li>
          <li>não tente acessar áreas restritas sem autorização.</li>
        </ul>

        <LegalHeading id="propriedade" sections={SECOES} />
        <p>
          A marca, o logotipo, os textos e os elementos visuais deste site pertencem a{" "}
          {siteConfig.doctorName} e não podem ser reproduzidos sem autorização prévia.
        </p>

        <LegalHeading id="terceiros" sections={SECOES} />
        <p>
          O site tem links para serviços externos, como WhatsApp, Google Maps e Instagram. Não nos
          responsabilizamos pelo conteúdo nem pelas políticas desses serviços.
        </p>

        <LegalHeading id="agendamentos" sections={SECOES} />
        <p>
          O envio do formulário ou o contato pelo WhatsApp é uma <strong>solicitação</strong> de
          agendamento, confirmada diretamente pela equipe. O envio, por si só, não garante data e
          horário até a confirmação.
        </p>

        <LegalHeading id="etica" sections={SECOES} />
        <p>
          Buscamos seguir o Código de Ética Odontológica e as normas de publicidade do Conselho
          Federal de Odontologia, como a Resolução CFO-196/2019. Por isso, evitamos promessas de
          resultado, expressões sensacionalistas e a divulgação de técnicas ou equipamentos como
          exclusivos.
        </p>
        <p>
          Quando imagens de pacientes forem publicadas, será com autorização formal, seguindo as
          normas do CFO e do CRO-SP. O conteúdo do site tem finalidade informativa e educativa, sob
          responsabilidade da profissional identificada aqui ({siteConfig.cro}).
        </p>

        <LegalHeading id="foro" sections={SECOES} />
        <p>
          Estes termos seguem a lei brasileira. Para resolver qualquer questão sobre eles, fica
          eleito o foro da comarca de São Paulo (SP), sem prejuízo do foro do seu domicílio quando a
          lei do consumidor garantir esse direito.
        </p>

        <LegalHeading id="alteracoes" sections={SECOES} />
        <p>
          Podemos atualizar estes termos. A versão em vigor fica sempre nesta página, com a data de
          atualização.
        </p>

        <LegalHeading id="contato" sections={SECOES} />
        <p>Dúvidas sobre estes termos podem ser enviadas para:</p>
        <LegalLinkLine>
          <a href={MAIL}>{siteConfig.email}</a>
        </LegalLinkLine>
      </LegalShell>
    </>
  );
}
