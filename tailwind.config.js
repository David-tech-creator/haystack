import { fontFamily } from "tailwindcss/defaultTheme"
import typography from "@tailwindcss/typography"

/**
 * Haystack 2026-10: cream paper, navy ink, one gold needle. Light only.
 * Tokens mirror the CSS variables in src/app/globals.css (DESIGN.md 2.1).
 * Hex literals here so opacity modifiers (ink/30, on-deep/30) work.
 * @type {import('tailwindcss').Config}
 */
const ink = "#1A2136"
const paper = "#F6F1E7"

const tailwindConfig = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper,
        raised: "#FBF8F2",
        linen: "#EDE5D3",
        line: { DEFAULT: "#DDD2BC", strong: "#C7B999" },
        ink: { DEFAULT: ink, soft: "#464D63", mute: "#5C6173" },
        deep: { DEFAULT: "#10152A", raised: "#1A2139", line: "rgba(246,241,231,0.14)" },
        "on-deep": { DEFAULT: paper, soft: "#C9C4B8" },
        gold: { DEFAULT: "#C29A3E", ink: "#7E5B12", light: "#E6C77A" },
        straw: "#D9BE7E",
        error: "#9B2C1F",

        // Backwards-compatible aliases for code not yet migrated. New code: use the names above.
        primary: { DEFAULT: ink, foreground: paper },
        background: paper,
        foreground: ink,
        cream: paper,
        card: "#FBF8F2",
        navy: { DEFAULT: ink, 700: ink, 800: ink, 900: ink },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ["var(--font-display)", "var(--font-sans)", ...fontFamily.sans],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 1.55rem + 4vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        display: ["clamp(2.25rem, 1.5rem + 3vw, 4rem)", { lineHeight: "1.04", letterSpacing: "-0.032em" }],
        h2: ["clamp(1.875rem, 1.35rem + 2vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.028em" }],
        h3: ["clamp(1.1875rem, 1.1rem + 0.4vw, 1.4375rem)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        lead: ["clamp(1.125rem, 1.05rem + 0.35vw, 1.3125rem)", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        body: ["1.0625rem", { lineHeight: "1.65", letterSpacing: "0" }],
        small: ["0.9375rem", { lineHeight: "1.55", letterSpacing: "0" }],
        label: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.16em" }],
      },
      maxWidth: {
        "prose-tight": "38rem",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "14px",
        lg: "20px",
      },
      boxShadow: {
        raise: "0 1px 0 rgba(26,33,54,0.04), 0 18px 40px -24px rgba(26,33,54,0.28)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#464D63",
            "--tw-prose-headings": ink,
            "--tw-prose-lead": "#464D63",
            "--tw-prose-links": ink,
            "--tw-prose-bold": ink,
            "--tw-prose-counters": "#5C6173",
            "--tw-prose-bullets": "#C29A3E",
            "--tw-prose-hr": "#DDD2BC",
            "--tw-prose-quotes": ink,
            "--tw-prose-quote-borders": "#C29A3E",
            "--tw-prose-captions": "#5C6173",
            "--tw-prose-code": ink,
            "--tw-prose-th-borders": "#C7B999",
            "--tw-prose-td-borders": "#DDD2BC",
            a: {
              textDecorationColor: "rgba(26,33,54,0.3)",
              textUnderlineOffset: "0.22em",
              "&:hover": { textDecorationColor: "currentColor" },
            },
            "h1, h2, h3, h4": { fontFamily: "var(--font-display)", fontWeight: "500", letterSpacing: "-0.02em" },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default tailwindConfig
