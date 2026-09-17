/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      // Standard min-width screens matching FlutterFlow breakpoints
      sm: '479px',
      md: '767px',
      lg: '991px',
      xl: '1280px',
      '2xl': '1440px',

      // Explicit FlutterFlow range-specific screens
      'ff-phone': { max: '478px' },
      'ff-tablet': { min: '479px', max: '766px' },
      'ff-tablet-landscape': { min: '767px', max: '990px' },
      'ff-desktop': { min: '991px' },
    },
    extend: {
      colors: {
        'ff-primary': '#FFFFFF',
        'ff-secondary': '#192431',
        'ff-tertiary': '#C97303',
        'ff-alternate': '#C97303',
        'ff-primary-text': '#192431',
        'ff-secondary-text': '#FFFFFF',
        'ff-primary-bg': '#D4D4D4',
        'ff-secondary-bg': '#FFFFFF',
        'ff-accent1': 'transparent',
        'ff-accent2': 'rgba(2, 202, 121, 0.357)',
        'ff-accent3': 'rgba(238, 139, 96, 0.302)',
        'ff-accent4': 'rgba(38, 45, 52, 0.698)',
        'ff-success': '#249689',
        'ff-warning': '#F9CF58',
        'ff-error': '#FF5963',
        'ff-info': '#FFFFFF',
        'ff-canvas': '#FBFBFB',
        'ff-offwhite': '#FBFBFB',
      },
      borderRadius: {
        'ff-card': '30px',
        'ff-container': '24px',
        'ff-modal': '20px',
        'ff-pill': '50px',
        'ff-button': '40px',
        'ff-badge': '16px',
        'ff-sm': '12px',
        'ff-xs': '8px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
