import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * BiteMeter Game - Set your "bite level" (insider joke)
 * Always wins with a sweet message regardless of level
 */
const BiteMeter = ({ onWin }) => {
    const [level, setLevel] = useState(50);
    const [confirmed, setConfirmed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleConfirm = () => {
        setConfirmed(true);
        setTimeout(() => {
            if (onWin) {
                onWin({
                    gameId: 'bite-meter-1',
                    metric: 'level',
                    value: level,
                });
            }
        }, 2000);
    };

    const getMessage = () => {
        if (level < 20) return { text: 'Unglaublich brav heute! 😇', emoji: '🐱' };
        if (level < 40) return { text: 'Nur kleine Knabbereien? 😏', emoji: '🦊' };
        if (level < 60) return { text: 'Die perfekte Balance! 💕', emoji: '🐰' };
        if (level < 80) return { text: 'Okay, bisschen wild heute! 😈', emoji: '🐺' };
        return { text: 'CHAOS-BISS aktiviert! 🔥', emoji: '🦈' };
    };

    const getGradient = () => {
        if (level < 30) return 'from-green-300 to-green-400';
        if (level < 60) return 'from-yellow-300 to-orange-400';
        if (level < 80) return 'from-orange-400 to-red-400';
        return 'from-red-400 to-pink-500';
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
                    <span>🦷 Insider Game</span>
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${confirmed ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {confirmed ? '🎉 Level bestätigt!' : 'Biss-Level einstellen 🦷'}
                </p>
            </div>

            {!confirmed ? (
                <>
                    {/* Level Display */}
                    <div className="text-center mb-6">
                        <div className={`
                            text-6xl font-black bg-gradient-to-r ${getGradient()}
                            bg-clip-text text-transparent
                            transition-all duration-300
                        `}>
                            {level}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">/ 100</p>
                    </div>

                    {/* Emoji Indicator */}
                    <div className="text-5xl mb-6 transition-all duration-300">
                        {getMessage().emoji}
                    </div>

                    {/* Slider */}
                    <div className="w-full max-w-xs mb-6">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>😇 Brav</span>
                            <span>Chaos 🦈</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value))}
                            className="w-full h-4 rounded-full appearance-none cursor-pointer
                                       bg-gradient-to-r from-green-300 via-yellow-300 via-orange-400 to-red-400"
                            style={{
                                WebkitAppearance: 'none',
                            }}
                        />

                        {/* Level Labels */}
                        <div className="flex justify-between mt-2">
                            {[0, 25, 50, 75, 100].map((mark) => (
                                <span
                                    key={mark}
                                    className={`text-xs ${level >= mark ? 'text-gray-600' : 'text-gray-300'}`}
                                >
                                    {mark}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Preview Message */}
                    <p className="text-gray-500 text-sm mb-6 text-center">
                        {getMessage().text}
                    </p>

                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        className="btn-primary"
                    >
                        Level bestätigen ✓
                    </button>
                </>
            ) : (
                <div className="text-center animate-slide-up py-6">
                    <div className="text-6xl mb-4 animate-bounce-in">
                        {getMessage().emoji}
                    </div>

                    <p className="text-2xl font-bold text-gray-800 mb-2">
                        Biss-Level: {level}
                    </p>

                    <p className="text-gray-600 mb-6 max-w-xs">
                        {getMessage().text}
                    </p>

                    <div className="bg-pastel-pink/30 rounded-2xl p-4 max-w-xs mx-auto mb-6">
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Egal ob Level 10 oder 100 –
                            <strong> ich mag dich trotzdem</strong> 💕
                            <br />
                            <span className="text-xs text-gray-500">
                                (Auch wenn du mich manchmal beißt 😅)
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-green-500">
                        <SparkleIcon className="w-5 h-5" />
                        <p className="font-bold">Du bist perfekt so! 💕</p>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiteMeter;
