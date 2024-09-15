const defaultTheme = require("./node_modules/@tailwindcss/forms");

/** @type {import('tailwindcss').Config} */
module.exports = { 
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}","./node_modules/flowbite/**/*.js"],
 
  theme: { 
    extend: {  
      textOpacity: ['dark'],
       fontFamily: {
        sans: ["Inter var"],
      },
    },
  },
  plugins: [
  require('flowbite/plugin'),
  require("daisyui"), 
  require("@tailwindcss/forms")],
};
