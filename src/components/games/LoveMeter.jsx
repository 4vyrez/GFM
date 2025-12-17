import { useState, useEffect, useRef, useCallback } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * LoveMeter Game - Hold to fill a heart gauge to exactly 100%
 * Precision timing game
 */
const LoveMeter = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [level, setLevel] = useState(0);
    const [won, setWon] = useState(false);
    const [overshot, setOvershot] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    const intervalRef = useRef(null);
    const speedRef = useRef(1);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startHolding = useCallback(() => {
        if (won) return;

        setIsHolding(true);
        setOvershot(false);
        speedRef.current = 1;

        intervalRef.current = setInterval(() => {
            setLevel(prev => {
                const newLevel = prev + speedRef.current;
                speedRef.current = Math.min(speedRef.current + 0.02, 3); // Accelerate

                if (newLevel >= 120) {
                    // Overshot too much!
                    clearInterval(intervalRef.current);
                    return 120;
                }
                return newLevel;
            });
        }, 30);
    }, [won]);

    const stopHolding = useCallback(() => {
        if (!isHolding || won) return;

        setIsHolding(false);
        clearInterval(intervalRef.current);
        setAttempts(prev => prev + 1);

        // Check result
        if (level >= 95 && level <= 105) {
            // Perfect!
            setWon(true);
            setBestScore(Math.round(level));
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'love-meter-1',
                        metric: 'accuracy',
                        value: Math.round(level),
                    });
                }
            }, 1500);
        } else if (level > 105) {
            // Overshot
            setOvershot(true);
            setBestScore(prev => Math.max(prev, Math.round(level)));
            setTimeout(() => {
                setLevel(0);
                setOvershot(false);
            }, 1500);
        } else {
            // Too low, keep trying
            setBestScore(prev => Math.max(prev, Math.round(level)));
            setTimeout(() => setLevel(0), 500);
        }
    }, [isHolding, level, won, onWin]);

    // Touch/mouse handlers
    const handleStart = (e) => {
        e.preventDefault();
        startHolding();
    };

    const handleEnd = (e) => {
        e.preventDefault();
        stopHolding();
    };

    const getHeartColor = () => {
        if (won) return 'from-green-400 to-green-500';
        if (overshot) return 'from-red-400 to-red-500';
        if (level >= 95 && level <= 105) return 'from-yellow-400 to-green-400';
        if (level > 80) return 'from-pink-400 to-red-400';
        if (level > 50) return 'from-pink-300 to-pink-400';
        return 'from-pink-200 to-pink-300';
    };

    const getMessage = () => {
        if (won) return '💚 Perfekt! 100% Liebe!';
        if (overshot) return '💔 Zu viel! Nochmal...';
        if (level > 80) return '🔥 Fast da!';
        if (level > 50) return '💗 Weiter so!';
        if (level > 20) return '💕 Mehr Liebe!';
        return '🤍 Halte gedrückt!';
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
                    {won ? '🎉 Liebe perfektioniert!' : 'Fülle das Herz! 💕'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Halte gedrückt bis genau 100%
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
                                    ${level > 105 ? 'fill-red-400' :
                                        level >= 95 ? 'fill-green-400' :
                                            'fill-pink-400'}
                                `}
                            />
                        </g>

                        {/* Heart stroke */}
                        <path
                            d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88Z"
                            fill="none"
                            stroke={won ? '#22C55E' : overshot ? '#EF4444' : '#F472B6'}
                            strokeWidth="3"
                            className="transition-colors duration-300"
                        />
                    </svg>
                </div>

                {/* Percentage display */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`
                        text-4xl font-black transition-all duration-200
                        ${won ? 'text-green-500' : overshot ? 'text-red-500' : 'text-pink-500'}
                        ${isHolding ? 'scale-110' : 'scale-100'}
                    `}>
                        {Math.min(Math.round(level), 120)}%
                    </span>
                </div>

                {/* Target zone indicator - FIXED: only show when not won */}
                {!won && (
                    <div className="absolute right-2 top-0 h-full flex items-center pointer-events-none">
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[8px] text-green-500 font-bold">100%</span>
                            <div className="w-0.5 h-4 bg-green-400/60 rounded-full" />
                        </div>
                    </div>
                )}
            </div>

            {/* Status message */}
            <p className={`
                text-lg font-bold mb-4 transition-all duration-300
                ${overshot ? 'text-red-500 animate-shake' :
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
                {bestScore > 0 && <span>Bester: {bestScore}%</span>}
            </div>

            {/* Win celebration */}
            {won && (
                <div className="mt-4 flex items-center gap-2 text-green-500 animate-bounce-in">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Liebes-Meister! 💘</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};

export default LoveMeter;
