import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enfermeiro Gestor",
    short_name: "Enf. Gestor",
    description: "Gestão de plantões, finanças e equipe.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#0f766e",
    icons: [
      { src: "/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
