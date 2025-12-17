import { useState, useEffect, useCallback } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * EmojiScramble Game - Unscramble emoji letters to form a word
 * Drag/tap emojis into correct order
 */
const EmojiScramble = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [currentWord, setCurrentWord] = useState(null);
    const [scrambled, setScrambled] = useState([]);
    const [selected, setSelected] = useState([]);
    const [shake, setShake] = useState(false);

    // Love-themed words with emoji representations
    const words = [
        { word: 'LOVE', emojis: ['💖', '🌸', '✨', '💫'] },
        { word: 'HERZ', emojis: ['❤️', '💗', '💕', '💓'] },
        { word: 'KUSS', emojis: ['💋', '😘', '💏', '💑'] },
        { word: 'SÜSS', emojis: ['🍬', '🍭', '🧁', '🍩'] },
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        initGame();
    }, []);

    const initGame = () => {
        const word = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(word);
        // Shuffle the emojis
        const shuffled = [...word.emojis]
            .map((emoji, idx) => ({ emoji, originalIndex: idx, id: idx }))
            .sort(() => Math.random() - 0.5);
        setScrambled(shuffled);
        setSelected([]);
    };

    const handleEmojiClick = (item) => {
        if (won || selected.find(s => s.id === item.id)) return;

        const newSelected = [...selected, item];
        setSelected(newSelected);

        // Check if complete
        if (newSelected.length === currentWord.emojis.length) {
            setAttempts(prev => prev + 1);

            // Check if correct order
            const isCorrect = newSelected.every((s, idx) => s.originalIndex === idx);

            if (isCorrect) {
                setWon(true);
                setTimeout(() => {
                    if (onWin) {
                        onWin({
                            gameId: 'emoji-scramble-1',
                            metric: 'attempts',
                            value: attempts + 1,
                        });
                    }
                }, 1500);
            } else {
                // Wrong - shake and reset
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                    setSelected([]);
                }, 600);
            }
        }
    };

    const resetSelection = () => {
        if (!won) setSelected([]);
    };

    if (!currentWord) return null;

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
                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Perfekt!' : `Sortiere: "${currentWord.word}"`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    {won ? 'Du hast es geschafft!' : 'Tippe die Emojis in der richtigen Reihenfolge'}
                </p>
            </div>

            {/* Selected area (answer slots) */}
            <div className={`
                flex gap-3 mb-6 p-4 rounded-2xl
                bg-white/60 backdrop-blur-sm border-2 border-dashed
                ${shake ? 'animate-shake border-red-300' : 'border-gray-200'}
                ${won ? 'border-green-400 bg-green-50/50' : ''}
                transition-all duration-300
            `}>
                {currentWord.emojis.map((_, idx) => (
                    <div
                        key={idx}
                        className={`
                            w-14 h-14 rounded-xl flex items-center justify-center
                            text-3xl transition-all duration-300
                            ${selected[idx]
                                ? 'bg-white shadow-md scale-100'
                                : 'bg-gray-100/50 scale-95'
                            }
                            ${won && selected[idx]?.originalIndex === idx ? 'ring-2 ring-green-400' : ''}
                        `}
                    >
                        {selected[idx]?.emoji || ''}
                    </div>
                ))}
            </div>

            {/* Scrambled emojis to pick from */}
            <div className="flex gap-3 flex-wrap justify-center">
                {scrambled.map((item) => {
                    const isUsed = selected.find(s => s.id === item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleEmojiClick(item)}
                            disabled={won || isUsed}
                            className={`
                                w-16 h-16 rounded-2xl text-3xl
                                flex items-center justify-center
                                transition-all duration-300 ease-bouncy
                                ${isUsed
                                    ? 'bg-gray-100 opacity-30 scale-90 cursor-not-allowed'
                                    : 'bg-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95'
                                }
                                border border-white/50
                            `}
                        >
                            {item.emoji}
                        </button>
                    );
                })}
            </div>

            {/* Reset button */}
            {selected.length > 0 && !won && (
                <button
                    onClick={resetSelection}
                    className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ↩️ Zurücksetzen
                </button>
            )}

            {/* Attempts counter */}
            <p className="mt-4 text-xs text-gray-400">
                Versuche: {attempts}
            </p>

            {/* Win message */}
            {won && (
                <div className="mt-6 flex items-center gap-2 text-green-500 animate-bounce-in">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Emoji-Meister! 🏆</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};

export default EmojiScramble;
