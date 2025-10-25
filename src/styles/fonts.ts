import { Cormorant_Garamond, Mulish } from "next/font/google"

export const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
})

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

