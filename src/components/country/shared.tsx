// Shared primitives for the country page variants.

export function Rule() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-brand-line to-transparent" />
  );
}

export function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] font-semibold tracking-[0.28em] uppercase text-brand-gold mb-4">
      {children}
    </div>
  );
}
