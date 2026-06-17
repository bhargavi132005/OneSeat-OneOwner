/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'glow': '0 0 15px 0 rgba(168, 85, 247, 0.5)', // Custom purple glow for buttons
      },
    },
  },
  plugins: [],
}