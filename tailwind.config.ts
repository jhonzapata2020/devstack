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
        unad: {
          blue: {
            DEFAULT: "#005691",
            dark: "#003254",
            light: "#0078b8",
            navy: "#0a192f",
          },
          yellow: {
            DEFAULT: "#f39200",
            light: "#ffb81c",
            gold: "#e88000",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
