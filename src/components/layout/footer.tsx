import Link from "next/link";
import { siteConfig, mainNav, supportNav, localeTexto } from "@/lib/site-config";
import { treatments } from "@/lib/treatments";
import { Monogram } from "@/components/brand/logo";
import { ManageCookiesButton } from "@/components/seo/manage-cookies-button";
import { AgendarCTA, PhoneCTA } from "@/components/ui/cta";
import { PlusIcon } from "@/components/ui/icons";
import { RouteWhatsAppCTA } from "./route-ctas";
import { TrackedLink } from "@/components/ui/tracked-link";

const legal = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de Uso", href: "/termos-de-uso" },
];

/** Título de coluna: texto, não cabeçalho (o rodapé não tem h2 e as colunas não são seções); a lista se liga a ele. */
function ColTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="t-kicker m-0">
      {children}
    </p>
  );
}

/**
 * Rodapé (DESIGN.md 5.0): seção noite com o símbolo em marca d'água. Servidor.
 * Marca, endereço e contato à esquerda (5 colunas); Navegação, Para você e Tratamentos
 * à direita (7). Cada link tem 44px de altura. O horário só aparece se siteConfig.hours existir.
 * O trilho do Fio some quando o rodapé entra na tela (FioRail).
 * Sem h2 "Rodapé" nem aria-label: o <footer> já é o landmark de informações do site.
 * A estrutura (.ft-*) vive em globals.css: a 404 e as páginas de erro montam o rodapé fora do
 * layout das rotas e um CSS Module não era carregado lá.
 */
export function Footer() {
  const year = 2026; // fixo para build determinístico; edite se necessário.
  return (
    <footer data-tone="noite" data-hide-floating="" className="ft-root">
      <div className="ft-mark" aria-hidden="true">
        <Monogram tone="claro" size={300} lazy />
      </div>

      <div className="wrap relative ft-pad">
        <div className="ft-grid">
          <div className="ft-brand">
            <p className="t-d3 display ft-nome">{siteConfig.doctorName}</p>
            <p className="t-body mt-3">Cirurgiã-dentista · {siteConfig.cro}</p>
            <p className="t-body mt-3 hidden max-w-leitura tab:block">
              Cuidado odontológico com planejamento individual. Atendimento na região da{" "}
              {siteConfig.neighborhood}, em {siteConfig.city}.
            </p>

            <address className="t-sm mt-6 min-w-0 max-w-leitura not-italic text-fg-2">
              {localeTexto("endereco")}
            </address>
            {siteConfig.hours && <p className="t-sm mt-2 text-fg-2">{siteConfig.hours}</p>}
            <ul className="ft-contacts">
              {/* no celular a barra de ações já tem o WhatsApp: a linha some do rodapé */}
              <li className="ft-so-desk">
                <RouteWhatsAppCTA location="footer" variant="texto" className="t-sm" />
              </li>
              <li>
                <PhoneCTA location="footer" as="texto" className="t-sm" />
              </li>
              <li>
                <TrackedLink
                  href={`mailto:${siteConfig.email}`}
                  event="email_click"
                  eventParams={{ location: "footer" }}
                  className="foot-link t-sm"
                >
                  {siteConfig.email}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={siteConfig.instagramUrl}
                  event="instagram_click"
                  eventParams={{ location: "footer" }}
                  external
                  className="foot-link t-sm"
                >
                  Instagram {siteConfig.instagram}
                </TrackedLink>
              </li>
            </ul>
          </div>

          <div className="ft-lists">
            <div>
              <ColTitle id="ft-nav">Navegação</ColTitle>
              <ul aria-labelledby="ft-nav" className="m-0 mt-2 list-none p-0">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} prefetch={false} className="foot-link t-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* celular: os links de "Para você" entram nesta lista (duas colunas, sem um bloco quase vazio) */}
                {supportNav.map((item) => (
                  <li key={item.href} className="ft-so-celular">
                    <Link href={item.href} prefetch={false} className="foot-link t-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ft-so-desk">
              <ColTitle id="ft-apoio">Para você</ColTitle>
              <ul aria-labelledby="ft-apoio" className="m-0 mt-2 list-none p-0">
                {supportNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} prefetch={false} className="foot-link t-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* no celular o formulário está na barra de ações (e no menu) */}
                <li>
                  <AgendarCTA location="footer" variant="texto" className="t-sm" />
                </li>
              </ul>
            </div>

            <div className="ft-wide ft-wide-desktop">
              <ColTitle id="ft-trat">Tratamentos</ColTitle>
              <ul aria-labelledby="ft-trat" className="m-0 mt-2 list-none p-0">
                {treatments.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tratamentos/${t.slug}`}
                      prefetch={false}
                      className="foot-link t-sm"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <details className="ft-wide ft-wide-mobile">
              <summary>
                <span className="t-kicker">Tratamentos</span>
                <span aria-hidden="true" className="ft-ind">
                  <PlusIcon size={20} />
                </span>
              </summary>
              <ul className="m-0 list-none p-0">
                {treatments.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tratamentos/${t.slug}`}
                      prefetch={false}
                      className="foot-link t-sm"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>

        <div className="ft-legal-row">
          <span className="fio-h" aria-hidden="true" />
          <div
            className={`ft-legal flex flex-col gap-x-8 pt-4 tab:flex-row tab:flex-wrap tab:items-center tab:justify-between`}
          >
            <p className="m-0 text-nevoa">
              © {year} {siteConfig.doctorName}
            </p>
            <ul className="m-0 flex list-none flex-row flex-wrap items-center gap-x-6 p-0">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} prefetch={false} className="foot-link">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <ManageCookiesButton className="foot-link cursor-pointer border-0 bg-transparent p-0 text-left" />
              </li>
            </ul>
          </div>
          <p className="ft-legal-note">
            Conteúdo de caráter informativo, sem promessa de resultados. Cada caso é avaliado
            individualmente.
          </p>
        </div>
      </div>
    </footer>
  );
}
