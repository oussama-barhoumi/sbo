export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          600: "#4f46e5",
          700: "#4338ca",
          950: "#1e1b4b",
        },
        harbor: {
          50: "#f8fafc",
          200: "#e2e8f0",
          300: "#cbd5f5",
          400: "#94a3b8",
          950: "#020617",
        },
        accent: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },

      boxShadow: {
        float: "0 10px 25px rgba(0,0,0,0.25)",
        glass: "0 8px 32px rgba(255,255,255,0.1)",
        "glass-hover": "0 12px 40px rgba(255,255,255,0.2)",
        card: "0 10px 30px rgba(0,0,0,0.1)",
        "card-hover": "0 20px 40px rgba(0,0,0,0.15)",
      },

      backdropBlur: {
        glass: "12px",
        heavy: "20px",
      },
    },
  },
  plugins: [],
};