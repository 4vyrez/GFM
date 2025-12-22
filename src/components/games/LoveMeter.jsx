import { useState, useEffect, useRef, useCallback } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * LoveMeter Game - Hold to fill a heart gauge to exactly 100%
 * Level bounces back after hitting 100, goal is to release at exactly 100%
 * Rated by attempts (fewer = better)
 */
const LoveMeter = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [level, setLevel] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = up, -1 = down
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lastResult, setLastResult] = useState(null);

    const intervalRef = useRef(null);
    const speedRef = useRef(1);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => {
            clearTimeout(timer);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startHolding = useCallback(() => {
        if (won) return;

        setIsHolding(true);
        setLastResult(null);
        speedRef.current = 1;

        intervalRef.current = setInterval(() => {
            setLevel(prev => {
                setDirection(d => {
                    let newDirection = d;
                    let newLevel = prev + (speedRef.current * d);

                    // Bounce at 100% and 0%
                    if (newLevel >= 100) {
                        newLevel = 100 - (newLevel - 100);
                        newDirection = -1;
                    } else if (newLevel <= 0) {
                        newLevel = Math.abs(newLevel);
                        newDirection = 1;
                    }

                    speedRef.current = Math.min(speedRef.current + 0.015, 2.5);
                    return newDirection;
                });

                // Calculate new level with bounce
                let computedLevel = prev + (speedRef.current * direction);
                if (computedLevel >= 100) {
                    computedLevel = 100 - (computedLevel - 100);
                } else if (computedLevel <= 0) {
                    computedLevel = Math.abs(computedLevel);
                }

                return Math.max(0, Math.min(100, computedLevel));
            });
        }, 30);
    }, [won, direction]);

    const stopHolding = useCallback(() => {
        if (!isHolding || won) return;

        setIsHolding(false);
        clearInterval(intervalRef.current);
        const currentAttempts = attempts + 1;
        setAttempts(currentAttempts);

        const roundedLevel = Math.round(level);

        // Win condition: exactly 100% (or 99-100 for slight tolerance)
        if (roundedLevel >= 99 && roundedLevel <= 100) {
            setWon(true);
            setLastResult('perfect');
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'love-meter-1',
                        metric: 'attempts',
                        value: currentAttempts,
                    });
                }
            }, 1500);
        } else {
            // Show result and reset - penalty: increases difficulty speed
            setLastResult(roundedLevel);
            speedRef.current = Math.min(speedRef.current + 0.1, 2.0); // Slight speed increase as penalty
            setTimeout(() => {
                setLevel(0);
                setDirection(1);
                setLastResult(null);
            }, 1200);
        }
    }, [isHolding, level, won, onWin, attempts]);

    // Touch/mouse handlers
    const handleStart = (e) => {
        e.preventDefault();
        startHolding();
    };

    const handleEnd = (e) => {
        e.preventDefault();
        stopHolding();
    };

    const getMessage = () => {
        if (won) return '💚 Perfekt! 100% Liebe!';
        if (lastResult === 'perfect') return '🎉 100% erreicht!';
        if (lastResult !== null) return `${lastResult}% - ${lastResult > 50 ? 'Fast!' : 'Weiter versuchen!'} 🔄`;
        if (isHolding && level >= 90) return '🔥 Fast da!';
        if (isHolding && level >= 70) return '💗 Weiter so!';
        if (isHolding) return '💕 Halte gedrückt...';
        return '🤍 Halte gedrückt bis 100%!';
    };

    const getRating = () => {
        if (!won) return null;
        if (attempts === 1) return '🏆 FIRST TRY! Legendär!';
        if (attempts === 2) return '⭐ Zweiter Versuch! Super!';
        if (attempts <= 4) return '✨ Gut gemacht!';
        return '👍 Geschafft!';
    };

    return (
        <div
            className={`
                flex flex-col items-center w-full select-none
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
                    {won ? '🎉 Liebe perfektioniert!' : 'Fülle das Herz auf 100%! 💕'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    {won ? getRating() : 'Lass bei genau 100% los - es springt zurück!'}
                </p>
            </div>

            {/* Heart meter */}
            <div className="relative w-48 h-56 mb-6">
                {/* Heart outline */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Heart path */}
                        <defs>
                            <clipPath id="heartClip">
                                <path d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88Z" />
                            </clipPath>
                        </defs>

                        {/* Background heart */}
                        <path
                            d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88Z"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                        />

                        {/* Fill level */}
                        <g clipPath="url(#heartClip)">
                            <rect
                                x="0"
                                y={100 - level}
                                width="100"
                                height={level}
                                className={`
                                    transition-all duration-100
                                    ${level >= 99 ? 'fill-green-400' :
                                        level >= 90 ? 'fill-yellow-400' :
                                            level >= 70 ? 'fill-pink-400' :
                                                'fill-pink-300'}
                                `}
                            />
                        </g>

                        {/* Heart stroke */}
                        <path
                            d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88Z"
                            fill="none"
                            stroke={won ? '#22C55E' : level >= 99 ? '#22C55E' : '#F472B6'}
                            strokeWidth="3"
                            className="transition-colors duration-300"
                        />
                    </svg>
                </div>

                {/* Percentage display */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`
                        text-4xl font-black transition-all duration-200
                        ${won ? 'text-green-500' : level >= 99 ? 'text-green-500' : 'text-pink-500'}
                        ${isHolding ? 'scale-110' : 'scale-100'}
                    `}>
                        {Math.round(level)}%
                    </span>
                </div>

                {/* Direction indicator */}
                {isHolding && !won && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl animate-bounce">
                        {direction === 1 ? '⬆️' : '⬇️'}
                    </div>
                )}

                {/* Target zone indicator */}
                {!won && (
                    <div className="absolute left-2 top-0 h-full flex items-start pointer-events-none">
                        <div className="flex flex-col items-center gap-0.5 mt-2">
                            <span className="text-[8px] text-green-500 font-bold">100%</span>
                            <div className="w-0.5 h-4 bg-green-400/60 rounded-full" />
                        </div>
                    </div>
                )}
            </div>

            {/* Status message */}
            <p className={`
                text-lg font-bold mb-4 transition-all duration-300
                ${lastResult !== null && lastResult !== 'perfect' ? 'text-orange-500' :
                    won ? 'text-green-500' : 'text-gray-600'}
            `}>
                {getMessage()}
            </p>

            {/* Hold button */}
            <button
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchEnd={handleEnd}
                disabled={won}
                className={`
                    w-32 h-32 rounded-full
                    flex items-center justify-center
                    text-5xl
                    transition-all duration-200 ease-bouncy
                    shadow-lg
                    ${won
                        ? 'bg-green-400 cursor-default'
                        : isHolding
                            ? 'bg-gradient-to-br from-pink-500 to-red-500 scale-95 shadow-xl'
                            : 'bg-gradient-to-br from-pink-400 to-pink-500 hover:scale-105 active:scale-95'
                    }
                `}
            >
                {won ? '💚' : isHolding ? '💗' : '🤍'}
            </button>

            {/* Stats */}
            <div className="mt-4 flex gap-4 text-xs text-gray-400">
                <span>Versuche: {attempts}</span>
            </div>

            {/* Win celebration */}
            {won && (
                <div className="mt-4 flex items-center gap-2 text-green-500 animate-bounce-in">
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                    <p className="font-bold">Liebes-Meister! 💘</p>
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                </div>
            )}
        </div>
    );
};

export default LoveMeter;
