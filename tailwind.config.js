
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: "#194A9E",
        secondary: "#0CBD39",
        background: "#FCFCFC",
      },
      fontFamily: {
        sans: ["Open Sans"],
      },
      
    },
  },
  plugins: [],
};