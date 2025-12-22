import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * Premium Memory Cards Game with 3D flip animations
 */
const MemoryCards = ({ onWin }) => {
    const emojis = ['❤️', '💕', '🌸', '🌹', '⭐', '✨', '🦋', '🌈'];
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);
    const [isPerfect, setIsPerfect] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [lastMatchedPair, setLastMatchedPair] = useState(null);
    const [comboStreak, setComboStreak] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        initializeGame();
        return () => clearTimeout(timer);
    }, []);

    const initializeGame = () => {
        const pairs = [...emojis, ...emojis];
        const shuffled = pairs
            .map((emoji, index) => ({ id: index, emoji, matched: false }))
            .sort(() => Math.random() - 0.5);

        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setWon(false);
    };

    const handleCardClick = (index) => {
        if (flipped.includes(index) || matched.includes(index) || flipped.length >= 2) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            const [first, second] = newFlipped;

            if (cards[first].emoji === cards[second].emoji) {
                const newMatched = [...matched, first, second];
                setMatched(newMatched);
                setFlipped([]);
                setLastMatchedPair(cards[first].emoji);
                setComboStreak(prev => prev + 1);

                // Clear match notification after animation
                setTimeout(() => setLastMatchedPair(null), 800);

                if (newMatched.length === cards.length) {
                    const perfectScore = (moves + 1) === (cards.length / 2);
                    setIsPerfect(perfectScore);
                    setWon(true);
                    setTimeout(() => {
                        if (onWin) {
                            onWin({
                                gameId: 'memory-cards-1',
                                metric: 'flips',
                                value: moves + 1,
                            });
                        }
                    }, 1500);
                }
            } else {
                setComboStreak(0);
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    const resetGame = () => {
        initializeGame();
        setAttempts(prev => prev + 1);
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
                    <span>{moves} {moves === 1 ? 'Zug' : 'Züge'}</span>
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Alle Paare gefunden!' : 'Finde alle Paare! 🃏'}
                </p>

                {/* Match celebration popup */}
                {lastMatchedPair && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-bounce-in shadow-lg">
                            {lastMatchedPair} Match! {comboStreak > 1 ? `x${comboStreak} 🔥` : '✨'}
                        </div>
                    </div>
                )}
            </div>

            {/* Cards Grid with 3D perspective */}
            <div className="perspective-1000 w-full max-w-md mx-auto mb-6">
                <div className="grid grid-cols-4 gap-3 p-4 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl shadow-glass border border-white/50">
                    {cards.map((card, index) => {
                        const isFlipped = flipped.includes(index) || matched.includes(index);
                        const isMatched = matched.includes(index);

                        return (
                            <div
                                key={card.id}
                                className="memory-card"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <button
                                    onClick={() => handleCardClick(index)}
                                    disabled={isFlipped || won}
                                    className={`
                                        memory-card-inner preserve-3d
                                        ${isFlipped ? 'flipped' : ''}
                                    `}
                                    style={{
                                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    }}
                                >
                                    {/* Front (hidden state) */}
                                    <div className={`
                                        memory-card-front
                                        ${!isFlipped ? 'hover:scale-105 cursor-pointer' : ''}
                                        transition-transform duration-200
                                    `}>
                                        <span className="text-2xl text-white/60">?</span>
                                    </div>

                                    {/* Back (revealed state) */}
                                    <div className={`
                                        memory-card-back
                                        ${isMatched ? 'bg-gradient-to-br from-green-100 to-green-50 border-green-200' : ''}
                                    `}>
                                        <span className={`
                                            text-3xl
                                            ${isMatched ? 'animate-bounce-in' : ''}
                                        `}>
                                            {card.emoji}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-2 mb-6">
                {Array.from({ length: emojis.length }).map((_, index) => (
                    <div
                        key={index}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className={`
                            w-2.5 h-2.5 rounded-full
                            transition-all duration-500 ease-bouncy
                            ${matched.length / 2 > index
                                ? 'bg-gradient-to-br from-green-400 to-green-500 scale-110 shadow-sm'
                                : 'bg-gray-200'}
                        `}
                    />
                ))}
            </div>

            {/* Result */}
            {won && (
                <div className="text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-3">
                        <SparkleIcon className="w-5 h-5" />
                        <p className="text-lg font-bold">
                            Geschafft in {moves} {moves === 1 ? 'Zug' : 'Zügen'}! 🎯
                        </p>
                        <SparkleIcon className="w-5 h-5" />
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        {moves <= 10 && 'Perfekt! 🌟'}
                        {moves > 10 && moves <= 15 && 'Super Gedächtnis! ✨'}
                        {moves > 15 && 'Gut gemacht! 💪'}
                    </p>

                    <button
                        onClick={resetGame}
                        className="btn-secondary"
                    >
                        Nochmal spielen 🔄
                    </button>
                </div>
            )}
        </div>
    );
};

export default MemoryCards;
