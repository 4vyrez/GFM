import { useEffect, useState, useMemo } from 'react';

/**
 * Floating Particles Background Component
 * Adds subtle floating particle effect to game backgrounds
 * 
 * @param {string} density - 'low' | 'medium' | 'high' | number (default: 'medium')
 * @param {string} className - Additional CSS classes
 */

// Density presets
const DENSITY_PRESETS = {
    low: 8,
    medium: 15,
    high: 25,
};

const FloatingParticles = ({ density = 'medium', count, className = '' }) => {
    const [particles, setParticles] = useState([]);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Determine particle count from density prop or count override
    const particleCount = useMemo(() => {
        if (count !== undefined) return count;
        if (typeof density === 'number') return density;
        return DENSITY_PRESETS[density] || DENSITY_PRESETS.medium;
    }, [density, count]);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        // Skip particles if user prefers reduced motion
        if (prefersReducedMotion) {
            setParticles([]);
            return;
        }

        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 10,
            opacity: 0.1 + Math.random() * 0.3,
        }));
        setParticles(newParticles);
    }, [particleCount, prefersReducedMotion]);

    // Don't render anything if reduced motion is preferred
    if (prefersReducedMotion || particles.length === 0) return null;

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-gradient-to-br from-pink-300 to-purple-300"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                        animation: `float ${particle.duration}s ease-in-out infinite`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(10px, -20px) rotate(5deg); }
                    50% { transform: translate(-5px, -35px) rotate(-3deg); }
                    75% { transform: translate(15px, -15px) rotate(2deg); }
                }
            `}</style>
        </div>
    );
};

export default FloatingParticles;
