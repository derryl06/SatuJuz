import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0B0F10",
                stealth: {
                    DEFAULT: "#0B0F10",
                    surface: "#161616",
                    border: "rgba(255, 255, 255, 0.08)",
                },
                neon: {
                    DEFAULT: "#FFD60A",
                    glow: "rgba(255, 214, 10, 0.15)",
                },
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                'neon': '0 0 20px rgba(255, 214, 10, 0.2)',
                'premium': '0 20px 40px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
};
export default config;
