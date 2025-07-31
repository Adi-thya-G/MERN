/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        "mobile":"400px"
      },
      keyframes: {
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)' },
          '40%': { transform: 'scale(1)' },
        },
      },animation: {
        bounceDot: 'bounceDot 1.4s infinite ease-in-out',
        'bounceDot-delay-1': 'bounceDot 1.4s infinite ease-in-out 0.2s',
        'bounceDot-delay-2': 'bounceDot 1.4s infinite ease-in-out 0.4s',
      },
    },
  },
  plugins: [],
}