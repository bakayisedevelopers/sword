/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#101601',
          gold: '#DBFF54',
          light: '#F4F7D8',
        },
      },
      boxShadow: {
        soft: '0 12px 36px rgba(15, 23, 42, 0.2)',
      },
    },
  },
  plugins: [],
};
