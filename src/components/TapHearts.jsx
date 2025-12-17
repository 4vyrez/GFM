import { useState, useCallback, useEffect, memo } from 'react';

/**
 * TapHearts - Interactive heart spawner
 * FIXED: Uses event delegation instead of blocking overlay
 * Hearts spawn on double-tap/double-click to avoid blocking normal interactions
 */
const TapHearts = memo(() => {
    const [hearts, setHearts] = useState([]);

    const spawnHeart = useCallback((x, y) => {
        const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💞', '✨'];
        const newHeart = {
            id: Date.now() + Math.random(),
            x,
            y,
            emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
            size: 20 + Math.random() * 20,
            rotation: -30 + Math.random() * 60,
        };

        setHearts(prev => [...prev.slice(-15), newHeart]); // Limit to 15 hearts max

        // Remove heart after animation completes
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1500);
    }, []);

    useEffect(() => {
        let lastTapTime = 0;
        let lastTapX = 0;
        let lastTapY = 0;

        const handleDoubleTap = (e) => {
            const now = Date.now();
            const x = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
            const y = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

            // Check for double-tap (within 300ms and 50px)
            const timeDiff = now - lastTapTime;
            const distX = Math.abs(x - lastTapX);
            const distY = Math.abs(y - lastTapY);

            if (timeDiff < 300 && distX < 50 && distY < 50) {
                // Double tap detected - spawn hearts!
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        spawnHeart(
                            x + (Math.random() - 0.5) * 40,
                            y + (Math.random() - 0.5) * 40
                        );
                    }, i * 100);
                }
            }

            lastTapTime = now;
            lastTapX = x;
            lastTapY = y;
        };

        // Listen on document level (non-blocking)
        document.addEventListener('click', handleDoubleTap, { passive: true });
        document.addEventListener('touchend', handleDoubleTap, { passive: true });

        return () => {
            document.removeEventListener('click', handleDoubleTap);
            document.removeEventListener('touchend', handleDoubleTap);
        };
    }, [spawnHeart]);

    // Only render hearts, no blocking overlay
    if (hearts.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {hearts.map(heart => (
                <div
                    key={heart.id}
                    className="fixed pointer-events-none animate-heart-float"
                    style={{
                        left: heart.x,
                        top: heart.y,
                        fontSize: heart.size,
                        transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`,
                        willChange: 'transform, opacity',
                    }}
                >
                    {heart.emoji}
                </div>
            ))}

            <style>{`
                @keyframes heart-float {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(0.5);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -100%) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -200%) scale(0.8);
                    }
                }
                .animate-heart-float {
                    animation: heart-float 1.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
});

TapHearts.displayName = 'TapHearts';

export default TapHearts;
