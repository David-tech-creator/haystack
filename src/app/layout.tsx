import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Mulish, Outfit } from "next/font/google"

import { ParticleStage } from "@/components/particles"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { KEYWORDS, SITE, SITE_URL } from "@/lib/site"

import "./globals.css"

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-outfit", display: "swap" })
const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish", display: "swap" })
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
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

/**
 * Sets data-particles="on" before first paint when the field will run, so the
 * sticky formation layout is in place from the start instead of shifting after
 * hydration (CLS). ParticleStage still switches it to "off" on any failure.
 */
const PARTICLES_BOOT = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'WebGL2RenderingContext' in window){document.documentElement.setAttribute('data-particles','on')}}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${mulish.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PARTICLES_BOOT }} />
      </head>
      <body className="font-sans text-[17px] leading-relaxed text-primary antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* One fixed particle field behind every page (decoration, aria-hidden). */}
        <ParticleStage />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
