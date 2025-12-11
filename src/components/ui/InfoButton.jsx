import React, { useState, useEffect, useRef } from 'react';
import { InfoIcon } from '../icons/Icons';

/**
 * Premium InfoButton component with glass morphism tooltip
 * Uses hover on desktop, press on mobile
 */
const InfoButton = ({ children, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 200);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                className={`
                    p-2 rounded-xl
                    text-gray-400
                    hover:text-gray-600
                    bg-white/50 backdrop-blur-xs
                    border border-white/50
                    shadow-sm
                    hover:shadow-md hover:bg-white/80
                    transition-all duration-200 ease-bouncy
                    active:scale-90
                    ${isVisible ? 'text-gray-600 bg-white/80 shadow-md' : ''}
                `}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={handleClose}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isVisible) {
                        handleClose();
                    } else {
                        setIsVisible(true);
                    }
                }}
            >
                <InfoIcon className={`w-5 h-5 transition-transform duration-200 ${isVisible ? 'scale-110' : ''}`} />
            </button>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`
                        absolute z-50 w-64 p-4
                        bg-white/90 backdrop-blur-glass
                        rounded-2xl
                        shadow-premium border border-white/60
                        text-sm text-gray-600
                        transition-all duration-200 ease-bouncy
                        ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}
                    `}
                    style={{
                        top: 'calc(100% + 12px)',
                        right: 0
                    }}
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={handleClose}
                >
                    {children}

                    {/* Premium arrow */}
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white/90 backdrop-blur-glass transform rotate-45 border-l border-t border-white/60 shadow-sm" />
                </div>
            )}
        </div>
    );
};

export default InfoButton;
