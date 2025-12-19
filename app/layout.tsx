import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema Jurídico - Cidade dos Anjos",
  description: "Sistema de gestão jurídica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
