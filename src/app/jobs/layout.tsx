import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Jobs",
  description: "Explore AI-native and data-centric roles sourced by Haystack.",
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children
}
