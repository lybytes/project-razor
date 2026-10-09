import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Self-hosted fonts (no external Google Fonts request — GDPR-friendly, and
// works offline). Anton = display, Archivo = UI/body, JetBrains Mono = labels.
import "@fontsource/anton/400.css";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "@fontsource/archivo/900.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
