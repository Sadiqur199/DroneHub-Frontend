/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0066ff',
          hover: '#0052cc',
          light: '#e6f0ff',
          dark: '#1a1a2e',
          gray: '#6b7280',
        },
        surface: {
          bg: '#ffffff',
          card: '#ffffff',
          section: '#f7f8fa',
          dark: '#1a1a2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.08)',
        'nav': '0 1px 0 rgba(0,0,0,0.05)',
        'elevated': '0 20px 60px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
