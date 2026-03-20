/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
       animation: {
      'scroll-up':   'scrollUp 12s linear infinite',
      'scroll-down': 'scrollDown 12s linear infinite',
    },
     keyframes: {
      scrollUp: {
        '0%':   { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(-50%)' },
      },
      scrollDown: {
        '0%':   { transform: 'translateY(-50%)' },
        '100%': { transform: 'translateY(0)' },
      },
    },
    },
  },
  plugins: [],
}

