import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * SequenceMemory Game - Remember emoji sequence
 * Watch a sequence of emojis, then repeat it
 */
const SequenceMemory = ({ onWin, config = {} }) => {
    const { sequenceLength = 4 } = config;

    const allEmojis = ['🐱', '❤️', '🎮', '⭐', '🌸', '🦋', '🌈', '🍕'];

    const [sequence, setSequence] = useState([]);
    const [displayedEmojis, setDisplayedEmojis] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [showingIndex, setShowingIndex] = useState(-1);
    const [gamePhase, setGamePhase] = useState('waiting'); // waiting, showing, playing, won, lost
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const generateSequence = () => {
        const newSequence = [];
        for (let i = 0; i < sequenceLength; i++) {
            const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
            newSequence.push(randomEmoji);
        }
        return newSequence;
    };

    const startGame = () => {
        const newSequence = generateSequence();
        // Use 6 random emojis for the selection buttons (including all from sequence)
        const uniqueFromSequence = [...new Set(newSequence)];
        const others = allEmojis.filter(e => !uniqueFromSequence.includes(e));
        const shuffledOthers = others.sort(() => Math.random() - 0.5);
        const displayed = [...uniqueFromSequence, ...shuffledOthers].slice(0, 6).sort(() => Math.random() - 0.5);

        setSequence(newSequence);
        setDisplayedEmojis(displayed);
        setPlayerSequence([]);
        setGamePhase('showing');
        showSequence(newSequence);
    };

    const showSequence = async (seq) => {
        for (let i = 0; i < seq.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    setShowingIndex(i);
                    setTimeout(() => {
                        setShowingIndex(-1);
                        resolve();
                    }, 600);
                }, 800);
            });
        }
        setGamePhase('playing');
    };

    const handleEmojiClick = (emoji) => {
        if (gamePhase !== 'playing') return;

        const newPlayerSequence = [...playerSequence, emoji];
        setPlayerSequence(newPlayerSequence);

        // Check if correct
        const currentIndex = newPlayerSequence.length - 1;
        if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
            setGamePhase('lost');
            return;
        }

        // Check if complete
        if (newPlayerSequence.length === sequence.length) {
            setGamePhase('won');
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'sequence-memory-1',
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
        setShowingIndex(-1);
        setGamePhase('waiting');
        setAttempts(prev => prev + 1);
    };

    const getMessage = () => {
        switch (gamePhase) {
            case 'waiting': return 'Bereit? Merk dir die Reihenfolge!';
            case 'showing': return 'Schau genau hin... 👀';
            case 'playing': return `Dein Zug! (${playerSequence.length}/${sequence.length})`;
            case 'won': return 'Perfekt! Du hast es dir gemerkt! 🧠';
            case 'lost': return 'Ups! Das war nicht richtig 😅';
            default: return '';
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
                    <span>{sequenceLength} Emojis</span>
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${gamePhase === 'won' ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {gamePhase === 'won' ? '🎉 Geschafft!' : 'Emoji-Gedächtnis 🧠'}
                </p>
            </div>

            {/* Sequence Display Area */}
            {gamePhase === 'showing' && (
                <div className="flex gap-3 mb-6 min-h-[80px] items-center justify-center">
                    {sequence.map((emoji, index) => (
                        <div
                            key={index}
                            className={`
                                w-16 h-16 rounded-xl flex items-center justify-center text-3xl
                                transition-all duration-300
                                ${showingIndex === index
                                    ? 'bg-pastel-lavender scale-110 shadow-lg border-2 border-purple-300'
                                    : 'bg-gray-200/50'
                                }
                            `}
                        >
                            {showingIndex >= index ? emoji : '?'}
                        </div>
                    ))}
                </div>
            )}

            {/* Player's Input Display */}
            {gamePhase === 'playing' && (
                <div className="flex gap-2 mb-6 min-h-[60px] items-center justify-center">
                    {sequence.map((_, index) => (
                        <div
                            key={index}
                            className={`
                                w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                                transition-all duration-300
                                ${index < playerSequence.length
                                    ? 'bg-pastel-mint border-2 border-green-300'
                                    : 'bg-gray-200/50 border-2 border-dashed border-gray-300'
                                }
                            `}
                        >
                            {playerSequence[index] || '?'}
                        </div>
                    ))}
                </div>
            )}

            {/* Emoji Selection Buttons */}
            {gamePhase === 'playing' && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {displayedEmojis.map((emoji, index) => (
                        <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="
                                w-16 h-16 rounded-xl text-3xl
                                bg-white/80 hover:bg-pastel-lavender/50
                                shadow-md hover:shadow-lg
                                transition-all duration-200
                                hover:scale-105 active:scale-95
                                border border-white/50
                            "
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Status Message */}
            <p className={`
                text-center font-medium mb-4 transition-all duration-300
                ${gamePhase === 'won' ? 'text-green-600 text-lg' : ''}
                ${gamePhase === 'lost' ? 'text-red-500' : 'text-gray-500'}
            `}>
                {getMessage()}
            </p>

            {/* Action Buttons */}
            {gamePhase === 'waiting' && (
                <button onClick={startGame} className="btn-primary">
                    Spiel starten 🎮
                </button>
            )}

            {gamePhase === 'won' && (
                <div className="flex items-center justify-center gap-2 text-green-500 animate-slide-up">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="text-lg font-bold">Elefantengedächtnis! 🐘</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}

            {gamePhase === 'lost' && (
                <button onClick={resetGame} className="btn-secondary animate-slide-up">
                    Nochmal versuchen 🔄
                </button>
            )}
        </div>
    );
};

export default SequenceMemory;
