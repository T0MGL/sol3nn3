import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Meta Pixel is initialized in index.html for faster loading
// No need to initialize again here to avoid duplicate PageView events

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a <div id='root'></div> in your HTML.");
}
createRoot(rootElement).render(<App />);
