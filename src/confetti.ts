import confetti from "canvas-confetti";

// CSP blocks blob: workers (Netlify dashboard), so render on the main thread.
// The library's getCanvas() omits CSS width/height, causing a 300x150 display
// box — we supply our own full-viewport canvas with explicit styles.
let fire: ((opts?: confetti.Options) => Promise<null> | null) | null = null;

function getFire() {
  if (fire) return fire;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "9999";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  fire = confetti.create(canvas, { useWorker: false, resize: true });
  return fire;
}

export function fireConfetti() {
  const gold = "#D97706";
  const goldLight = "#FCD34D";
  const goldHi = "#F59E0B";
  const red = "#DC2626";
  const yellow = "#FDE047";

  const defaults: confetti.Options = {
    spread: 70,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    colors: [gold, goldHi, goldLight, red, yellow],
    origin: { y: 0.6 },
    zIndex: 9999,
  };

  const f = getFire();
  f({ ...defaults, particleCount: 80, spread: 100, origin: { y: 0.55 } });
  f({ ...defaults, particleCount: 40, spread: 120, origin: { y: 0.5 }, angle: 60 });
  f({ ...defaults, particleCount: 40, spread: 120, origin: { y: 0.5 }, angle: 120 });
}
