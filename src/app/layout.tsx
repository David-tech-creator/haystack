import type { Metadata, Viewport } from "next"
import { Instrument_Serif, Inter, Inter_Tight } from "next/font/google"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { KEYWORDS, SITE, SITE_URL } from "@/lib/site"

import "./globals.css"

const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display", display: "optional" })
// Body face is not preloaded so the display face (the LCP h1) gets the bandwidth first.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap", preload: false })
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-serif",
  display: "optional",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  creator: SITE.name,
  publisher: SITE.name,
  category: "business",
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
}

export const viewport: Viewport = {
  themeColor: SITE.colors.cream,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // edge to edge on notched phones; .wrap, the header and the footer pad
  // themselves with env(safe-area-inset-*)
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body className="bg-paper font-sans text-body text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
