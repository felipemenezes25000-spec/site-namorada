import { cn } from "@/lib/utils";

/** Container com tipografia para documentos legais (sem plugin de typography). */
export function LegalShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "max-w-prose2",
        "[&_h2]:mt-10 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-brand-green",
        "[&_h3]:mt-6 [&_h3]:mb-1 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-brand-green",
        "[&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-brand-ink/75",
        "[&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-1",
        "[&_li]:relative [&_li]:pl-5 [&_li]:text-brand-ink/75 [&_li]:leading-relaxed",
        "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-2.5 [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-brand-gold",
        "[&_a]:font-semibold [&_a]:text-brand-green [&_a]:underline [&_a]:decoration-brand-gold/50 [&_a]:underline-offset-2",
        "[&_strong]:font-semibold [&_strong]:text-brand-green",
        className,
      )}
    >
      {children}
    </article>
  );
}
