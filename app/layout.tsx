import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoFlowSolutions | Sites web et automatisation",
  description: "Création de sites professionnels, automatisation WhatsApp, IA, devis automatique et dashboard administrable.",
  icons: {
    icon: "/logo-autoflow.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
