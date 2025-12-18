import { useMemo } from 'react';

/**
 * OrbitingHearts - Premium animation to replace the flower system
 * Shows orbiting hearts/stars based on streak level
 * Uses pure CSS3 for smooth 60fps performance
 */
const OrbitingHearts = ({ streak = 0, size = 'md' }) => {
    // Calculate number of orbiting elements based on streak
    const orbitCount = useMemo(() => {
        if (streak < 3) return 1;
        if (streak < 7) return 2;
        if (streak < 14) return 3;
        if (streak < 30) return 4;
        if (streak < 50) return 5;
        return 6; // Max 6 orbiting elements
    }, [streak]);

    // Get the size classes
    const sizeClasses = {
        sm: { container: 'w-16 h-16', center: 'text-2xl', orbit: 'text-sm' },
        md: { container: 'w-24 h-24', center: 'text-4xl', orbit: 'text-lg' },
        lg: { container: 'w-32 h-32', center: 'text-5xl', orbit: 'text-xl' },
    };

    const sizes = sizeClasses[size] || sizeClasses.md;

    // Generate orbiting elements with different delays and emojis
    const orbitElements = useMemo(() => {
        const emojis = ['💕', '✨', '💫', '⭐', '💖', '🌟'];
        return Array.from({ length: orbitCount }, (_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            delay: i * (360 / orbitCount), // Evenly distributed
            duration: 4 + (i * 0.5), // Slightly different speeds
            distance: 50 + (i * 8), // Different orbit distances
        }));
    }, [orbitCount]);

    // Get center emoji based on streak
    const centerEmoji = useMemo(() => {
        if (streak >= 100) return '👑';
        if (streak >= 50) return '🏆';
        if (streak >= 30) return '💎';
        if (streak >= 14) return '🔥';
        if (streak >= 7) return '❤️‍🔥';
        return '❤️';
    }, [streak]);

    return (
        <div className={`relative ${sizes.container} flex items-center justify-center`}>
            {/* Central heart with pulse */}
            <div
                className={`${sizes.center} animate-pulse-glow z-10 select-none`}
                style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 100, 150, 0.5))',
                    animation: 'heartbeat 1.5s ease-in-out infinite'
                }}
            >
                {centerEmoji}
            </div>

            {/* Orbiting elements */}
            {orbitElements.map((orbit) => (
                <div
                    key={orbit.id}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                        animation: `orbit-spin ${orbit.duration}s linear infinite`,
                        animationDelay: `-${orbit.delay / 60}s`,
                    }}
                >
                    <span
                        className={`${sizes.orbit} absolute select-none`}
                        style={{
                            transform: `translateY(-${orbit.distance}%)`,
                            animation: `orbit-counter-spin ${orbit.duration}s linear infinite`,
                            animationDelay: `-${orbit.delay / 60}s`,
                            filter: 'drop-shadow(0 0 5px rgba(255, 200, 100, 0.4))',
                        }}
                    >
                        {orbit.emoji}
                    </span>
                </div>
            ))}

            {/* Glow ring effect */}
            <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, 
            rgba(255, 150, 180, 0.2) 0%, 
            rgba(255, 100, 150, 0.1) 40%, 
            transparent 70%)`,
                    animation: 'pulse-glow 2s ease-in-out infinite',
                }}
            />

            {/* Streak number badge */}
            {streak > 0 && (
                <div
                    className="absolute -bottom-1 -right-1 bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white z-20"
                    style={{ fontSize: streak >= 100 ? '0.6rem' : '0.7rem' }}
                >
                    {streak}
                </div>
            )}

            <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbit-counter-spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(-360deg); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
        </div>
    );
};

export default OrbitingHearts;
