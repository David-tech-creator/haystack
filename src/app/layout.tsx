import type { Metadata, Viewport } from "next"

import { Providers } from "@/components/providers"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { mulish, cormorant, outfit } from "@/styles/fonts"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s — Haystack",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: "Haystack",
  icons: {
    icon: "/images/Haystack logo no text.png",
    shortcut: "/images/Haystack logo no text.png",
    apple: "/images/Haystack logo no text.png",
    other: [
      {
        rel: "mask-icon",
        url: "/images/Haystack logo no text.png",
        color: "#1f2640",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: "Haystack — Signal over noise for AI + data hiring",
    description: siteConfig.description,
    siteName: "Haystack",
    images: [
      {
        url: `${siteConfig.url}/api/og`,
        width: 1200,
        height: 630,
        alt: "Haystack—Find the needle. Faster.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@haystack_ai",
    creator: "@haystack_ai",
    title: "Haystack — Signal over noise for AI + data hiring",
    description: siteConfig.description,
    images: [`${siteConfig.url}/api/og`],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a2337" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1221" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans",
          mulish.variable,
          cormorant.variable,
          outfit.variable,
        )}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
