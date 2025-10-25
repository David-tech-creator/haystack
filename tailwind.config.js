import { fontFamily } from "tailwindcss/defaultTheme"
import tailwindcssAnimate from "tailwindcss-animate"
import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./src/app/**/*.{ts,tsx,md,mdx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "2.5rem",
        lg: "3.5rem",
        xl: "4.5rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
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
        wheat: {
          50: "#fdf7ed",
          100: "#f8ebd3",
          200: "#f0d7a7",
          300: "#e5be73",
          400: "#dca34b",
          500: "#c78528",
          600: "#a6661d",
          700: "#805016",
          800: "#5b3910",
          900: "#39240a",
        },
      },
      fontFamily: {
        sans: ["var(--font-mulish)", ...fontFamily.sans],
        display: ["var(--font-cormorant)", "var(--font-mulish)", ...fontFamily.sans],
      },
      boxShadow: {
        "soft-lg": "0 25px 50px -12px rgba(13, 18, 33, 0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.navy.800"),
            a: {
              color: theme("colors.navy.700"),
              "&:hover": { color: theme("colors.navy.500") },
            },
            strong: { color: theme("colors.navy.900") },
            hr: { borderColor: theme("colors.navy.200") },
          },
        },
        invert: {
          css: {
            color: theme("colors.wheat.100"),
            a: {
              color: theme("colors.wheat.200"),
              "&:hover": { color: theme("colors.wheat.300") },
            },
            strong: { color: theme("colors.wheat.100") },
            hr: { borderColor: theme("colors.navy.600") },
          },
        },
      }),
    },
  },
  plugins: [tailwindcssAnimate, typography],
}

export default tailwindConfig

