/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#192431',
          gold: '#C97303',
          light: '#F7F8FA',
        },
      },
      boxShadow: {
        soft: '0 12px 36px rgba(15, 23, 42, 0.2)',
      },
    },
  },
  plugins: [],
};
