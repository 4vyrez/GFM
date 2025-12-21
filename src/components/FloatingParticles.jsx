import { useEffect, useState } from 'react';

/**
 * Floating Particles Background Component
 * Adds subtle floating particle effect to game backgrounds
 */
const FloatingParticles = ({ count = 15, className = '' }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 10,
            opacity: 0.1 + Math.random() * 0.3,
        }));
        setParticles(newParticles);
    }, [count]);

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
