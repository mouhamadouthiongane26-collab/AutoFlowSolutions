import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F1A",
        mist: "#111827",
        line: "rgba(148, 163, 184, 0.22)",
        brand: "#2563EB",
        violet: "#7C3AED",
        pulse: "#06B6D4",
        cloud: "#0B0F1A",
        slatecopy: "#CBD5E1"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(37, 99, 235, 0.20)",
        glow: "0 0 28px rgba(6, 182, 212, 0.32)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(37, 99, 235, 0.34)" },
          "50%": { boxShadow: "0 0 42px rgba(6, 182, 212, 0.48)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(280%)" }
        }
      },
      animation: {
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        scan: "scan 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
