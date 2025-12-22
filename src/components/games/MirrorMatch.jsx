import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * MirrorMatch Game - Find matching emoji pairs
 * Memory-style matching game with a twist
 */
const MirrorMatch = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [won, setWon] = useState(false);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    const emojiPairs = ['💕', '💖', '🌸', '✨', '🦋', '🌈', '🌺', '💫'];

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        initGame();
        return () => clearTimeout(timer);
    }, []);

    const initGame = () => {
        // Create pairs and shuffle
        const pairs = [...emojiPairs, ...emojiPairs];
        const shuffled = pairs
            .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false }))
            .sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
    };

    const handleCardClick = (card) => {
        if (won || isChecking || flipped.length >= 2) return;
        if (flipped.find(f => f.id === card.id)) return;
        if (matched.includes(card.emoji)) return;

        const newFlipped = [...flipped, card];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            setIsChecking(true);

            const [first, second] = newFlipped;

            if (first.emoji === second.emoji) {
                // Match!
                setTimeout(() => {
                    setMatched(prev => [...prev, first.emoji]);
                    setFlipped([]);
                    setIsChecking(false);

                    // Check win
                    if (matched.length + 1 === emojiPairs.length) {
                        setWon(true);
                        setTimeout(() => {
                            if (onWin) {
                                onWin({
                                    gameId: 'mirror-match-1',
                                    metric: 'moves',
                                    value: moves + 1,
                                });
                            }
                        }, 1500);
                    }
                }, 500);
            } else {
                // No match - flip back
                setTimeout(() => {
                    setFlipped([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    const isCardFlipped = (card) => {
        return flipped.find(f => f.id === card.id) || matched.includes(card.emoji);
    };

    const isCardMatched = (card) => {
        return matched.includes(card.emoji);
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
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Alle gefunden!' : 'Finde die Paare! 🔮'}
                </p>

                <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Züge: <span className="font-bold text-gray-700">{moves}</span></span>
                    <span>Paare: <span className="font-bold text-gray-700">{matched.length}/{emojiPairs.length}</span></span>
                </div>
            </div>

            {/* Card grid - FIXED: consistent gap, better touch targets */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-xs mx-auto">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(card)}
                        disabled={won || isCardMatched(card)}
                        aria-label={isCardFlipped(card) ? card.emoji : 'Hidden card'}
                        className={`
                            relative aspect-square rounded-xl
                            flex items-center justify-center
                            text-2xl
                            transition-all duration-300 ease-bouncy
                            touch-manipulation
                            ${isCardFlipped(card)
                                ? isCardMatched(card)
                                    ? 'bg-green-100 border-2 border-green-400 scale-95'
                                    : 'bg-white shadow-lg'
                                : 'bg-gradient-to-br from-pastel-pink to-pastel-lavender hover:scale-105 active:scale-95 shadow-md'
                            }
                            ${isChecking && flipped.find(f => f.id === card.id) && !isCardMatched(card)
                                ? 'ring-2 ring-yellow-400'
                                : ''
                            }
                        `}
                    >
                        <span className={`
                            transition-all duration-300
                            ${isCardFlipped(card) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                        `}>
                            {card.emoji}
                        </span>
                        {!isCardFlipped(card) && (
                            <span className="text-white/60 text-lg select-none">?</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Win celebration */}
            {won && (
                <div className="mt-6 flex items-center gap-2 text-green-500 animate-bounce-in">
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                    <p className="font-bold">Gedächtnisprofi! 🧠</p>
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                </div>
            )}

            {/* Hint */}
            <p className="mt-4 text-xs text-gray-400">
                {won ? `Geschafft in ${moves} Zügen!` : 'Merke dir die Positionen'}
            </p>
        </div>
    );
};

export default MirrorMatch;
