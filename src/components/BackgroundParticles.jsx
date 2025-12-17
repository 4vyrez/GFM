import { useMemo, memo } from 'react';

/**
 * BackgroundParticles - Subtle floating background decorations
 * Wrapped in React.memo to prevent unnecessary re-renders
 * Reduced particle count for better performance
 */
const BackgroundParticles = memo(() => {
    const particles = useMemo(() => {
        const emojis = ['💕', '✨', '💖', '🌸'];
        // Reduced to 4 particles with longer animations for better performance
        return Array.from({ length: 4 }, (_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            left: 15 + (i * 20) + Math.random() * 10,
            delay: i * 5,
            duration: 25 + Math.random() * 10,
            size: 0.9 + Math.random() * 0.3,
            opacity: 0.1 + Math.random() * 0.1,
        }));
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
            style={{ willChange: 'auto' }}
        >
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute animate-particle-float gpu"
                    style={{
                        left: `${particle.left}%`,
                        bottom: '-50px',
                        fontSize: `${particle.size}rem`,
                        opacity: particle.opacity,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                        willChange: 'transform, opacity',
                    }}
                >
                    {particle.emoji}
                </div>
            ))}
        </div>
    );
});

BackgroundParticles.displayName = 'BackgroundParticles';

export default BackgroundParticles;
