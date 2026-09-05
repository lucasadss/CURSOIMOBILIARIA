import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Editorial sans used by the public landing page (app/page.tsx).
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  // TODO: point this at the custom domain once it's registered and connected
  // in Vercel (imovix.com.br currently doesn't resolve). Until then this must
  // stay the real deployment URL, or every canonical/OG/Twitter URL below
  // resolves to a dead domain.
  metadataBase: new URL("https://imovix-app.vercel.app"),
  title: {
    default: "IMOVIX · Venda mais apresentando melhor os seus imóveis",
    template: "%s · IMOVIX",
  },
  description:
    "Transforme fotos de imóveis, terrenos e obras em imagens e vídeos sem precisar aprender edição ou IA.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IMOVIX · Venda mais apresentando melhor os seus imóveis",
    description:
      "Transforme fotos de imóveis, terrenos e obras em imagens e vídeos sem precisar aprender edição ou IA.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "IMOVIX · Venda mais apresentando melhor os seus imóveis",
    description:
      "Transforme fotos de imóveis, terrenos e obras em imagens e vídeos sem precisar aprender edição ou IA.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body className="min-h-dvh bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
