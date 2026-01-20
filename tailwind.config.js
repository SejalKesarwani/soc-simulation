/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0b1220',
        slate: '#111827',
        signal: '#0ea5e9',
        alert: '#ef4444',
        success: '#22c55e',
      },
    },
  },
  plugins: [],
};
