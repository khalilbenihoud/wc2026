// Circular player avatar for the award chips (Golden Boot / Golden Glove).
// Falls back to a gold ⚽ ring while the photo is loading or when Wikipedia has
// no thumbnail, so the slot is always filled — no blank flash, no floating
// pop-under.
import { useState } from "react";

export default function PlayerAvatar({
  photo,
  name,
  className = "",
}: {
  photo: string | null;
  name: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const showImg = photo && !broken;
  const init = name.charAt(0).toUpperCase();

  return (
    <span
      className={`relative shrink-0 flex items-center justify-center rounded-full overflow-hidden border border-brand-gold/50 bg-brand-gold/10 shadow-[0_0_10px_rgba(246,196,83,0.25)] ${className}`}
    >
      {showImg ? (
        <img
          src={photo}
          alt={name}
          onError={() => setBroken(true)}
          className="w-full h-full object-cover object-top animate-[fadeIn_0.4s_ease]"
        />
      ) : (
        <span className="font-unbounded font-bold text-[0.55em] leading-none text-brand-gold select-none">
          {init}
        </span>
      )}
    </span>
  );
}
