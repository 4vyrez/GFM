import { useState, useEffect } from 'react';
import { HeartIcon, SparkleIcon } from '../icons/Icons';

/**
 * Premium Find the Heart Game with floating animations
 */
const FindTheHeart = ({ onWin }) => {
    const gridSize = 20;
    const [heartPosition, setHeartPosition] = useState(null);
    const [found, setFound] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [clicks, setClicks] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [revealedCells, setRevealedCells] = useState([]);
    const [nearHeart, setNearHeart] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        initializeGame();
    }, []);

    const initializeGame = () => {
        const position = Math.floor(Math.random() * gridSize);
        setHeartPosition(position);
        setFound(false);
        setClicks(0);
        setRevealedCells([]);
        setNearHeart(false);
    };

    // Check if index is adjacent to heart
    const isNearby = (index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const heartRow = Math.floor(heartPosition / 4);
        const heartCol = heartPosition % 4;

        return Math.abs(row - heartRow) <= 1 && Math.abs(col - heartCol) <= 1 && index !== heartPosition;
    };

    const handleCellClick = (index) => {
        if (found || revealedCells.includes(index)) return;

        setClicks(prev => prev + 1);
        setRevealedCells(prev => [...prev, index]);
        setNearHeart(isNearby(index));

        if (index === heartPosition) {
            setFound(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'find-the-heart-1',
                        metric: 'attempts',
                        value: clicks + 1
                    });
                }
            }, 1500);
        }
    };

    const resetGame = () => {
        initializeGame();
        setAttempts(prev => prev + 1);
    };

    const getCellEmoji = (index) => {
        if (found && index === heartPosition) return null; // Will render HeartIcon
        if (revealedCells.includes(index)) {
            if (isNearby(index)) return '🔥'; // Hot
            return '❄️'; // Cold
        }
        return '💭';
    };

    return (
        <div
            className={`
                flex flex-col items-center w-full
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {/* Floating hearts background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-pastel-pink/20 animate-float"
                        style={{
                            left: `${10 + i * 20}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            fontSize: `${20 + Math.random() * 20}px`
                        }}
                    >
                        ❤️
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="text-center mb-6 relative z-10">
                <div className="inline-flex items-center gap-2 badge mb-3">
                    <span>Versuch #{attempts}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{clicks} {clicks === 1 ? 'Klick' : 'Klicks'}</span>
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${found ? 'text-pink-500 scale-105' : 'text-gray-700'}
                `}>
                    {found ? '🎉 Herz gefunden!' : 'Finde das versteckte Herz! 💕'}
                </p>

                {/* Hint indicator */}
                {!found && clicks > 0 && (
                    <p className={`
                        text-sm mt-2 font-medium transition-all duration-300
                        ${nearHeart ? 'text-orange-500' : 'text-blue-400'}
                    `}>
                        {nearHeart ? '🔥 Heiß! Du bist nah dran!' : '❄️ Kalt! Woanders suchen...'}
                    </p>
                )}
            </div>

            {/* Grid with premium styling */}
            <div className="perspective-1000 w-full max-w-sm mx-auto mb-6 relative z-10">
                <div className="grid grid-cols-4 gap-3 p-4 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl shadow-glass border border-white/50">
                    {Array.from({ length: gridSize }).map((_, index) => {
                        const isRevealed = revealedCells.includes(index);
                        const isHeart = found && index === heartPosition;
                        const isNear = isRevealed && isNearby(index);

                        return (
                            <button
                                key={index}
                                onClick={() => handleCellClick(index)}
                                disabled={found || isRevealed}
                                style={{ animationDelay: `${index * 30}ms` }}
                                className={`
                                    aspect-square rounded-xl text-2xl
                                    flex items-center justify-center
                                    transition-all duration-300 ease-bouncy
                                    ${isHeart
                                        ? 'bg-gradient-to-br from-pink-200 to-pink-100 scale-110 shadow-glow-pink animate-heartbeat'
                                        : isRevealed
                                            ? isNear
                                                ? 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200'
                                                : 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200'
                                            : 'bg-white/80 hover:bg-pastel-pink/30 hover:scale-105 hover:shadow-md cursor-pointer'
                                    }
                                    ${!isRevealed && !found ? 'active:scale-90' : ''}
                                    border border-white/50 shadow-sm
                                    ${found && !isHeart ? 'opacity-40' : ''}
                                `}
                            >
                                {isHeart ? (
                                    <HeartIcon className="w-8 h-8 animate-bounce-in" animated />
                                ) : (
                                    <span className={isRevealed ? 'animate-pop-in' : ''}>
                                        {getCellEmoji(index)}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Result Message */}
            {found && (
                <div className="text-center mb-6 animate-slide-up relative z-10">
                    <div className="flex items-center justify-center gap-2 text-pink-500 mb-2">
                        <SparkleIcon className="w-5 h-5" />
                        <p className="text-lg font-bold">
                            Gefunden in {clicks} {clicks === 1 ? 'Versuch' : 'Versuchen'}! 🎯
                        </p>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-500">
                        {clicks <= 3 && 'Wow, super Glück! 🍀'}
                        {clicks > 3 && clicks <= 8 && 'Gut gemacht! ✨'}
                        {clicks > 8 && 'Du hast es geschafft! 💪'}
                    </p>
                </div>
            )}

            {/* Reset Button */}
            {found && (
                <button
                    onClick={resetGame}
                    className="btn-secondary animate-fade-in relative z-10"
                >
                    Nochmal spielen 🔄
                </button>
            )}

            {/* Instructions */}
            {!found && clicks === 0 && (
                <p className="text-xs text-gray-400 text-center mt-4 relative z-10">
                    Tipp: 🔥 = warm (nah dran), ❄️ = kalt (weit weg)
                </p>
            )}
        </div>
    );
};

export default FindTheHeart;
