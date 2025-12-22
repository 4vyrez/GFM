import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * ChargeBar Game - Hold & Release
 * Hold the button to charge, release at 90-100% to win
 */
const ChargeBar = ({ onWin }) => {
    const [charge, setCharge] = useState(0);
    const [isCharging, setIsCharging] = useState(false);
    const [released, setReleased] = useState(false);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [doubleMode, setDoubleMode] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => {
            clearTimeout(timer);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startCharging = () => {
        if (released || won) return;
        setIsCharging(true);
        intervalRef.current = setInterval(() => {
            setCharge(prev => {
                if (prev >= 100) {
                    clearInterval(intervalRef.current);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
    };

    const stopCharging = () => {
        if (!isCharging || released) return;
        clearInterval(intervalRef.current);
        setIsCharging(false);
        setReleased(true);

        // Win condition: 90-100% (or 95-100% in double mode)
        const winThreshold = doubleMode ? 95 : 90;
        if (charge >= winThreshold && charge <= 100) {
            setWon(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'charge-bar-1',
                        metric: 'accuracy',
                        value: doubleMode ? charge * 2 : charge,
                    });
                }
            }, 1500);
        }
    };

    const resetGame = () => {
        setCharge(0);
        setIsCharging(false);
        setReleased(false);
        setWon(false);
        setAttempts(prev => prev + 1);
    };

    const getChargeColor = () => {
        if (charge < 50) return 'from-red-400 to-orange-400';
        if (charge < 80) return 'from-orange-400 to-yellow-400';
        if (charge < 90) return 'from-yellow-400 to-green-400';
        return 'from-green-400 to-emerald-500';
    };

    const getMessage = () => {
        if (!released) return doubleMode ? 'DOUBLE MODE! Halte bei 95-100%! 🔥' : 'Halte gedrückt und lass bei ~100% los!';
        if (won) return `${doubleMode ? '🔥 DOUBLE! ' : ''}Perfekt! Du hast bei ${charge}% losgelassen! 🎯`;
        if (charge >= 100) return 'Zu spät! Der Balken war schon voll 😅';
        if (charge >= 80) return `${charge}% - So nah dran! Versuch's nochmal! 💪`;
        return `${charge}% - Fast! Noch etwas länger halten! 🔋`;
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
                    {won ? '🎉 Geschafft!' : 'Lade auf! ⚡'}
                </p>
            </div>

            {/* Charge Bar Container */}
            <div className="w-full max-w-xs mb-6">
                <div className="relative h-12 bg-gray-200/80 rounded-full overflow-hidden shadow-inner border border-white/50">
                    {/* Charge Fill */}
                    <div
                        className={`
                            absolute inset-y-0 left-0 bg-gradient-to-r ${getChargeColor()}
                            transition-all duration-75 ease-out
                            ${isCharging ? 'animate-pulse' : ''}
                        `}
                        style={{ width: `${charge}%` }}
                    />

                    {/* Target Zone Indicator (90-100%) */}
                    <div className="absolute right-0 top-0 bottom-0 w-[10%] bg-green-500/30 border-l-2 border-dashed border-green-500" aria-hidden="true" />

                    {/* Percentage Display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`
                            text-2xl font-black
                            ${charge > 50 ? 'text-white drop-shadow-md' : 'text-gray-600'}
                        `}>
                            {charge}%
                        </span>
                    </div>
                </div>

                {/* Target Label */}
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-green-600 font-medium">Ziel: 90-100%</span>
                </div>
            </div>

            {/* Charge Button */}
            {!released && (
                <button
                    onMouseDown={startCharging}
                    onMouseUp={stopCharging}
                    onMouseLeave={stopCharging}
                    onTouchStart={startCharging}
                    onTouchEnd={stopCharging}
                    className={`
                        w-32 h-32 rounded-full font-bold text-white text-lg
                        shadow-lg transform transition-all duration-150
                        ${isCharging
                            ? 'bg-gradient-to-br from-orange-400 to-red-500 scale-95 shadow-orange-300/50'
                            : 'bg-gradient-to-br from-pastel-lavender to-pastel-pink hover:scale-105'
                        }
                    `}
                >
                    {isCharging ? '⚡ LADEN...' : '👆 HALTEN'}
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
            {released && (
                <div className="mt-6 animate-slide-up">
                    {won ? (
                        <div className="flex items-center justify-center gap-2 text-green-500">
                            <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                            <p className="text-lg font-bold">Perfektes Timing! 🎯</p>
                            <SparkleIcon className="w-5 h-5" aria-hidden="true" />
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

export default ChargeBar;
