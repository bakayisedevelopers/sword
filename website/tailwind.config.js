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
        soft: '0 10px 30px rgba(25, 36, 49, 0.12)',
      },
    },
  },
  plugins: [],
};
