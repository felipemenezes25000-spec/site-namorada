import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Tag do título para hierarquia semântica correta. */
  as?: "h2" | "h3";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  as = "h2",
  light = false,
}: SectionHeadingProps) {
  const Title = as;
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p
            className={cn(
              "eyebrow mb-4 flex items-center gap-3",
              light && "text-brand-gold-bright",
              align === "center" ? "justify-center" : "justify-start",
            )}
          >
            <span
              className={cn(
                "inline-block h-px w-7",
                light ? "bg-brand-gold-soft" : "bg-brand-gold/70",
                align === "center" && "hidden",
              )}
            />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <Title
          className={cn(
            "text-display-md text-balance",
            light && "text-brand-bone",
          )}
        >
          {title}
        </Title>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-pretty text-base leading-relaxed sm:text-lg",
              light ? "text-brand-bone/75" : "text-brand-ink/70",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
