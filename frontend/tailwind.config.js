/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#171717',
        surface: '#0f0f0f',
        border: '#2e2e2e',
        'border-subtle': '#242424',
        'border-prominent': '#363636',
        'text-primary': '#fafafa',
        'text-secondary': '#b4b4b4',
        'text-muted': '#898989',
        brand: '#3ecf8e',
        'brand-link': '#00c573',
        'brand-border': 'rgba(62, 207, 142, 0.3)',
      },
      fontFamily: {
        sans: ['Circular', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Source Code Pro', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '12px',
      },
    },
  },
  plugins: [],
}
