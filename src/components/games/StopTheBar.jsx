import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * StopTheBar Game - Stop in the green zone
 * A moving indicator loops across a bar, click to stop it in the target zone
 */
const StopTheBar = ({ onWin, config = {} }) => {
    const { targetWidth = 15 } = config; // Width of green zone as percentage
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isRunning, setIsRunning] = useState(true);
    const [stopped, setStopped] = useState(false);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const intervalRef = useRef(null);

    // Target zone is in the middle
    const targetStart = (100 - targetWidth) / 2;
    const targetEnd = targetStart + targetWidth;

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    useEffect(() => {
        if (isRunning && !stopped) {
            intervalRef.current = setInterval(() => {
                setPosition(prev => {
                    let newPos = prev + direction * 2;
                    if (newPos >= 100) {
                        setDirection(-1);
                        return 100;
                    }
                    if (newPos <= 0) {
                        setDirection(1);
                        return 0;
                    }
                    return newPos;
                });
            }, 20);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, direction, stopped]);

    const handleStop = () => {
        if (stopped) return;
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setStopped(true);

        // Check if in target zone
        if (position >= targetStart && position <= targetEnd) {
            setWon(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'stop-the-bar-1',
                        metric: 'attempts',
                        value: attempts,
                    });
                }
            }, 1500);
        }
    };

    const resetGame = () => {
        setPosition(0);
        setDirection(1);
        setIsRunning(true);
        setStopped(false);
        setWon(false);
        setAttempts(prev => prev + 1);
    };

    const getDistance = () => {
        if (position < targetStart) return targetStart - position;
        if (position > targetEnd) return position - targetEnd;
        return 0;
    };

    const getMessage = () => {
        if (!stopped) return 'Stoppe den Balken in der grünen Zone!';
        if (won) return 'Perfekt getroffen! 🎯';
        const distance = getDistance();
        if (distance < 10) return 'So knapp! Fast drin! 😅';
        if (distance < 20) return 'Nah dran! Versuchs nochmal! 💪';
        return 'Noch üben! Du schaffst das! 🌟';
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
            <div className="text-center mb-6 w-full">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 mb-3 shadow-sm border border-white/50">
                    <span>Versuch #{attempts}</span>
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Treffer!' : 'Stopp! 🛑'}
                </p>
            </div>

            {/* Bar Container */}
            <div className="w-full max-w-sm mb-8">
                <div className="relative h-14 bg-gray-200/80 rounded-full overflow-hidden shadow-inner border border-white/50">
                    {/* Target Zone (Green) */}
                    <div
                        className="absolute top-0 bottom-0 bg-gradient-to-b from-green-400 to-green-500"
                        style={{
                            left: `${targetStart}%`,
                            width: `${targetWidth}%`,
                        }}
                    />

                    {/* Moving Indicator */}
                    <div
                        className={`
                            absolute top-1 bottom-1 w-3 rounded-full
                            transition-none
                            ${stopped
                                ? won
                                    ? 'bg-gradient-to-b from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50'
                                    : 'bg-gradient-to-b from-red-400 to-red-600'
                                : 'bg-gradient-to-b from-pastel-lavender to-pastel-pink shadow-md'
                            }
                        `}
                        style={{
                            left: `calc(${position}% - 6px)`,
                        }}
                    />
                </div>

                {/* Zone Labels */}
                <div className="flex justify-between mt-2 px-2 text-xs text-gray-400">
                    <span>Start</span>
                    <span className="text-green-600 font-medium">🎯 Ziel</span>
                    <span>Ende</span>
                </div>
            </div>

            {/* Stop Button */}
            {!stopped && (
                <button
                    onClick={handleStop}
                    className="
                        w-40 h-16 rounded-2xl font-bold text-white text-xl
                        bg-gradient-to-br from-red-400 to-red-600
                        shadow-lg shadow-red-300/50
                        transform transition-all duration-150
                        hover:scale-105 active:scale-95
                    "
                >
                    STOPP! 🛑
                </button>
            )}

            {/* Result Message */}
            <p className={`
                text-center mt-6 font-medium transition-all duration-300
                ${won ? 'text-green-600 text-lg' : 'text-gray-500'}
            `}>
                {getMessage()}
            </p>

            {/* Result Actions */}
            {stopped && (
                <div className="mt-6 animate-slide-up">
                    {won ? (
                        <div className="flex items-center justify-center gap-2 text-green-500">
                            <SparkleIcon className="w-5 h-5" />
                            <p className="text-lg font-bold">Super Reflexe! ⚡</p>
                            <SparkleIcon className="w-5 h-5" />
                        </div>
                    ) : (
                        <button
                            onClick={resetGame}
                            className="btn-secondary"
                        >
                            Nochmal versuchen 🔄
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default StopTheBar;
