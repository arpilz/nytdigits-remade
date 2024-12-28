/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /translate-./,
    },
  ],
  theme: {
    extend: {
      colors: {
        // i stole these colors from nyt
        "nytgreen":"#5f9c49",
        "yellowgreen": "#e0d95e",
        // but not this one. i changed it slightly
        "darkbg": "#202020",
        "lessdarkbg": "#4b4e52",
      },
      screens: {
        'xs': '420px',
      },
      keyframes: {
        pulseNum: {
          // the reason the end scaling is 1.075 is because i had to remove the border (you could see the border even though 
          // it was the same color?), the border is 3 pixels on each side (6 pixels total) and the circle itself was 80, 86/80 = 1.075
          '0%': { transform: "scale(1)"},
          '50%': { transform: "scale(0.95)" },
          '100%': {transform: "scale(1.075)"}
        },
        pulseBig: {
          '0%': { transform: "scale(1.075)"},
          '50%': {transform: "scale(1.2)"},
          '100%': {transform: "scale(1.05)"},
        },
        disappear: {
          '0%': {opacity: "1"},
          '99%': {opacity: "1"},
          '100%': {opacity: "0"},
        },
        upDown: {
          '0%': {transform: "translateY(0)"},
          '50%': {transform: "translateY(-4px)"},
          '100%': {transform: "translateY(0)"},
        },

      },
      animation: {
        pulseNum: 'pulseNum 150ms linear',
        pulseSmall: 'pulseNum 200ms linear',
        pulseBig: 'pulseBig 300ms linear 300ms',
        disappear: 'disappear 400ms linear',
        upDown: 'upDown 300ms ease-in',
      }
    },
  },
  plugins: [],
};