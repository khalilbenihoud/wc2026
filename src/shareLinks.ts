// Pure builders for the desktop share fallback. Kept separate from the component
// so the one piece with real correctness risk — URL encoding — is trivially
// testable and has no React/DOM dependency.
export interface ShareTarget {
  title: string;
  url: string;
}

export const xShareUrl = ({ title, url }: ShareTarget): string =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

export const whatsappShareUrl = ({ title, url }: ShareTarget): string =>
  `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

export const facebookShareUrl = ({ url }: ShareTarget): string =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
