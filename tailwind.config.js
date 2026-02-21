/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
        "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-app)",
                stealth: {
                    DEFAULT: "var(--bg-app)",
                    surface: "var(--surface-app)",
                    border: "var(--border-glass)",
                    'border-vibrant': "var(--border-glass-vibrant)",
                },
                neon: {
                    DEFAULT: "var(--accent-neon)",
                    glow: "var(--shadow-neon-glow)",
                },
                text: {
                    primary: "var(--text-primary)",
                    dim: "var(--text-dim)",
                    muted: "var(--text-muted)",
                }
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                'neon': '0 0 25px rgba(255, 214, 10, 0.25)',
                'premium': '0 20px 48px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                outfit: ['var(--font-outfit)', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
