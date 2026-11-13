import { Logo } from "@/components/brand/logo";
import { FioProgress } from "@/components/brand/fio-progress";
import { RouteWhatsAppCTA } from "./route-ctas";
import { NavLinks } from "./nav-links";
import { MenuSheet } from "./menu-sheet";

/**
 * Cabeçalho (DESIGN.md 4.3), sticky e no fluxo. Servidor; só NavLinks (rota atual), MenuSheet
 * (menu em folha) e FioProgress são ilhas cliente.
 * Os três modos dependem da LARGURA ÚTIL do cabeçalho em rem (container query em globals.css), não da
 * janela em px: com o texto ampliado (200%) ele passa para o modo mais simples em vez de transbordar.
 *  - < 47,5rem (760px): Logo + "Menu";
 *  - 47,5 a 68,75rem (1100px): Logo + botão WhatsApp + "Menu";
 *  - >= 68,75rem: Logo + navegação horizontal + botão WhatsApp.
 * Fundo osso sólido (sem blur), fio inferior de 1px; o fio de progresso mora aqui dentro.
 */
export function Header() {
  return (
    <header className="hdr">
      <div className="hdr-in">
        <Logo />
        <div className="hdr-dir">
          <NavLinks />
          <RouteWhatsAppCTA
            size="sm"
            location="header"
            compactLabel="WhatsApp"
            className="hdr-cta"
          />
          <MenuSheet />
        </div>
      </div>
      <FioProgress />
    </header>
  );
}
