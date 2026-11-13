import { siteConfig } from "@/lib/site-config";
import { waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { PhoneCTA, WhatsAppCTA } from "@/components/ui/cta";
import { TrackedLink } from "@/components/ui/tracked-link";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import { EnderecoLinha } from "./contato-endereco";
import styles from "./contato-sections.module.css";

/**
 * Canais de contato em linhas largas (DESIGN.md 5.6): rótulo, valor em destaque e ação, separados
 * por fios que se desenham. Sem ícones em círculo, sem cartões, sem setas soltas: o valor
 * sublinhado em ouro é o link, e a linha inteira é alvo de toque. Servidor; só os links medidos
 * (`TrackedLink`, `WhatsAppCTA`, `PhoneCTA`) são ilhas.
 * Eventos: whatsapp_click, phone_click, instagram_click e email_click (o e-mail virou canal medido;
 * o endereço nunca vai no evento), todos com location="contact_page". O horário só aparece se `siteConfig.hours` estiver preenchido.
 * Valores longos (e-mail) quebram com overflow-wrap: anywhere e min-width: 0 (sem rolagem a 320px).
 */
const [emailUser, emailDomain] = siteConfig.email.split("@");

export function ContactMethods({ className }: { className?: string }) {
  return (
    <ul data-reveal="" className={cn("idx", styles.list, className)}>
      <IndexRow i={0} className={styles.row}>
        <p className={cn("t-folio", styles.label)}>WhatsApp</p>
        <div className="min-w-0">
          <p className={cn("t-d3 display", styles.val)}>Tire dúvidas ou agende em poucos toques</p>
        </div>
        <div className={styles.action}>
          <WhatsAppCTA location="contact_page" message={waMessages.default} />
        </div>
      </IndexRow>

      <IndexRow i={1} className={styles.row}>
        <p className={cn("t-folio", styles.label)}>Telefone</p>
        <div className="min-w-0">
          <PhoneCTA as="texto" location="contact_page" className={cn(styles.big, styles.stretch)} />
        </div>
      </IndexRow>

      <IndexRow i={2} className={styles.row}>
        <p className={cn("t-folio", styles.label)}>E-mail</p>
        <div className="min-w-0">
          <TrackedLink
            href={`mailto:${siteConfig.email}`}
            event="email_click"
            eventParams={{ location: "contact_page" }}
            className={styles.valLink}
          >
            <span className={cn(styles.mid, styles.valText)}>
              {emailUser}
              <wbr />@{emailDomain}
            </span>
          </TrackedLink>
        </div>
      </IndexRow>

      <IndexRow i={3} className={styles.row}>
        <p className={cn("t-folio", styles.label)}>Instagram</p>
        <div className="min-w-0">
          <TrackedLink
            href={siteConfig.instagramUrl}
            event="instagram_click"
            eventParams={{ location: "contact_page" }}
            external
            className={styles.valLink}
          >
            <span className={cn(styles.mid, styles.valText)}>{siteConfig.instagram}</span>
          </TrackedLink>
        </div>
      </IndexRow>

      {siteConfig.hours ? (
        <IndexRow i={4} className={styles.row}>
          <p className={cn("t-folio", styles.label)}>Horário</p>
          <p className={cn("t-d3 display", styles.val)}>{siteConfig.hours}</p>
        </IndexRow>
      ) : null}

      <IndexRow i={siteConfig.hours ? 5 : 4} className={styles.row}>
        <p className={cn("t-folio", styles.label)}>Endereço</p>
        <div className="min-w-0">
          <p className={cn("t-d3 display", styles.addr)}>{siteConfig.address.street}</p>
          <p className={cn("t-body", styles.addrSub)}>
            <EnderecoLinha />
          </p>
        </div>
      </IndexRow>
      <IndexEnd i={siteConfig.hours ? 6 : 5} />
    </ul>
  );
}
