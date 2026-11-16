/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1efe8',
          500: '#2d8a63',
          700: '#1b5e43',
          900: '#0f3827',
        },
        slatebg: '#0f172a'
      }
    },
  },
  plugins: [],
}
