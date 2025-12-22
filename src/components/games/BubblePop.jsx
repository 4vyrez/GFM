import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * BubblePop Game - Anti-stress bubble popping
 * Pop bubbles for a relaxing win
 */
const BubblePop = ({ onWin }) => {
    const [bubbles, setBubbles] = useState([]);
    const [popped, setPopped] = useState(0);
    const [won, setWon] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const requiredPops = 5;
    const colors = ['bg-pink-300', 'bg-purple-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300'];

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        generateBubbles();
        return () => clearTimeout(timer);
    }, []);

    const generateBubbles = () => {
        const newBubbles = [];
        for (let i = 0; i < 12; i++) {
            newBubbles.push({
                id: i,
                x: 10 + Math.random() * 80,
                y: 10 + Math.random() * 80,
                size: 40 + Math.random() * 30,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 2,
                popped: false,
            });
        }
        setBubbles(newBubbles);
    };

    const popBubble = (id) => {
        if (won) return;

        setBubbles(prev => prev.map(b =>
            b.id === id ? { ...b, popped: true } : b
        ));

        const newPopped = popped + 1;
        setPopped(newPopped);

        if (newPopped >= requiredPops) {
            setWon(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'bubble-pop-1',
                        metric: 'bubbles',
                        value: newPopped,
                    });
                }
            }, 1500);
        }
    };

    return (
        <div
            className={`
                flex flex-col items-center w-full
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {/* Header */}
            <div className="text-center mb-4 w-full">
                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Entspannung pur!' : 'Pop die Bubbles! 🫧'}
                </p>

                {/* Progress */}
                <div className="flex justify-center gap-2 mt-3">
                    {[...Array(requiredPops)].map((_, i) => (
                        <div
                            key={i}
                            className={`
                                w-3 h-3 rounded-full transition-all duration-300
                                ${i < popped
                                    ? 'bg-pastel-pink scale-110'
                                    : 'bg-gray-300'
                                }
                            `}
                        />
                    ))}
                </div>
            </div>

            {/* Bubble Area */}
            <div className="relative w-full h-64 bg-gradient-to-br from-white/70 to-pastel-blue/30 backdrop-blur-sm rounded-2xl shadow-glass border border-white/50 overflow-hidden">
                {bubbles.map((bubble) => (
                    <button
                        key={bubble.id}
                        onClick={() => popBubble(bubble.id)}
                        onTouchEnd={(e) => { e.preventDefault(); popBubble(bubble.id); }}
                        disabled={bubble.popped || won}
                        aria-label={`Pop bubble ${bubble.id + 1}`}
                        style={{
                            position: 'absolute',
                            left: `${bubble.x}%`,
                            top: `${bubble.y}%`,
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            animationDelay: `${bubble.delay}s`,
                        }}
                        className={`
                            rounded-full transform -translate-x-1/2 -translate-y-1/2
                            transition-all duration-300 touch-manipulation select-none
                            ${bubble.popped
                                ? 'scale-0 opacity-0'
                                : `${bubble.color} animate-float hover:scale-110 cursor-pointer shadow-lg`
                            }
                            border-2 border-white/50
                        `}
                    >
                        {!bubble.popped && (
                            <span className="absolute inset-0 flex items-center justify-center text-white/70 text-lg">
                                ✨
                            </span>
                        )}
                    </button>
                ))}

                {/* Win Message Overlay */}
                {won && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm animate-fade-in">
                        <div className="text-center">
                            <div className="text-5xl mb-2 animate-bounce-in">😌</div>
                            <p className="text-lg font-bold text-green-600">Ahhh, entspannend!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Message */}
            <p className="text-center mt-4 text-gray-500 text-sm">
                {won
                    ? 'Stress? Kenne ich nicht! 💆‍♀️'
                    : `Noch ${requiredPops - popped} Bubbles...`
                }
            </p>

            {/* Success */}
            {won && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-500 animate-slide-up">
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                    <p className="font-bold">Bubble Therapy abgeschlossen! 🫧</p>
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                </div>
            )}
        </div>
    );
};

export default BubblePop;
