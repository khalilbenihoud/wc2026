import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

// Built by Benihoud Khalil — for fun only. ⚽🏆
console.log(
  "%c⚽ The Road to Glory %c— built by Benihoud Khalil, for fun only.",
  "font-weight:bold",
  "color:#888"
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
