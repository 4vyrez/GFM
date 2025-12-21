import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * ButtonChase Game - Catch the escaping button
 * Now with TIME-BASED scoring for meaningful comparison!
 * Button dodges cursor but is eventually catchable
 */
const ButtonChase = ({ onWin }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [catches, setCatches] = useState(0);
    const [won, setWon] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [combo, setCombo] = useState(0);
    const [lastCatchTime, setLastCatchTime] = useState(null);
    const containerRef = useRef(null);
    const timerRef = useRef(null);
    const requiredCatches = 3;

    const messages = [
        'Haha, zu langsam! 😜',
        'Fast! Aber nicht ganz! 💨',
        'Ich bin schneller! ⚡',
        'Netter Versuch! 🏃',
        'Fang mich doch! 😈',
        'Git gud! 🎮',
        'Too slow, noob! 😏',
        'Skill issue! 🎯',
        'Lag? Nope, du bist langsam! 📶',
        'DODGE! 🏃‍♂️',
        'Try harder! 💪',
        'Nice try! 👏',
        'Almost! ...not 😏',
        'You need more FPS! 🖥️',
        'Outplayed! 🎮',
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        // Start the timer when game becomes visible
        setStartTime(Date.now());
    }, []);

    // Timer for live display
    useEffect(() => {
        if (startTime && !won) {
            timerRef.current = setInterval(() => {
                setElapsedTime((Date.now() - startTime) / 1000);
            }, 100);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startTime, won]);

    const moveButton = () => {
        if (won) return;

        // Get container bounds
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const buttonSize = 80;
        const padding = 10;

        // Random new position within bounds
        const maxX = rect.width - buttonSize - padding;
        const maxY = rect.height - buttonSize - padding;

        const newX = padding + Math.random() * maxX;
        const newY = padding + Math.random() * maxY;

        // Convert to percentage
        setPosition({
            x: (newX / rect.width) * 100,
            y: (newY / rect.height) * 100,
        });

        // Show random message
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
    };

    const handleClick = () => {
        if (won) return;

        const newCatches = catches + 1;
        setCatches(newCatches);

        if (newCatches >= requiredCatches) {
            const finalTime = (Date.now() - startTime) / 1000;
            setElapsedTime(finalTime);
            setWon(true);
            setMessage('Okay, du hast mich! 😅');

            if (timerRef.current) clearInterval(timerRef.current);

            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'button-chase-1',
                        metric: 'seconds',
                        value: parseFloat(finalTime.toFixed(1)),
                    });
                }
            }, 1500);
        } else {
            // Move after catch for next round
            setTimeout(moveButton, 200);
        }
    };

    const handleMouseEnter = () => {
        // Only dodge if not enough catches yet
        if (catches < requiredCatches - 1 && !won) {
            moveButton();
        }
    };

    const formatTime = (time) => {
        return time.toFixed(1) + 's';
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
                    {won ? '🎉 Erwischt!' : 'Fang den Button! 🎯'}
                </p>

                {/* Timer Display */}
                <div className="mt-2 flex justify-center">
                    <div className={`
                        inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        ${won
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                        font-mono font-bold text-lg
                        transition-all duration-300
                    `}>
                        ⏱️ {formatTime(elapsedTime)}
                    </div>
                </div>

                {/* Progress */}
                <div className="flex justify-center gap-2 mt-3">
                    {[...Array(requiredCatches)].map((_, i) => (
                        <div
                            key={i}
                            className={`
                                w-3 h-3 rounded-full transition-all duration-300
                                ${i < catches
                                    ? 'bg-green-500 scale-110'
                                    : 'bg-gray-300'
                                }
                            `}
                        />
                    ))}
                </div>
            </div>

            {/* Game Area */}
            <div
                ref={containerRef}
                className="relative w-full h-64 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl shadow-glass border border-white/50 overflow-hidden"
            >
                {/* The escaping button */}
                <button
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        handleClick();
                    }}
                    style={{
                        position: 'absolute',
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                    className={`
                        px-6 py-3 rounded-xl font-bold text-white
                        transition-all duration-300 ease-bouncy
                        ${won
                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                            : 'bg-gradient-to-br from-pastel-lavender to-pastel-pink'
                        }
                        shadow-lg hover:shadow-xl
                        ${won ? 'scale-110' : 'hover:scale-105'}
                    `}
                >
                    {won ? '😊 Gefangen!' : '😈 Klick mich!'}
                </button>

                {/* Message bubble */}
                {message && !won && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-full text-sm text-gray-600 shadow-md animate-fade-in">
                        {message}
                    </div>
                )}
            </div>

            {/* Instructions / Result */}
            <p className={`
                text-center mt-4 font-medium transition-all duration-300
                ${won ? 'text-green-600 text-lg' : 'text-gray-500 text-sm'}
            `}>
                {won
                    ? `Speedrun in ${formatTime(elapsedTime)}! 💨`
                    : 'Der Button weicht aus... aber nicht für immer! 😏'
                }
            </p>

            {/* Success Animation */}
            {won && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-500 animate-slide-up">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="text-lg font-bold">Reflexe wie ein Pro-Gamer! 🎮</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};

export default ButtonChase;
