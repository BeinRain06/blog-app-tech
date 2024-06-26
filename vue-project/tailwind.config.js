/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xxsm: '180px',
      xsm: '375px',
      md: '768px'
    },

    extend: {}
  }
}
