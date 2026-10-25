import { fontFamily } from "tailwindcss/defaultTheme"
import typography from "@tailwindcss/typography"

/**
 * Haystack's own palette (from the October 2025 site): cream paper, navy ink,
 * the logo's gold straw. Light only.
 * @type {import('tailwindcss').Config}
 */
const tailwindConfig = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: "hsl(var(--secondary))",
        card: "#fef8ec",
        paper: "#fefbf4",
        cream: "#f6f0e2",
        surface: "#fdf9ef",
        chip: "#efe4cf",
        tag: "#e8d8b8",
        line: "#e3d7be",
        deep: "#10162a",
        gold: {
          DEFAULT: "#c9a046",
          bar: "#f4ca64",
          pill: "#f6d891",
          muted: "#cbbd9e",
          ink: "#8a6418",
        },
        navy: {
          50: "#f3f4f7",
          100: "#e8ebf2",
          200: "#cdd4e3",
          300: "#aab5ce",
          400: "#8592b6",
          500: "#5f6b9b",
          600: "#3d4970",
          700: "#27324d",
          800: "#1a2337",
          900: "#0d1221",
        },
      },
      fontFamily: {
        sans: ["var(--font-mulish)", ...fontFamily.sans],
        display: ["var(--font-outfit)", "var(--font-mulish)", ...fontFamily.sans],
        script: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 40px -18px rgba(13, 18, 33, 0.28)",
      },
    },
  },
  plugins: [typography],
}

export default tailwindConfig
