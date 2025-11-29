/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'pastel-pink': '#FFB6C1',
                'pastel-beige': '#F5E6D3',
                'pastel-lavender': '#E6E6FA',
                'soft-pink': '#FFC0CB',
                'warm-beige': '#F0E5D8',
                'light-purple': '#DCD0FF',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'pop-in': {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            transitionTimingFunction: {
                'apple': 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
            animation: {
                'fade-in': 'fade-in 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                'pop-in': 'pop-in 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                'slide-up': 'slide-up 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            },
        },
    },
    plugins: [],
}
