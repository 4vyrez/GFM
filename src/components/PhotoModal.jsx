import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * PhotoModal - Premium fullscreen photo viewer
 * Clean implementation with CSS-only animations and proper gestures
 */
const PhotoModal = ({ photo, isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);
    const lastTapTime = useRef(0);

    // Handle open/close state
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsClosing(false);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close with animation
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            setIsZoomed(false);
            setDragY(0);
            onClose();
        }, 300);
    }, [onClose]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    // Double tap to zoom
    const handleTap = (e) => {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTime.current;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            // Double tap detected
            setIsZoomed(prev => !prev);
            e.preventDefault();
        }
        lastTapTime.current = now;
    };

    // Touch handlers for swipe-to-close
    const handleTouchStart = (e) => {
        if (isZoomed) return;
        touchStartY.current = e.touches[0].clientY;
        touchStartTime.current = Date.now();
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (isZoomed || !isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;

        // Only allow downward drag
        if (diff > 0) {
            setDragY(diff * 0.6); // Dampening factor
        }
    };

    const handleTouchEnd = () => {
        if (isZoomed) return;
        setIsDragging(false);

        const timeDiff = Date.now() - touchStartTime.current;
        const velocity = dragY / timeDiff;

        // Close if dragged far enough or fast enough
        if (dragY > 120 || velocity > 0.5) {
            handleClose();
        } else {
            setDragY(0);
        }
    };

    // Mouse drag for desktop
    const handleMouseDown = (e) => {
        if (isZoomed) return;
        touchStartY.current = e.clientY;
        touchStartTime.current = Date.now();
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isZoomed || !isDragging) return;
        const diff = e.clientY - touchStartY.current;
        if (diff > 0) {
            setDragY(diff * 0.6);
        }
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        handleTouchEnd();
    };

    if (!isVisible) return null;

    const opacity = Math.max(0, 1 - dragY / 300);

    return (
        <div
            ref={containerRef}
            className={`
                fixed inset-0 z-[100] flex items-center justify-center
                transition-opacity duration-300 ease-out
                ${isClosing ? 'opacity-0' : 'opacity-100'}
            `}
            onClick={handleClose}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-lg"
                style={{ opacity }}
            />

            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                }}
                className={`
                    absolute top-6 right-6 z-20
                    w-11 h-11 rounded-full
                    bg-white/10 hover:bg-white/20 backdrop-blur-sm
                    flex items-center justify-center
                    text-white text-2xl font-light
                    transition-all duration-200
                    transform ${isClosing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}
                `}
            >
                ✕
            </button>

            {/* Swipe hint */}
            <div className={`
                absolute top-6 left-1/2 -translate-x-1/2 z-10
                text-white/50 text-sm font-medium
                flex items-center gap-2
                transition-all duration-300 delay-500
                ${isClosing || dragY > 20 ? 'opacity-0' : 'opacity-100'}
            `}>
                <span className="animate-bounce">↓</span>
                <span>Runter wischen zum Schließen</span>
            </div>

            {/* Image container */}
            <div
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onClickCapture={handleTap}
                className={`
                    relative select-none
                    ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
                `}
                style={{
                    transform: `translateY(${dragY}px) scale(${isClosing ? 0.9 : isZoomed ? 1.8 : 1})`,
                    opacity: isClosing ? 0 : opacity,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transformOrigin: 'center center',
                }}
            >
                <img
                    src={`/photos/${photo.filename}`}
                    alt={photo.alt}
                    draggable={false}
                    className={`
                        max-w-[92vw] max-h-[85vh] 
                        object-contain rounded-2xl
                        shadow-2xl
                        transition-shadow duration-300
                        ${isZoomed ? 'shadow-black/50' : 'shadow-black/30'}
                    `}
                />

                {/* Photo info badge */}
                <div className={`
                    absolute bottom-4 left-1/2 -translate-x-1/2
                    bg-black/40 backdrop-blur-md
                    px-5 py-2.5 rounded-full
                    text-white/90 text-sm font-medium
                    flex items-center gap-2
                    transition-all duration-300
                    ${isClosing || dragY > 30 || isZoomed ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                `}>
                    <span>📸</span>
                    <span>Unsere Erinnerung</span>
                </div>

                {/* Zoom hint */}
                <div className={`
                    absolute bottom-4 right-4
                    bg-black/40 backdrop-blur-md
                    px-3 py-1.5 rounded-full
                    text-white/50 text-xs
                    transition-all duration-300
                    ${isZoomed || isClosing || dragY > 20 ? 'opacity-0' : 'opacity-100'}
                `}>
                    Doppeltipp = Zoom
                </div>
            </div>
        </div>
    );
};

export default PhotoModal;
