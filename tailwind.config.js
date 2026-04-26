/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          base: "#0f0f13",
          card: "#1a1a24",
          neon: "#00f3ff",
          pink: "#ff00ff",
        },
      },
      boxShadow: {
        neon: "0 0 10px #00f3ff, 0 0 20px #00f3ff",
        "neon-pink": "0 0 10px #ff00ff, 0 0 20px #ff00ff",
      },
    },
  },
  plugins: [],
}
