import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        tertiary: "var(--color-bg-tertiary)",
      },
      textColor: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
      },
      borderColor: {
        primary: "var(--color-border-light)",
        default: "var(--color-border-default)",
        dark: "var(--color-border-dark)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
