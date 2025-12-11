import React, { useState, useRef } from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    fullWidth = false,
    icon = null,
    loading = false
}) => {
    const [ripples, setRipples] = useState([]);
    const buttonRef = useRef(null);

    const handleClick = (e) => {
        if (disabled || loading) return;

        // Create ripple effect
        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rippleId = Date.now();

        setRipples(prev => [...prev, { id: rippleId, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
        }, 600);

        if (onClick) onClick(e);
    };

    const variants = {
        primary: `
            bg-gradient-to-br from-pastel-pink via-pastel-coral to-pastel-pink
            text-white
            shadow-md hover:shadow-lg
            hover:from-pastel-pink-shadow hover:via-pastel-coral hover:to-pastel-pink-shadow
        `,
        secondary: `
            bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-blue
            text-gray-700
            shadow-md hover:shadow-lg
        `,
        neutral: `
            bg-white/80 backdrop-blur-sm
            text-gray-700
            border border-gray-200/50
            shadow-sm hover:shadow-md
            hover:bg-white
        `,
        ghost: `
            bg-transparent
            text-gray-500
            hover:bg-gray-100/50
            hover:text-gray-700
        `,
        success: `
            bg-gradient-to-br from-pastel-mint via-green-300 to-pastel-mint
            text-green-800
            shadow-md hover:shadow-lg
        `,
        danger: `
            bg-gradient-to-br from-red-400 via-red-500 to-red-400
            text-white
            shadow-md hover:shadow-lg
        `
    };

    const sizes = {
        sm: 'py-2 px-4 text-sm rounded-xl',
        md: 'py-3 px-6 text-base rounded-2xl',
        lg: 'py-4 px-8 text-lg rounded-2xl'
    };

    const baseStyles = `
        relative
        overflow-hidden
        font-bold
        tracking-wide
        inline-flex
        items-center
        justify-center
        gap-2
        transition-all
        duration-200
        ease-bouncy
        active:scale-95
        hover:-translate-y-0.5
    `;

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            disabled={disabled || loading}
            className={`
                ${baseStyles}
                ${variants[variant] || variants.primary}
                ${sizes[size] || sizes.md}
                ${fullWidth ? 'w-full' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0 active:scale-100' : 'cursor-pointer'}
                ${className}
            `}
        >
            {/* Shimmer overlay on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 -skew-x-12" />

            {/* Ripple effects */}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 10,
                        height: 10,
                        marginLeft: -5,
                        marginTop: -5
                    }}
                />
            ))}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                ) : icon}
                {children}
            </span>
        </button>
    );
};

export default Button;
