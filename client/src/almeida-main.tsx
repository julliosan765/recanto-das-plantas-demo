import { createRoot } from "react-dom/client";
import AlmeidaStorefront from "./pages/AlmeidaStorefront";
import "./almeida.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Não foi possível iniciar a prévia Almeida Móveis.");
}

createRoot(rootElement).render(<AlmeidaStorefront />);
