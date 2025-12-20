import type { Metadata } from "next";
import { Inter, Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-playfair"
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-crimson"
});

export const metadata: Metadata = {
  title: {
    default: "Sistema Jurídico - Cidade dos Anjos",
    template: "%s | Jurídico CDA"
  },
  description: "Sistema completo de gestão jurídica para Cidade dos Anjos. Gerencie processos, audiências, equipe e contratações com segurança e eficiência.",
  keywords: ["jurídico", "cidade dos anjos", "gestão jurídica", "processos", "advocacia", "tribunal", "sistema jurídico"],
  authors: [{ name: "Cidade dos Anjos" }],
  creator: "Cidade dos Anjos",
  publisher: "Cidade dos Anjos",
  metadataBase: new URL('https://juridico-cdanjos.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://juridico-cdanjos.vercel.app',
    title: 'Sistema Jurídico - Cidade dos Anjos',
    description: 'Sistema completo de gestão jurídica para Cidade dos Anjos. Gerencie processos, audiências, equipe e contratações com segurança e eficiência.',
    siteName: 'Jurídico CDA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sistema Jurídico - Cidade dos Anjos',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sistema Jurídico - Cidade dos Anjos',
    description: 'Sistema completo de gestão jurídica para Cidade dos Anjos.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${crimson.variable}`}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
