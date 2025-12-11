import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * Premium Color Match Game with wave transitions
 */
const ColorMatch = ({ onWin }) => {
    const colors = [
        { name: 'Rosa', value: 'from-pastel-pink to-pink-300', emoji: '🌸', glow: 'shadow-glow-pink' },
        { name: 'Blau', value: 'from-pastel-blue to-blue-300', emoji: '💙', glow: 'shadow-glow-blue' },
        { name: 'Lavendel', value: 'from-pastel-lavender to-purple-300', emoji: '💜', glow: 'shadow-[0_0_20px_rgba(230,230,250,0.6)]' },
        { name: 'Pfirsich', value: 'from-pastel-peach to-orange-200', emoji: '🍑', glow: 'shadow-[0_0_20px_rgba(255,218,185,0.6)]' },
    ];

    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameState, setGameState] = useState('ready');
    const [level, setLevel] = useState(1);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [activeColor, setActiveColor] = useState(null);
    const buttonRefs = useRef([]);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const startGame = () => {
        const newSequence = [Math.floor(Math.random() * 4)];
        setSequence(newSequence);
        setPlayerSequence([]);
        setLevel(1);
        showSequence(newSequence);
    };

    const showSequence = async (seq) => {
        setGameState('showing');
        setIsPlaying(true);

        await new Promise(resolve => setTimeout(resolve, 600));

        for (let i = 0; i < seq.length; i++) {
            const colorIndex = seq[i];
            setActiveColor(colorIndex);

            await new Promise(resolve => setTimeout(resolve, 700));
            setActiveColor(null);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        setIsPlaying(false);
        setGameState('input');
    };

    const handleColorClick = (colorIndex) => {
        if (isPlaying || gameState !== 'input') return;

        // Briefly highlight the clicked color
        setActiveColor(colorIndex);
        setTimeout(() => setActiveColor(null), 200);

        const newPlayerSequence = [...playerSequence, colorIndex];
        setPlayerSequence(newPlayerSequence);

        const isCorrect = sequence[newPlayerSequence.length - 1] === colorIndex;

        if (!isCorrect) {
            setGameState('wrong');
            return;
        }

        if (newPlayerSequence.length === sequence.length) {
            setGameState('correct');

            setTimeout(() => {
                if (level >= 5) {
                    setGameState('won');
                    setTimeout(() => {
                        if (onWin) {
                            onWin({
                                gameId: 'color-match-1',
                                metric: 'level',
                                value: level,
                            });
                        }
                    }, 1500);
                } else {
                    const newLevel = level + 1;
                    setLevel(newLevel);
                    const newSequence = [...sequence, Math.floor(Math.random() * 4)];
                    setSequence(newSequence);
                    setPlayerSequence([]);
                    showSequence(newSequence);
                }
            }, 1000);
        }
    };

    const resetGame = () => {
        setGameState('ready');
        setSequence([]);
        setPlayerSequence([]);
        setLevel(1);
        setAttempts(prev => prev + 1);
        setActiveColor(null);
    };

    const getMessage = () => {
        if (gameState === 'ready') return 'Merke dir die Farbreihenfolge!';
        if (gameState === 'showing') return 'Schau genau hin... 👀';
        if (gameState === 'input') return `Wiederhole die Reihenfolge! (${playerSequence.length}/${sequence.length})`;
        if (gameState === 'correct') return '✅ Richtig! Weiter so!';
        if (gameState === 'wrong') return '❌ Ups, falsch!';
        if (gameState === 'won') return '🎉 Alle 5 Level geschafft!';
        return '';
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
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 badge mb-3">
                    <span>Versuch #{attempts}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>Level {level}/5</span>
                </div>

                <p className={`
                    text-xl font-bold min-h-[28px] transition-all duration-300
                    ${gameState === 'correct' || gameState === 'won' ? 'text-green-500' : ''}
                    ${gameState === 'wrong' ? 'text-red-400' : 'text-gray-700'}
                `}>
                    {getMessage()}
                </p>
            </div>

            {/* Level Progress */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((l) => (
                    <div
                        key={l}
                        className={`
                            w-8 h-2 rounded-full transition-all duration-500
                            ${l <= level
                                ? 'bg-gradient-to-r from-pastel-pink to-pastel-lavender'
                                : 'bg-gray-200'}
                            ${l === level ? 'animate-pulse' : ''}
                        `}
                    />
                ))}
            </div>

            {/* Color Buttons */}
            <div className="perspective-1000 w-full max-w-sm mx-auto mb-6">
                <div className="grid grid-cols-2 gap-4 p-5 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-3xl shadow-glass border border-white/50">
                    {colors.map((color, index) => (
                        <button
                            key={index}
                            ref={el => buttonRefs.current[index] = el}
                            onClick={() => handleColorClick(index)}
                            disabled={isPlaying || gameState === 'ready' || gameState === 'correct' || gameState === 'wrong' || gameState === 'won'}
                            className={`
                                aspect-square rounded-2xl text-5xl
                                flex items-center justify-center
                                bg-gradient-to-br ${color.value}
                                transition-all duration-300 ease-bouncy
                                border-2 border-white/50
                                ${activeColor === index
                                    ? `scale-110 ${color.glow} ring-4 ring-white`
                                    : 'shadow-md'}
                                ${gameState === 'input'
                                    ? 'hover:scale-105 active:scale-95 cursor-pointer'
                                    : 'cursor-default'}
                                ${gameState === 'showing' && activeColor !== index ? 'opacity-50' : ''}
                            `}
                        >
                            <span className={activeColor === index ? 'animate-bounce-in' : ''}>
                                {color.emoji}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Dots */}
            {sequence.length > 0 && gameState === 'input' && (
                <div className="flex gap-2 mb-6">
                    {sequence.map((colorIdx, index) => (
                        <div
                            key={index}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className={`
                                w-4 h-4 rounded-full transition-all duration-300 ease-bouncy
                                ${index < playerSequence.length
                                    ? `bg-gradient-to-br ${colors[colorIdx].value} scale-110 shadow-sm`
                                    : 'bg-gray-200 scale-100'}
                            `}
                        />
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            {gameState === 'ready' && (
                <button
                    onClick={startGame}
                    className="btn-primary animate-fade-in"
                >
                    Spiel starten 🎮
                </button>
            )}

            {(gameState === 'wrong' || gameState === 'won') && (
                <div className="text-center animate-slide-up">
                    {gameState === 'won' && (
                        <div className="flex items-center justify-center gap-2 text-green-500 mb-3">
                            <SparkleIcon className="w-5 h-5" />
                            <span className="font-bold">Perfekt gemeistert!</span>
                            <SparkleIcon className="w-5 h-5" />
                        </div>
                    )}
                    <button
                        onClick={resetGame}
                        className="btn-secondary"
                    >
                        {gameState === 'won' ? 'Nochmal spielen 🔄' : 'Nochmal versuchen 🔄'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ColorMatch;
