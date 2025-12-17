import React, { useState, useEffect, useRef } from 'react';
import { InfoIcon } from '../icons/Icons';

/**
 * Premium InfoButton - tooltip appears BELOW, with compact mode support
 * Fixed: Better positioning, touch handling, viewport boundary detection
 * NEW: position prop for left/right alignment
 * @param {object} props
 * @param {React.ReactNode} props.children - Tooltip content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.compact - If true, uses compact positioning
 * @param {string} props.position - 'left' or 'right' for tooltip alignment
 */
const InfoButton = ({ children, className = '', compact = false, position = 'right' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const buttonRef = useRef(null);
    const tooltipRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            // Small delay for animation to work properly
            requestAnimationFrame(() => setIsAnimating(true));
        }
    }, [isVisible]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const handleOpen = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsVisible(true);
    };

    const handleClose = () => {
        setIsAnimating(false);
        closeTimeoutRef.current = setTimeout(() => setIsVisible(false), 200);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isVisible) {
            handleClose();
        } else {
            handleOpen();
        }
    };

    // Close on outside click for mobile
    useEffect(() => {
        if (!isVisible) return;

        const handleOutsideClick = (e) => {
            if (
                buttonRef.current && !buttonRef.current.contains(e.target) &&
                tooltipRef.current && !tooltipRef.current.contains(e.target)
            ) {
                handleClose();
            }
        };

        // Use a small delay to avoid immediate close on the same tap
        const timer = setTimeout(() => {
            document.addEventListener('touchstart', handleOutsideClick);
            document.addEventListener('click', handleOutsideClick);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('touchstart', handleOutsideClick);
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isVisible]);

    // Determine positioning based on position prop
    const isLeftAligned = position === 'left';

    return (
        <div className={`relative ${className}`}>
            {/* Button */}
            <button
                ref={buttonRef}
                className={`
                    p-1.5 rounded-lg
                    text-gray-400 hover:text-gray-600
                    bg-white/40 backdrop-blur-xs
                    border border-white/40
                    shadow-sm hover:shadow-md hover:bg-white/70
                    transition-all duration-200 ease-bouncy
                    active:scale-90
                    touch-manipulation
                    ${isVisible ? 'text-gray-600 bg-white/70 shadow-md' : ''}
                `}
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                onClick={handleToggle}
                onTouchEnd={handleToggle}
                aria-label="Info"
            >
                <InfoIcon className={`w-4 h-4 transition-transform duration-200 ${isVisible ? 'scale-110' : ''}`} />
            </button>

            {/* Tooltip - BELOW the button - z-index above theme overlays */}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`
                        absolute z-50 p-3
                        bg-white/95 backdrop-blur-glass
                        rounded-xl
                        shadow-premium border border-white/60
                        text-sm text-gray-600
                        transition-all duration-200 ease-bouncy
                        ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}
                        w-52 max-w-[calc(100vw-2rem)]
                        ${isLeftAligned ? 'left-0' : 'right-0'}
                    `}
                    style={{
                        top: 'calc(100% + 8px)',
                    }}
                    onMouseEnter={handleOpen}
                    onMouseLeave={handleClose}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Arrow pointing UP */}
                    <div
                        className="absolute w-2.5 h-2.5 bg-white/95 transform rotate-45 border-l border-t border-white/60"
                        style={{
                            top: '-5px',
                            [isLeftAligned ? 'left' : 'right']: '10px'
                        }}
                    />
                    {children}
                </div>
            )}
        </div>
    );
};

export default InfoButton;
