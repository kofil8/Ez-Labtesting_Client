import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
    },
    extend: {
        colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Premium Medical Theme Colors
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Status Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        // Legacy Mappings (for backward compatibility if needed)
        "lab-blue": "hsl(var(--lab-blue))",
        "lab-green": "hsl(var(--lab-green))",
        "lab-teal": "hsl(var(--lab-teal))",
        "lab-cyan": "hsl(var(--lab-cyan))",
      },
      // Typography Scale
      fontSize: {
        // Display & Headings
        display: [
          "2.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h1: [
          "2rem",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        h2: [
          "1.5rem",
          { lineHeight: "1.33", letterSpacing: "0em", fontWeight: "600" },
        ],
        h3: [
          "1.25rem",
          { lineHeight: "1.4", letterSpacing: "0em", fontWeight: "600" },
        ],
        h4: [
          "1.125rem",
          { lineHeight: "1.44", letterSpacing: "0em", fontWeight: "600" },
        ],
        // Body Text
        "body-lg": [
          "1.125rem",
          { lineHeight: "1.56", letterSpacing: "0em", fontWeight: "400" },
        ],
        body: [
          "1rem",
          { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" },
        ],
        "body-sm": [
          "0.875rem",
          { lineHeight: "1.43", letterSpacing: "0em", fontWeight: "400" },
        ],
        // Utility Text
        caption: [
          "0.75rem",
          { lineHeight: "1.33", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        label: [
          "0.875rem",
          { lineHeight: "1.43", letterSpacing: "0.005em", fontWeight: "500" },
        ],
        button: [
          "1rem",
          { lineHeight: "1.5", letterSpacing: "0.01em", fontWeight: "600" },
        ],
      },
      // Spacing System (4px base)
      spacing: {
        "0.5": "0.125rem", // 2px
        "18": "4.5rem", // 72px
        "88": "22rem", // 352px
        "100": "25rem", // 400px
        "112": "28rem", // 448px
        "128": "32rem", // 512px
      },
      // Border Radius System
      borderRadius: {
        xs: "0.125rem", // 2px
        sm: "0.25rem", // 4px
        DEFAULT: "0.375rem", // 6px
        md: "0.375rem", // 6px
        lg: "0.75rem", // 12px (DEFAULT for design system)
        xl: "1rem", // 16px
        "2xl": "1.25rem", // 20px
        "3xl": "1.5rem", // 24px
      },
      // Shadow System (Elevation-based)
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        // Medical-specific shadows
        success: "0 2px 8px rgba(22, 163, 74, 0.15)",
        warning: "0 2px 8px rgba(245, 158, 11, 0.15)",
        error: "0 2px 8px rgba(220, 38, 38, 0.15)",
        info: "0 2px 8px rgba(14, 165, 233, 0.15)",
        glass: "0 8px 32px rgba(14, 165, 233, 0.12)",
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
      // Touch Target Sizes (Accessibility)
      minHeight: {
        touch: "2.75rem", // 44px minimum touch target
        "touch-desktop": "2.25rem", // 36px desktop minimum
      },
      minWidth: {
        touch: "2.75rem",
        "touch-desktop": "2.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
