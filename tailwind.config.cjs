/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                pastel: {
                    pink: '#FFB7C5',
                    'pink-shadow': '#F48FB1',
                    'pink-glow': '#FFD6E0',
                    blue: '#AEC6CF',
                    'blue-shadow': '#90A4AE',
                    'blue-glow': '#D4E5F7',
                    lavender: '#E6E6FA',
                    'lavender-shadow': '#D1C4E9',
                    'lavender-glow': '#F3F0FF',
                    peach: '#FFDAB9',
                    'peach-shadow': '#FFCC80',
                    'peach-glow': '#FFF0E0',
                    mint: '#BDFCC9',
                    'mint-shadow': '#A5D6A7',
                    'mint-glow': '#E0FFE8',
                    yellow: '#FFF176',
                    'yellow-shadow': '#FDD835',
                    coral: '#FF7F7F',
                    'coral-shadow': '#FF6B6B',
                },
                // Premium neutrals
                surface: '#FFFFFF',
                'surface-shadow': '#E5E5E5',
                'surface-glass': 'rgba(255, 255, 255, 0.7)',
                border: '#E5E5E5',
                // Accent colors
                accent: {
                    gold: '#FFD700',
                    'gold-shadow': '#FFA000',
                    rose: '#FF6B9D',
                    violet: '#A855F7',
                },
            },
            fontFamily: {
                sans: ['"Nunito"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                serif: ['"Lora"', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
            },
            borderWidth: {
                '3': '3px',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
                'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
                'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 20px -2px rgba(0, 0, 0, 0.05), 0 20px 40px -4px rgba(0, 0, 0, 0.05)',
                'premium-hover': '0 8px 12px -1px rgba(0, 0, 0, 0.07), 0 16px 32px -2px rgba(0, 0, 0, 0.07), 0 28px 56px -4px rgba(0, 0, 0, 0.07)',
                'glow-pink': '0 0 20px rgba(255, 183, 197, 0.5), 0 0 40px rgba(255, 183, 197, 0.3)',
                'glow-orange': '0 0 20px rgba(255, 152, 0, 0.5), 0 0 40px rgba(255, 152, 0, 0.3)',
                'glow-blue': '0 0 20px rgba(174, 198, 207, 0.5), 0 0 40px rgba(174, 198, 207, 0.3)',
                'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.3)',
            },
            backdropBlur: {
                'xs': '2px',
                'glass': '12px',
                'premium': '20px',
            },
            animation: {
                // Existing
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'pop-in': 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'bounce-subtle': 'bounceSubtle 2s infinite',
                // Premium new animations
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'spin-slow': 'spin 8s linear infinite',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'spring-bounce': 'springBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'flip-in': 'flipIn 0.6s ease-out forwards',
                'slide-in-right': 'slideInRight 0.5s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
                'slide-in-up': 'slideInUp 0.5s ease-out forwards',
                'slide-in-down': 'slideInDown 0.5s ease-out forwards',
                'gradient-shift': 'gradientShift 8s ease infinite',
                'confetti': 'confetti 1s ease-out forwards',
                'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
                'flame-flicker': 'flameFlicker 0.3s ease-in-out infinite alternate',
                'ripple': 'ripple 0.6s ease-out forwards',
                'text-reveal': 'textReveal 0.8s ease-out forwards',
                'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
                'stagger-fade': 'staggerFade 0.5s ease-out forwards',
                'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
                '3d-flip': 'flip3d 0.6s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                popIn: {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(-5%)' },
                    '50%': { transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '25%': { transform: 'translateY(-6px) rotate(1deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(0deg)' },
                    '75%': { transform: 'translateY(-4px) rotate(-1deg)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
                    '50%': { opacity: '0.85', filter: 'brightness(1.2)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                springBounce: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                flipIn: {
                    '0%': { transform: 'perspective(400px) rotateY(90deg)', opacity: '0' },
                    '100%': { transform: 'perspective(400px) rotateY(0deg)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInDown: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                confetti: {
                    '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '14%': { transform: 'scale(1.15)' },
                    '28%': { transform: 'scale(1)' },
                    '42%': { transform: 'scale(1.15)' },
                    '70%': { transform: 'scale(1)' },
                },
                flameFlicker: {
                    '0%': { transform: 'scaleY(1) scaleX(1)', filter: 'brightness(1)' },
                    '50%': { transform: 'scaleY(1.02) scaleX(0.98)', filter: 'brightness(1.1)' },
                    '100%': { transform: 'scaleY(0.98) scaleX(1.02)', filter: 'brightness(0.95)' },
                },
                ripple: {
                    '0%': { transform: 'scale(0)', opacity: '0.6' },
                    '100%': { transform: 'scale(4)', opacity: '0' },
                },
                textReveal: {
                    '0%': { opacity: '0', transform: 'translateY(10px)', filter: 'blur(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '20%': { transform: 'scale(1.1)' },
                    '40%': { transform: 'scale(0.9)' },
                    '60%': { transform: 'scale(1.03)' },
                    '80%': { transform: 'scale(0.97)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                staggerFade: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                kenBurns: {
                    '0%': { transform: 'scale(1) translate(0, 0)' },
                    '100%': { transform: 'scale(1.1) translate(-2%, -1%)' },
                },
                flip3d: {
                    '0%': { transform: 'perspective(600px) rotateY(180deg)', opacity: '0' },
                    '100%': { transform: 'perspective(600px) rotateY(0deg)', opacity: '1' },
                },
            },
            transitionTimingFunction: {
                'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                'bouncy': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '1200': '1200ms',
            },
            scale: {
                '102': '1.02',
                '103': '1.03',
                '98': '0.98',
            },
        },
    },
    plugins: [],
}
