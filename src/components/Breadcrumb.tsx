// Visible breadcrumb trail for the tournament and country pages. Mirrors the
// BreadcrumbList JSON-LD (see src/schema.ts) so the on-page trail and the
// structured data match. The root crumb renders as a home icon; crumbs are
// separated by a chevron in a soft rounded chip. Linked crumbs are muted and go
// gold on hover; the last crumb is the current page (not a link, may truncate).
export interface Crumb {
  label: string;
  href?: string;
  // Render a home icon instead of the label (the label is kept as the accessible
  // name so it still matches the structured-data root crumb).
  home?: boolean;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-[15px] h-[15px]" aria-hidden focusable="false">
      <path d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
    </svg>
  );
}

function Separator() {
  return (
    <span
      aria-hidden
      className="flex items-center justify-center w-[18px] h-[18px] rounded-[6px] bg-[rgba(var(--overlay-rgb),0.06)] text-brand-muted shrink-0"
    >
      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export default function Breadcrumb({
  items,
  onNavigate,
}: {
  items: Crumb[];
  onNavigate: (href: string) => void;
}) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] min-w-0">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          const inner = c.home ? <HomeIcon /> : c.label;
          const ariaLabel = c.home ? c.label : undefined;
          return (
            <li key={i} className="flex items-center gap-2 min-w-0">
              {i > 0 && <Separator />}
              {c.href && !last ? (
                <button
                  type="button"
                  onClick={() => onNavigate(c.href!)}
                  aria-label={ariaLabel}
                  className="flex items-center text-brand-muted hover:text-brand-gold transition-colors cursor-pointer whitespace-nowrap"
                >
                  {inner}
                </button>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  aria-label={ariaLabel}
                  className={`flex items-center whitespace-nowrap ${last ? "text-brand-text truncate" : "text-brand-muted"}`}
                >
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
