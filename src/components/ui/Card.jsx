import React from 'react';

const Card = ({
    children,
    className = '',
    padding = 'p-6',
    variant = 'default', // 'default' | 'glass' | 'solid'
    hover = false,
    glow = false,
    glowColor = 'pink' // 'pink' | 'orange' | 'blue'
}) => {
    const baseStyles = `
        rounded-3xl
        transition-all duration-300 ease-apple
        ${padding}
    `;

    const variantStyles = {
        default: `
            bg-white/85 backdrop-blur-glass
            border border-white/60
            shadow-glass
        `,
        glass: `
            bg-white/60 backdrop-blur-premium
            border border-white/40
            shadow-premium
        `,
        solid: `
            bg-white
            border-2 border-gray-100
            shadow-lg
        `
    };

    const hoverStyles = hover ? `
        hover:shadow-glass-hover
        hover:-translate-y-1
        hover:scale-[1.01]
        hover:bg-white/90
        cursor-pointer
    ` : '';

    const glowStyles = glow ? {
        pink: 'shadow-glow-pink',
        orange: 'shadow-glow-orange',
        blue: 'shadow-glow-blue'
    }[glowColor] : '';

    return (
        <div className={`
            ${baseStyles}
            ${variantStyles[variant] || variantStyles.default}
            ${hoverStyles}
            ${glowStyles}
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;
