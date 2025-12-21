import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * PhotoModal - Premium fullscreen photo viewer
 * Instantly displays photo at full size with beautiful animations
 */
const PhotoModal = ({ photo, isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isEntering, setIsEntering] = useState(true);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    // Handle open/close state
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsClosing(false);
            setIsEntering(true);
            document.body.style.overflow = 'hidden';

            // Trigger entrance animation
            requestAnimationFrame(() => {
                setTimeout(() => setIsEntering(false), 50);
            });
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
            setDragY(0);
            onClose();
        }, 350);
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

    // Touch handlers for swipe-to-close
    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
        touchStartTime.current = Date.now();
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;

        // Allow drag in both directions for natural feel
        setDragY(diff * 0.5); // Dampening factor
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        const timeDiff = Date.now() - touchStartTime.current;
        const velocity = Math.abs(dragY) / timeDiff;

        // Close if dragged far enough or fast enough
        if (Math.abs(dragY) > 100 || velocity > 0.4) {
            handleClose();
        } else {
            setDragY(0);
        }
    };

    // Mouse drag for desktop
    const handleMouseDown = (e) => {
        touchStartY.current = e.clientY;
        touchStartTime.current = Date.now();
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const diff = e.clientY - touchStartY.current;
        setDragY(diff * 0.5);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        handleTouchEnd();
    };

    if (!isVisible) return null;

    const opacity = Math.max(0, 1 - Math.abs(dragY) / 250);
    const scale = Math.max(0.85, 1 - Math.abs(dragY) / 600);

    return (
        <div
            ref={containerRef}
            className={`
                fixed inset-0 z-[100] flex items-center justify-center
                transition-all duration-350 ease-out
                ${isClosing ? 'opacity-0' : 'opacity-100'}
            `}
            onClick={handleClose}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Premium gradient backdrop */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black/95 backdrop-blur-xl"
                style={{ opacity }}
            />

            {/* Subtle ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.08) 0%, transparent 60%)',
                    opacity: isClosing ? 0 : 1,
                    transition: 'opacity 0.3s ease-out'
                }}
            />

            {/* Close button - premium design */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                }}
                className={`
                    absolute top-5 right-5 z-20
                    w-12 h-12 rounded-full
                    bg-white/10 hover:bg-white/20 active:bg-white/30
                    backdrop-blur-md border border-white/10
                    flex items-center justify-center
                    text-white text-xl font-light
                    transition-all duration-300 ease-out
                    hover:scale-110 active:scale-95
                    shadow-lg shadow-black/20
                    transform ${isClosing || isEntering ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}
                `}
                style={{ transitionDelay: isEntering ? '0ms' : '100ms' }}
            >
                ✕
            </button>

            {/* Swipe hint - elegant design */}
            <div className={`
                absolute top-5 left-1/2 -translate-x-1/2 z-10
                bg-white/5 backdrop-blur-md border border-white/10
                px-4 py-2 rounded-full
                text-white/60 text-sm font-medium
                flex items-center gap-2
                transition-all duration-500
                ${isClosing || Math.abs(dragY) > 20 || isEntering ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}
            `}
                style={{ transitionDelay: isEntering ? '0ms' : '400ms' }}
            >
                <span className="animate-bounce text-xs">↕</span>
                <span>Wischen zum Schließen</span>
            </div>

            {/* Image container - INSTANT FULL SIZE */}
            <div
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                className="relative select-none cursor-grab active:cursor-grabbing"
                style={{
                    transform: `translateY(${dragY}px) scale(${isClosing ? 0.85 : isEntering ? 0.9 : scale})`,
                    opacity: isClosing ? 0 : isEntering ? 0.8 : opacity,
                    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.35s ease-out',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transformOrigin: 'center center',
                }}
            >
                {/* Main image - FULL VIEWPORT SIZE */}
                <img
                    src={`/photos/${photo.filename}`}
                    alt={photo.alt}
                    draggable={false}
                    className="max-w-[98vw] max-h-[94vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
                    style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(236, 72, 153, 0.1)',
                    }}
                />

                {/* Elegant frame border */}
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    }}
                />

                {/* Photo info badge - minimal elegant */}
                <div className={`
                    absolute bottom-5 left-1/2 -translate-x-1/2
                    bg-black/50 backdrop-blur-md border border-white/10
                    px-5 py-2.5 rounded-full
                    text-white/90 text-sm font-medium
                    flex items-center gap-2.5
                    transition-all duration-400
                    shadow-lg
                    ${isClosing || Math.abs(dragY) > 30 || isEntering ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                `}
                    style={{ transitionDelay: isEntering ? '0ms' : '200ms' }}
                >
                    <span className="text-base">📸</span>
                    <span>Unsere Erinnerung</span>
                    <span className="text-pink-400">💕</span>
                </div>
            </div>
        </div>
    );
};

export default PhotoModal;
