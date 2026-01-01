import type React from "react"
import type { Metadata } from "next"
import { Inter, Crimson_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nomee – Portable Partnership Proof for Professionals",
  description:
    "Close deals faster with verified partnership proof you can embed anywhere—your website, proposals, email signature, or portfolio. Positive-only. Lightweight. Built for the gig world.",
  keywords:
    "professional recognition platform, partnership trust proof, embed social proof, verified recommendations, freelancer credibility, consultant testimonials",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/images/nome-20icon.png",
        sizes: "any",
      },
      {
        url: "/images/nome-20icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: "/images/nome-20icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${crimsonPro.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
