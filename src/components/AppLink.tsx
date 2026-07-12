import { AnchorHTMLAttributes } from "react";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  onNavigate: (href: string) => void;
};

// Renders a real, crawlable <a href> so search engines follow it and users get
// hover-URLs / open-in-new-tab — but navigates via the SPA router on a plain
// left-click. Modified clicks (⌘/ctrl/new-tab, middle-click) fall through to
// the browser's native behaviour.
export default function AppLink({ href, onNavigate, onClick, children, ...rest }: AppLinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
