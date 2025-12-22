import { useMemo, memo, useState, useEffect } from 'react';

/**
 * BackgroundParticles - Subtle floating background decorations
 * Wrapped in React.memo to prevent unnecessary re-renders
 * Reduced particle count for better performance
 * Now includes subtle parallax effect based on mouse position
 */
const BackgroundParticles = memo(() => {
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Calculate offset from center (normalized -1 to 1)
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMouseOffset({ x: x * 10, y: y * 5 }); // Subtle movement
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
            parallaxStrength: 0.5 + Math.random() * 0.5, // Varied parallax strength
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
                        left: `calc(${particle.left}% + ${mouseOffset.x * particle.parallaxStrength}px)`,
                        bottom: '-50px',
                        fontSize: `${particle.size}rem`,
                        opacity: particle.opacity,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                        willChange: 'transform, opacity',
                        transform: `translateY(${mouseOffset.y * particle.parallaxStrength}px)`,
                        transition: 'left 0.3s ease-out, transform 0.3s ease-out',
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

