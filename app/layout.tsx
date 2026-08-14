import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enfermeiro Gestor",
  description: "Sistema de gestão de plantões",
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
