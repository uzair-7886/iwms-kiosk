/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#87C232',
        'secondary': '#222629',
        'cta': '#F5B041',
        'secondary-accent': '#618930',
        'highlight': '#FFD700',
        'tertiary-accent': '#6EC1E4',
        'light-bg': '#F5F5F5',
        'dark-text': '#1B1B1B',
        'muted-text': '#666666',
        'text': '#FFFFFF',
        'border': '#E0E0E0'
      },
    },
  },
  plugins: [],
}