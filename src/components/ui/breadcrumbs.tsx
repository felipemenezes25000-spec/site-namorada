import Link from "next/link";

/** Trilha de navegação (DESIGN.md 4.4): alvos de 44px, separador "/" dourado-tinta, sem chevron. */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; href?: string }[];
}) {
  return (
    <nav aria-label="Trilha de navegação" className="crumb t-sm">
      <ol className="m-0 flex list-none flex-wrap items-center p-0 text-fg-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.name} className="flex items-center">
              {item.href && !last ? (
                <Link href={item.href}>{item.name}</Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-head" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="px-2.5 text-accent">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
