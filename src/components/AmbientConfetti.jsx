import { useMemo, memo } from 'react';

/**
 * AmbientConfetti - Subtle floating celebration particles
 * OPTIMIZED: Uses pure CSS animations, minimal DOM elements
 */
const AmbientConfetti = memo(({ intensity = 'low' }) => {
    const particles = useMemo(() => {
        // Minimal particle count for performance
        const count = intensity === 'high' ? 8 : intensity === 'medium' ? 5 : 3;
        const emojis = ['✨', '⭐', '❄️'];

        return Array.from({ length: count }, (_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            left: (i * (100 / count)) + Math.random() * 10,
            delay: i * 4,
            duration: 20 + i * 3,
            size: 12 + Math.random() * 6,
        }));
    }, [intensity]);

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
            aria-hidden="true"
        >
            {particles.map(particle => (
                <span
                    key={particle.id}
                    className="absolute opacity-30"
                    style={{
                        left: `${particle.left}%`,
                        top: '-20px',
                        fontSize: particle.size,
                        animation: `ambient-fall ${particle.duration}s linear ${particle.delay}s infinite`,
                        willChange: 'transform',
                    }}
                >
                    {particle.emoji}
                </span>
            ))}

            <style>{`
                @keyframes ambient-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    5% { opacity: 0.3; }
                    95% { opacity: 0.3; }
                    100% { transform: translateY(100vh) rotate(180deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
});

AmbientConfetti.displayName = 'AmbientConfetti';

export default AmbientConfetti;
