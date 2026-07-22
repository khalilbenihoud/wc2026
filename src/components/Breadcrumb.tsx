import { Fragment } from "react";

// Visible breadcrumb trail for the tournament and country pages. Mirrors the
// BreadcrumbList JSON-LD (see src/schema.ts) so the on-page trail and the
// structured data match. Crumbs are separated by a chevron in a soft rounded
// chip. Linked crumbs are muted and go gold on hover; the last crumb is the
// current page (not a link, may truncate).
export interface Crumb {
  label: string;
  href?: string;
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
          return (
            <Fragment key={i}>
              {i > 0 && <Separator />}
              <li className="flex items-center min-w-0">
                {c.href && !last ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(c.href!)}
                    className="flex items-center px-1 py-2.5 -my-2.5 uppercase text-brand-muted hover:text-brand-gold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {c.label}
                  </button>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={`flex items-center whitespace-nowrap ${last ? "text-brand-text truncate" : "text-brand-muted"} px-1`}
                  >
                    {c.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
