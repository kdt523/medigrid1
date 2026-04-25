/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medic-bg': '#0A0E1A',
        'medic-surface': '#111827',
        'medic-border': '#1F2937',
        'medic-primary': '#06B6D4',
      },
      boxShadow: {
        'cyan-glow-light': '0 0 15px rgba(6, 182, 212, 0.1)',
        'cyan-glow': '0 0 10px rgba(6, 182, 212, 0.4)',
        'danger-glow': '0 0 8px rgba(239, 68, 68, 0.8)',
      }
    },
  },
  plugins: [],
}
