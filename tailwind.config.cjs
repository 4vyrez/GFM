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
        },
    },
    plugins: [],
}
