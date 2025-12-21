import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * LuckySpin Game - Spin a wheel of fortune for love prizes
 * Physics-based spin with momentum
 */
const LuckySpin = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [won, setWon] = useState(false);
    const [prize, setPrize] = useState(null);
    const [attempts, setAttempts] = useState(0);

    const segments = [
        { label: '💋 Kuss', color: 'from-pink-400 to-pink-500', prize: 'Ein Kuss!' },
        { label: '🤗 Umarmung', color: 'from-purple-400 to-purple-500', prize: 'Eine dicke Umarmung!' },
        { label: '💝 Liebe', color: 'from-red-400 to-red-500', prize: 'Unendlich viel Liebe!' },
        { label: '⭐ Wunsch', color: 'from-yellow-400 to-yellow-500', prize: 'Ein Wunsch frei!' },
        { label: '🌸 Blume', color: 'from-rose-400 to-rose-500', prize: 'Mein Herz für dich!' },
        { label: '🎁 Date', color: 'from-indigo-400 to-indigo-500', prize: 'Ein Date zusammen!' },
        { label: '💆 Massage', color: 'from-teal-400 to-teal-500', prize: 'Eine entspannende Massage!' },
        { label: '🍫 Süßes', color: 'from-amber-400 to-amber-500', prize: 'Was Süßes zum Naschen!' },
    ];

    const segmentAngle = 360 / segments.length;

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const spin = () => {
        if (isSpinning || won) return;

        setIsSpinning(true);
        setAttempts(prev => prev + 1);

        // Random spins (3-6 full rotations) + random segment
        const spins = 3 + Math.random() * 3;
        const randomOffset = Math.random() * 360;
        const newRotation = rotation + (spins * 360) + randomOffset;

        setRotation(newRotation);

        // Determine which segment we land on (after spin completes)
        setTimeout(() => {
            const normalizedRotation = newRotation % 360;
            const segmentIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % segments.length;
            const selectedPrize = segments[segmentIndex];

            setPrize(selectedPrize);
            setWon(true);
            setIsSpinning(false);

            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'lucky-spin-1',
                        metric: 'spins',
                        value: attempts + 1,
                    });
                }
            }, 2000);
        }, 4000);
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
                    ${won ? 'text-green-500' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Gewonnen!' : 'Dreh das Glücksrad! 🎡'}
                </p>
            </div>

            {/* Wheel container */}
            <div className="relative mb-6">
                {/* Pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-gray-800 drop-shadow-lg" />
                </div>

                {/* Wheel */}
                <div
                    className="w-56 h-56 rounded-full relative shadow-2xl border-4 border-white overflow-hidden"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning
                            ? 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)'
                            : 'none',
                    }}
                >
                    {segments.map((seg, idx) => (
                        <div
                            key={idx}
                            className={`absolute w-full h-full`}
                            style={{
                                transform: `rotate(${idx * segmentAngle}deg)`,
                                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)',
                            }}
                        >
                            <div className={`
                                w-full h-full bg-gradient-to-br ${seg.color}
                                flex items-start justify-end pt-4 pr-2
                            `}>
                                <span
                                    className="text-white text-xs font-bold transform rotate-45 origin-center"
                                    style={{ transform: `rotate(${segmentAngle / 4}deg)` }}
                                >
                                    {seg.label.split(' ')[0]}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Center circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl">
                        🎰
                    </div>
                </div>
            </div>

            {/* Prize display */}
            {prize && (
                <div className="mb-4 text-center animate-bounce-in">
                    <p className="text-3xl mb-2">{prize.label.split(' ')[0]}</p>
                    <p className="text-lg font-bold text-gray-700">{prize.prize}</p>
                </div>
            )}

            {/* Spin button */}
            {!won && (
                <button
                    onClick={spin}
                    disabled={isSpinning}
                    className={`
                        px-8 py-4 rounded-2xl text-lg font-bold
                        transition-all duration-300 ease-bouncy
                        ${isSpinning
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                        }
                    `}
                >
                    {isSpinning ? '🎡 Dreht...' : '✨ Drehen!'}
                </button>
            )}

            {/* Win message */}
            {won && (
                <div className="flex items-center gap-2 text-green-500 animate-bounce-in">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Glückspilz! 🍀</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};

export default LuckySpin;
