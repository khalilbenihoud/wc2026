import { useEffect, useRef, useState } from "react";
import { xShareUrl, whatsappShareUrl, facebookShareUrl, type ShareTarget } from "../shareLinks";

// Absolute canonical base — what we always want shared, regardless of where the
// page is being viewed (localhost, a deploy preview, etc.).
const BASE_URL = "https://worldcuparchive.net";

interface Props {
  // Canonical path for this page, e.g. "/countries/brazil" or "/tournaments/1970".
  path: string;
  // Share title; defaults to the page's current document title.
  title?: string;
}

// Share control for tournament/country pages. Uses the native share sheet where
// available (mobile), otherwise a small popover with copy-link + per-network links.
export default function ShareButton({ path, title }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const url = `${BASE_URL}${path.endsWith("/") ? path : `${path}/`}`;
  const shareTitle = title ?? (typeof document !== "undefined" ? document.title : "");
  const target: ShareTarget = { title: shareTitle, url };

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  // Close the popover on outside-click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onClick = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({ title: shareTitle, url });
      } catch {
        // User dismissed the sheet — nothing to surface.
      }
      return;
    }
    setOpen((v) => !v);
  };

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts / older browsers.
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const linkClass =
    "block px-3 py-2 rounded-md text-sm text-brand-muted hover:text-brand-text hover:bg-brand-line/40 transition-colors cursor-pointer text-left w-full";

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={onClick}
        aria-haspopup={!canNativeShare}
        aria-expanded={open}
        aria-label="Share this page"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-brand-line text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer font-mono text-[10px] tracking-[0.22em] uppercase"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>

      {open && !canNativeShare && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 z-30 rounded-lg border border-brand-line bg-brand-panel shadow-xl p-1"
        >
          <button role="menuitem" onClick={copy} className={linkClass}>
            {copied ? "Link copied ✓" : "Copy link"}
          </button>
          <a role="menuitem" href={xShareUrl(target)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Share on X
          </a>
          <a role="menuitem" href={whatsappShareUrl(target)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Share on WhatsApp
          </a>
          <a role="menuitem" href={facebookShareUrl(target)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Share on Facebook
          </a>
        </div>
      )}
    </div>
  );
}
