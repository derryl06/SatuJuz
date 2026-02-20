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
                background: "#0B0F1A",
                glass: {
                    light: "rgba(255, 255, 255, 0.12)",
                    DEFAULT: "rgba(255, 255, 255, 0.08)",
                    dark: "rgba(255, 255, 255, 0.06)",
                },
                hairline: "rgba(255, 255, 255, 0.15)",
            },
            backgroundImage: {
                "glass-gradient": "linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
            },
            backdropBlur: {
                glass: "24px",
            },
        },
    },
    plugins: [],
};
export default config;
