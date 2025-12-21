import { useEffect, useState } from 'react';

/**
 * Win Celebration Overlay Component
 * Displays celebratory confetti/sparkle effect on game win
 */
const WinCelebration = ({ isActive, onComplete }) => {
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        if (isActive) {
            // Generate confetti particles
            const newConfetti = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                color: ['#ff6b9d', '#c084fc', '#60a5fa', '#34d399', '#fbbf24'][Math.floor(Math.random() * 5)],
                delay: Math.random() * 0.5,
                size: 4 + Math.random() * 8,
            }));
            setConfetti(newConfetti);

            // Clear after animation
            const timer = setTimeout(() => {
                setConfetti([]);
                if (onComplete) onComplete();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!isActive || confetti.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${piece.x}%`,
                        top: '-10px',
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        animation: `confettiFall 2s ease-out forwards`,
                        animationDelay: `${piece.delay}s`,
                    }}
                />
            ))}
            <style>{`
                @keyframes confettiFall {
                    0% { 
                        transform: translateY(0) rotate(0deg); 
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(100vh) rotate(720deg); 
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default WinCelebration;
