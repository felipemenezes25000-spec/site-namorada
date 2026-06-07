import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: { name: string; href?: string }[];
  children?: React.ReactNode;
  align?: "left" | "center";
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  align = "left",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand-ink/[0.06] bg-gradient-to-b from-brand-beige/50 to-brand-bone pt-28 sm:pt-32 lg:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_90%_-20%,#dde8e1_0%,transparent_55%)]"
      />
      <div className="container pb-14 lg:pb-16">
        {breadcrumbs && (
          <Reveal>
            <div className="mb-7">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          </Reveal>
        )}
        <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
          {eyebrow && (
            <Reveal>
              <p
                className={cn(
                  "eyebrow flex items-center gap-3",
                  align === "center" ? "justify-center" : "justify-start",
                )}
              >
                {align === "left" && <span className="inline-block h-px w-7 bg-brand-gold/70" />}
                {eyebrow}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.05}>
            <h1 className="mt-5 text-display-lg text-balance">{title}</h1>
          </Reveal>
          {description && (
            <Reveal delay={0.1}>
              <p
                className={cn(
                  "mt-6 text-pretty text-lg leading-relaxed text-brand-ink/75",
                  align === "center" ? "mx-auto max-w-2xl" : "max-w-prose2",
                )}
              >
                {description}
              </p>
            </Reveal>
          )}
          {children && (
            <Reveal delay={0.15}>
              <div className="mt-9">{children}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
