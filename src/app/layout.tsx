import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nucleovip.com.br"

export const metadata: Metadata = {
  title: {
    default: "Núcleo VIP - Plataforma de Infoprodutos Premium",
    template: "%s | Núcleo VIP",
  },
  description: "Venda cursos, e-books, mentorias e infoprodutos com a plataforma que tem uma das menores taxas do Brasil. Cadastre-se grátis.",
  keywords: ["infoprodutos", "cursos online", "vender curso", "plataforma de cursos", "e-commerce digital", "Núcleo VIP", "produtor digital", "afiliado"],
  authors: [{ name: "Núcleo VIP" }],
  creator: "Núcleo VIP",
  publisher: "Núcleo VIP",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Núcleo VIP",
    title: "Núcleo VIP - Plataforma de Infoprodutos Premium",
    description: "Venda cursos, e-books, mentorias e infoprodutos com a plataforma que tem uma das menores taxas do Brasil.",
    url: siteUrl,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Núcleo VIP - Plataforma de Infoprodutos Premium",
    description: "Venda cursos, e-books, mentorias e infoprodutos com a plataforma que tem uma das menores taxas do Brasil.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
