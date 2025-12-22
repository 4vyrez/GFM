import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { InfoIcon } from '../icons/Icons';

/**
 * Premium InfoButton - tooltip appears BELOW, with compact mode support
 * PORTAL-BASED: Renders tooltip in a portal to prevent clipping by parent overflow
 * Uses fixed positioning relative to viewport for accurate placement
 * @param {object} props
 * @param {React.ReactNode} props.children - Tooltip content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.compact - If true, uses compact positioning
 * @param {string} props.position - 'left', 'right', or 'auto' for tooltip alignment
 */
const InfoButton = ({ children, className = '', compact = false, position = 'auto' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [tooltipStyles, setTooltipStyles] = useState({ top: 0, left: 0, arrowLeft: 10 });
    const buttonRef = useRef(null);
    const tooltipRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            // Small delay for animation to work properly
            requestAnimationFrame(() => setIsAnimating(true));
        }
    }, [isVisible]);

    // Calculate tooltip position using fixed positioning (relative to viewport)
    useLayoutEffect(() => {
        if (!isVisible || !buttonRef.current) return;

        const calculatePosition = () => {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const tooltipWidth = 208; // w-52 = 13rem = 208px
            const viewportWidth = window.innerWidth;
            const padding = 16; // Minimum padding from screen edge

            // Position below the button with 8px gap
            const top = buttonRect.bottom + 8;

            let left = 0;
            let arrowLeft = 10;

            if (position === 'left') {
                // Align tooltip to the left of the button
                left = buttonRect.left;
                arrowLeft = buttonRect.width / 2 - 5;

                // Check if tooltip would overflow right edge
                if (left + tooltipWidth > viewportWidth - padding) {
                    const overflow = (left + tooltipWidth) - (viewportWidth - padding);
                    left = left - overflow;
                    arrowLeft = arrowLeft + overflow;
                }

                // Check if tooltip would overflow left edge
                if (left < padding) {
                    const shift = padding - left;
                    left = padding;
                    arrowLeft = arrowLeft - shift;
                }

                // Clamp arrow within tooltip bounds
                arrowLeft = Math.max(10, Math.min(tooltipWidth - 20, arrowLeft));
            } else if (position === 'right') {
                // Align tooltip right edge with button right edge
                left = buttonRect.right - tooltipWidth;
                arrowLeft = tooltipWidth - buttonRect.width / 2 - 5;

                // Check if tooltip would overflow left edge
                if (left < padding) {
                    const shift = padding - left;
                    left = padding;
                    arrowLeft = arrowLeft - shift;
                }

                // Check if tooltip would overflow right edge
                if (left + tooltipWidth > viewportWidth - padding) {
                    const overflow = (left + tooltipWidth) - (viewportWidth - padding);
                    left = left - overflow;
                    arrowLeft = arrowLeft + overflow;
                }

                // Clamp arrow within tooltip bounds
                arrowLeft = Math.max(10, Math.min(tooltipWidth - 20, arrowLeft));
            } else {
                // Auto positioning - center tooltip under button if possible
                left = buttonRect.left + buttonRect.width / 2 - tooltipWidth / 2;

                // Check left overflow
                if (left < padding) {
                    left = padding;
                }

                // Check right overflow
                if (left + tooltipWidth > viewportWidth - padding) {
                    left = viewportWidth - padding - tooltipWidth;
                }

                // Calculate arrow position relative to button center
                arrowLeft = buttonRect.left + buttonRect.width / 2 - left - 5;

                // Clamp arrow position within tooltip bounds
                arrowLeft = Math.max(10, Math.min(tooltipWidth - 20, arrowLeft));
            }

            setTooltipStyles({ top, left, arrowLeft });
        };

        calculatePosition();

        // Recalculate on resize and scroll (passive for performance)
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition, { capture: true, passive: true });
        return () => {
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition, { capture: true });
        };
    }, [isVisible, position]);

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

    // Tooltip rendered via portal for proper layering and no clipping
    const tooltip = isVisible ? createPortal(
        <div
            ref={tooltipRef}
            className={`
                fixed z-[9999] p-3
                bg-white/95 backdrop-blur-glass
                rounded-xl
                shadow-premium border border-white/60
                text-sm text-gray-600 leading-relaxed
                transition-all duration-200 ease-bouncy
                ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}
                w-52
            `}
            style={{
                top: `${tooltipStyles.top}px`,
                left: `${tooltipStyles.left}px`,
            }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Arrow pointing UP - dynamically positioned */}
            <div
                className="absolute w-2.5 h-2.5 bg-white/95 transform rotate-45 border-l border-t border-white/60"
                style={{
                    top: '-5px',
                    left: `${tooltipStyles.arrowLeft}px`
                }}
            />
            {children}
        </div>,
        document.body
    ) : null;

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

            {/* Tooltip rendered via portal */}
            {tooltip}
        </div>
    );
};

export default InfoButton;

