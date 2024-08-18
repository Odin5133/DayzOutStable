/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        likeAnimation: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        dislikeAnimation: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(5px)" },
        },
      },
      animation: {
        like: "likeAnimation 0.5s ease",
        dislike: "dislikeAnimation 0.5s ease",
      },
    },
    colors: {
      text: "#e4f5fb",
      background: "#353d41",
      pseudobackground: "#181c1f",
      pseudobackground2: "#59676e",
      primary: "#FF90B3",
      secondary: "#fc88b4",
      accent: "#8220e1",
      accent2: "#46107b",
    },
    fontSize: {
      sm: "0.750rem",
      base: "1rem",
      lg: "1.15rem",
      xl: "1.333rem",
      "2xl": "1.777rem",
      "3xl": "2.369rem",
      "4xl": "3.158rem",
      "5xl": "4.210rem",
    },
    fontFamily: {
      heading: "Stylish",
      body: "Stylish",
    },
    fontWeight: {
      normal: "400",
      bold: "700",
    },
    backgroundImage: {
      hero: "url('./public/bg.jpg')",
      signinbg: "url('./public/Nebula.tv.jpg')",
    },
  },
  plugins: [],
};
