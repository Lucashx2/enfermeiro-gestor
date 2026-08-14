import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enfermeiro Gestor",
  description: "Sistema de gestão de plantões",
  manifest: "/manifest.webmanifest",
  applicationName: "Enfermeiro Gestor",
  appleWebApp: {
    capable: true,
    title: "Enfermeiro Gestor",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.png",
    apple: "/pwa-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
