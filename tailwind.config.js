/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: { 
      keyframes: {
        hbeat: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },

      animation: {
        hbeat: "hbeat 1s ease-in-out ",
      },
    },
    screens: {
      "2xs": "120px",
      xs: "360px",
      sm: "768px", // => @media (min-width: 640px) { ... }
      md: "1024px", // => @media (min-width: 1024px) { ... }
      lg: "1200px", // => @media (min-width: 1280px) { ... }
      xl: "1440px", // => @media (min-width: 1536px) { ... }
    },
    colors: {
      lime: "#3BB143",
      white: "#fff",
      red: "#FF0000",
      skyblue: "#f5f7f7",
      orange: "#E34A27",
      light_gray: "#d5d0d0",
      black: "#000000",
      secondary: "#666666",
      light_green: "#c4fbc4",
      yellow_rating: "#f4cb45",
      lightgray: "#545454",
      darkgray: "#3f3f3f",
      candy: "#D21404",
      lava_grey: "#989898",
      lightest_grey: "#e2e2e2",
      light_gray: "#313131",
      gryColour: "#8F8F8F",
      RedColour: "#ff0000",
      graycol: "#9A9A9A",
      green_light: "#a3183d",
      customGreen: "rgb(12, 166, 31)",
      customBlack: "rgb(28, 28, 28)",
      lightGrays: "rgb(41, 61, 41)",
      lightSky: "#0072A0",
      skybluelight: "#ADD8E6",
      Crayola_blue: "#1778F2",
      Light_BLUE: "#1D9BF0",
      gmail_color: "#EA4335",
      graycolor: "rgba(0,0,0,.6)",
      blackColour: "#000",
      GreenColour: "#00b259",
      lightGrayBlinkit: "#333",
      GrayBlinkit: "#666",
      yellowAwaiting: "#FFDC56",
      RedColour: "#FF0000",
      bluecolour:"#1877f2",
      colorGray: "rgb(255, 255, 255)",
    },
    borderColor: {
      default: "#CDCDCE",
      green: "#7FFF00",
      light_gray: "#D3D3D3",
      lightGrays: "rgb(41, 61, 41)",
      lime: "#3BB143",
      light_green: "#8AFF8A",
      border_gray: "rgba(0,0,0,.1)",
      GrayBlinkit: "#666",
      GreenBlinkit: "rgb(12, 131, 31)",
      RedColour: "#FF0000",
    },
    bgColour :{
      offWhite : "#FAF9F6"
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      okra: ["Okra-Medium", "sans-serif"],
    },
  },
  plugins: [],
};
