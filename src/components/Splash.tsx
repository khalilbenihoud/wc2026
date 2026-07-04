import SplashV1 from "./splash/SplashV1";

export default function Splash({ onEnter }: { onEnter: () => void }) {
  return <SplashV1 onEnter={onEnter} />;
}
