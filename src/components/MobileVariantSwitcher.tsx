import { MobileBracketVariant } from "../types";

interface Props {
  value: MobileBracketVariant;
  onChange: (v: MobileBracketVariant) => void;
}

const VARIANTS: { key: MobileBracketVariant; label: string }[] = [
  { key: "list", label: "List" },
  { key: "bracket", label: "Bracket" },
];

export default function MobileVariantSwitcher({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-brand-panel border border-brand-line">
      {VARIANTS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded-md transition-all cursor-pointer ${
            value === key
              ? "bg-brand-gold text-brand-bg font-bold shadow-sm"
              : "text-brand-muted hover:text-brand-text"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
