/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0d0d0d',
        charcoal: '#1a1a1a',
        steel: '#2b2b2b',
        ignition: '#ff6a13',   // primary orange accent
        ignitionDark: '#d9550a',
        chrome: '#e8e8e8',
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
