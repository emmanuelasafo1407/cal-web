import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#002147",   // Deep Navy Storefront Base
          gold: "#D4AF37",   // Premium Metallic Trim Accent
          slate: "#0f172a"   // Charcoal Footer / Admin panel
        }
      },
    },
  },
  plugins: [],
};
export default config;