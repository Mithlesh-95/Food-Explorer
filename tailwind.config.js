/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "on-primary-fixed": "#024932",
                "secondary-fixed-dim": "#c1dacb",
                "on-secondary": "#e6ffef",
                "on-tertiary-fixed-variant": "#2d676e",
                "primary-dim": "#205d45",
                "outline": "#737d76",
                "primary-fixed-dim": "#a4e2c2",
                "surface-tint": "#2e6a50",
                "surface-container": "#e8f0e9",
                "secondary": "#4d6458",
                "tertiary-dim": "#1e5b61",
                "secondary-dim": "#42584c",
                "on-primary-container": "#1e5c44",
                "on-secondary-fixed": "#2e4439",
                "inverse-primary": "#bfffde",
                "tertiary": "#2d676e",
                "surface-container-high": "#e2eae3",
                "primary": "#2e6a50",
                "on-secondary-container": "#40574b",
                "background": "#f7faf5",
                "outline-variant": "#aab4ad",
                "inverse-on-surface": "#9a9e9a",
                "surface-variant": "#dbe5dd",
                "primary-container": "#b1f0d0",
                "surface-container-low": "#eff5ef",
                "on-primary": "#e6ffef",
                "surface-dim": "#d2ddd5",
                "secondary-fixed": "#cfe9d9",
                "on-tertiary-fixed": "#034a51",
                "error-container": "#fa746f",
                "on-secondary-fixed-variant": "#4a6054",
                "on-error-container": "#6e0a12",
                "error": "#a83836",
                "error-dim": "#67040d",
                "inverse-surface": "#0b0f0d",
                "on-surface-variant": "#57615b",
                "primary-fixed": "#b1f0d0",
                "surface": "#f7faf5",
                "on-surface": "#2b352f",
                "tertiary-fixed": "#b8f2f9",
                "surface-container-lowest": "#ffffff",
                "on-background": "#2b352f",
                "tertiary-fixed-dim": "#aae4eb",
                "secondary-container": "#cfe9d9",
                "surface-bright": "#f7faf5",
                "on-tertiary-container": "#215d63",
                "on-error": "#fff7f6",
                "tertiary-container": "#b8f2f9",
                "on-tertiary": "#e9fdff",
                "surface-container-highest": "#dbe5dd",
                "on-primary-fixed-variant": "#2a664d",
                nutrition: {
                    a: '#15803d',
                    b: '#84cc16',
                    c: '#eab308',
                    d: '#f97316',
                    e: '#dc2626'
                }
            },
            fontFamily: {
                "headline": ["Manrope", "sans-serif"],
                "body": ["Inter", "sans-serif"],
                "label": ["Inter", "sans-serif"]
            },
            keyframes: {
                'scan-line': {
                    '0%': { top: '0%' },
                    '50%': { top: '100%' },
                    '100%': { top: '0%' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-left': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                }
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out forwards',
                'slide-in-left': 'slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scan-line': 'scan-line 3s linear infinite',
            }
        },
    },
    plugins: [],
}
