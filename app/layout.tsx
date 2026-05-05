import type { Metadata } from "next";
import { getTextMap, textValue } from "@/lib/data";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getTextMap();

  return {
    title: textValue(texts, "site.meta.titre"),
    description: textValue(texts, "site.meta.description"),
    icons: {
      icon: "/logo-autoflow.svg"
    }
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
