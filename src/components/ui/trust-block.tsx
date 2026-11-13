import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Bloco de confiança (DESIGN.md 4.4): lista de definição com fios. Só fatos que
 * já existem no site. O horário só aparece se `siteConfig.hours` estiver
 * preenchido (nunca "a combinar"). Sem título de responsabilidade técnica. Sem forma de pagamento
 * (Código de Ética Odontológica, art. 44, I): as formas de pagamento ficam numa única resposta
 * (respostas.pagamento, em content.ts).
 */
export function TrustBlock({
  variant = "bloco",
  className,
}: {
  variant?: "linha" | "bloco";
  className?: string;
}) {
  const a = siteConfig.address;
  const endereco = `${a.street} — ${a.neighborhood} (região da ${siteConfig.neighborhood}), ${a.city} - ${a.state}, ${a.zip}`;
  const rows: { dt: string; dd: string }[] = [
    { dt: "Profissional", dd: `Cirurgiã-dentista · ${siteConfig.cro}` },
    { dt: "Atendimento", dd: "Particular, sem convênios" },
    { dt: "Consultório", dd: endereco },
    ...(siteConfig.hours ? [{ dt: "Horário", dd: siteConfig.hours }] : []),
  ];

  if (variant === "linha") {
    return (
      <dl
        data-reveal=""
        className={cn("trust m-0 grid gap-x-[var(--gap)] tab:grid-cols-3", className)}
      >
        {rows.map((r) => (
          <div key={r.dt} className="trust-linha t-sm min-w-0">
            <span className="fio-h" aria-hidden="true" />
            <dt>{r.dt}</dt>
            <dd>{r.dd}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <div className={cn("trust", className)}>
      <p className="t-d3 display">{siteConfig.doctorName}</p>
      <dl data-reveal="" className="m-0 mt-6">
        {rows.map((r) => (
          <div key={r.dt} className="trust-linha t-body min-w-0">
            <span className="fio-h" aria-hidden="true" />
            <dt>{r.dt}</dt>
            <dd>{r.dd}</dd>
          </div>
        ))}
        <div className="relative pt-px">
          <span className="fio-h" aria-hidden="true" />
        </div>
      </dl>
    </div>
  );
}
