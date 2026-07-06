// Circular player avatar for the award chips (Golden Boot / Golden Glove).
// Falls back to a gold ⚽ ring while the photo is loading or when Wikipedia has
// no thumbnail, so the slot is always filled — no blank flash, no floating
// pop-under.
export default function PlayerAvatar({
  photo,
  name,
  className = "",
}: {
  photo: string | null;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`relative shrink-0 flex items-center justify-center rounded-full overflow-hidden border border-brand-gold/50 bg-brand-gold/10 shadow-[0_0_10px_rgba(246,196,83,0.25)] ${className}`}
    >
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top animate-[fadeIn_0.4s_ease]"
        />
      ) : (
        <span className="text-[0.7em] leading-none select-none">⚽</span>
      )}
    </span>
  );
}
