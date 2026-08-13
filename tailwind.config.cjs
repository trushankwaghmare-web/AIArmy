/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00b4d7',
        accent: '#33c3df',
      },
      spacing: {
        18: '4.5rem',
      }
    },
  },
  plugins: [],
}
