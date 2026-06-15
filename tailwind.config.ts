import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Forge / steel inspired palette
        steel: {
          50: "#f6f7f8",
          100: "#eaecef",
          200: "#d3d7dd",
          300: "#aeb5c0",
          400: "#828d9d",
          500: "#647082",
          600: "#4f596b",
          700: "#414957",
          800: "#393f4a",
          900: "#23272e",
          950: "#15171c",
        },
        forge: {
          // warm copper / ember accent
          50: "#fdf6ed",
          100: "#f7e6cf",
          200: "#eecba0",
          300: "#e3a866",
          400: "#d9863a",
          500: "#c96a1f",
          600: "#b45309",
          700: "#943f12",
          800: "#793316",
          900: "#642c16",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
