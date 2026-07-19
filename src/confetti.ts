import confetti from "canvas-confetti";

// CSP blocks blob: workers (Netlify dashboard), so render on the main thread.
const fire = confetti.create(null, { useWorker: false });

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

  fire({ ...defaults, particleCount: 80, spread: 100, origin: { y: 0.55 } });
  fire({ ...defaults, particleCount: 40, spread: 120, origin: { y: 0.5 }, angle: 60 });
  fire({ ...defaults, particleCount: 40, spread: 120, origin: { y: 0.5 }, angle: 120 });
}
