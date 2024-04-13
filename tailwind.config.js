import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        brand: ["Fixed Sys", "monospace"],
        sans: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "3xl": "4rem",
        "2xl": "3rem",
        "xl": "2rem",
      },
      colors: {
        magenta: "#ff00ff",
        yellow: "#ffff00",
        cyan: "#00ffff",
        black: "#1C1820",
      }
    },
  },
  plugins: [typography],
};
