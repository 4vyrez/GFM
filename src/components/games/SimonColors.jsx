import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * SimonColors Game - Classic Simon Says with colors
 * Watch the sequence, then repeat it
 */
const SimonColors = ({ onWin, config = {} }) => {
    const { sequenceLength = 4 } = config;

    const colors = [
        { id: 0, name: 'Rosa', bg: 'bg-pastel-pink', active: 'bg-pink-400', ring: 'ring-pink-300' },
        { id: 1, name: 'Lila', bg: 'bg-pastel-lavender', active: 'bg-purple-400', ring: 'ring-purple-300' },
        { id: 2, name: 'Mint', bg: 'bg-pastel-mint', active: 'bg-green-400', ring: 'ring-green-300' },
        { id: 3, name: 'Blau', bg: 'bg-pastel-blue', active: 'bg-blue-400', ring: 'ring-blue-300' },
    ];

    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [activeColor, setActiveColor] = useState(null);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [gamePhase, setGamePhase] = useState('waiting'); // waiting, showing, playing, won, lost
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const generateSequence = () => {
        const newSequence = [];
        for (let i = 0; i < sequenceLength; i++) {
            newSequence.push(Math.floor(Math.random() * 4));
        }
        return newSequence;
    };

    const startGame = () => {
        const newSequence = generateSequence();
        setSequence(newSequence);
        setPlayerSequence([]);
        setGamePhase('showing');
        showSequence(newSequence);
    };

    const showSequence = async (seq) => {
        setIsShowingSequence(true);

        for (let i = 0; i < seq.length; i++) {
            await new Promise(resolve => {
                timeoutRef.current = setTimeout(() => {
                    setActiveColor(seq[i]);
                    setTimeout(() => {
                        setActiveColor(null);
                        resolve();
                    }, 400);
                }, 600);
            });
        }

        setIsShowingSequence(false);
        setGamePhase('playing');
    };

    const handleColorClick = (colorId) => {
        if (gamePhase !== 'playing') return;

        // Flash the color
        setActiveColor(colorId);
        setTimeout(() => setActiveColor(null), 200);

        const newPlayerSequence = [...playerSequence, colorId];
        setPlayerSequence(newPlayerSequence);

        // Check if correct so far
        const currentIndex = newPlayerSequence.length - 1;
        if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
            // Wrong!
            setGamePhase('lost');
            return;
        }

        // Check if complete
        if (newPlayerSequence.length === sequence.length) {
            setGamePhase('won');
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'simon-colors-1',
                        metric: 'attempts',
                        value: attempts,
                    });
                }
            }, 1500);
        }
    };

    const resetGame = () => {
        setSequence([]);
        setPlayerSequence([]);
        setActiveColor(null);
        setGamePhase('waiting');
        setAttempts(prev => prev + 1);
    };

    const getMessage = () => {
        switch (gamePhase) {
            case 'waiting':
                return 'Bereit? Starte das Spiel!';
            case 'showing':
                return 'Schau genau hin... 👀';
            case 'playing':
                return `Dein Zug! (${playerSequence.length}/${sequence.length})`;
            case 'won':
                return 'Perfektes Gedächtnis! 🧠✨';
            case 'lost':
                return 'Ups! Falsche Farbe 😅';
            default:
                return '';
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
            <div className="text-center mb-6 w-full">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 mb-3 shadow-sm border border-white/50">
                    <span>Versuch #{attempts}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{sequenceLength} Farben</span>
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${gamePhase === 'won' ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {gamePhase === 'won' ? '🎉 Geschafft!' : 'Merk dir die Reihenfolge! 🎨'}
                </p>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {colors.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => handleColorClick(color.id)}
                        disabled={gamePhase !== 'playing'}
                        className={`
                            w-24 h-24 rounded-2xl
                            transition-all duration-200
                            ${activeColor === color.id
                                ? `${color.active} scale-110 ring-4 ${color.ring} shadow-lg`
                                : `${color.bg} hover:scale-105`
                            }
                            ${gamePhase === 'playing' ? 'cursor-pointer' : 'cursor-default'}
                            ${gamePhase === 'showing' && activeColor === color.id ? 'animate-pulse' : ''}
                            shadow-md border border-white/50
                        `}
                    />
                ))}
            </div>

            {/* Progress Dots */}
            {gamePhase === 'playing' && (
                <div className="flex gap-2 mb-6">
                    {sequence.map((_, index) => (
                        <div
                            key={index}
                            className={`
                                w-3 h-3 rounded-full transition-all duration-300
                                ${index < playerSequence.length
                                    ? 'bg-green-400 scale-110'
                                    : 'bg-gray-300'
                                }
                            `}
                        />
                    ))}
                </div>
            )}

            {/* Status Message */}
            <p className={`
                text-center font-medium mb-6 transition-all duration-300
                ${gamePhase === 'won' ? 'text-green-600 text-lg' : ''}
                ${gamePhase === 'lost' ? 'text-red-500' : 'text-gray-500'}
            `}>
                {getMessage()}
            </p>

            {/* Action Buttons */}
            {gamePhase === 'waiting' && (
                <button
                    onClick={startGame}
                    className="btn-primary"
                >
                    Spiel starten 🎮
                </button>
            )}

            {gamePhase === 'won' && (
                <div className="flex items-center justify-center gap-2 text-green-500 animate-slide-up">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="text-lg font-bold">Super Gedächtnis! 🧠</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}

            {gamePhase === 'lost' && (
                <button
                    onClick={resetGame}
                    className="btn-secondary animate-slide-up"
                >
                    Nochmal versuchen 🔄
                </button>
            )}
        </div>
    );
};

export default SimonColors;
