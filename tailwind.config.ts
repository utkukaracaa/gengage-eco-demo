import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "eco-green": "#16a34a",
        "eco-teal": "#0d9488",
        "eco-amber": "#d97706",
        "eco-red": "#dc2626",
      },
    },
  },
  plugins: [],
};
export default config;
