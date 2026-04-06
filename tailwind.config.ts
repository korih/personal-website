import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        "bg-elev": "hsl(var(--bg-elev))",
        fg: "hsl(var(--fg))",
        "fg-muted": "hsl(var(--fg-muted))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "hsl(var(--fg))",
            a: { color: "hsl(var(--fg))", textDecoration: "underline" },
            "h1,h2,h3,h4": { color: "hsl(var(--fg))" },
            code: { color: "hsl(var(--fg))", background: "hsl(var(--bg-elev))" },
            blockquote: { borderColor: "hsl(var(--border))", color: "hsl(var(--fg-muted))" },
            hr: { borderColor: "hsl(var(--border))" },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
