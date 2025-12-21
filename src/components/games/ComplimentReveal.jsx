import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * ComplimentReveal Game - Reveal hidden compliments
 * Click cards to reveal sweet messages
 */
const ComplimentReveal = ({ onWin }) => {
    const allCompliments = [
        { id: 1, text: 'Du bist wunderschön 💕', emoji: '✨' },
        { id: 2, text: 'Dein Lachen ist magisch 🌟', emoji: '😊' },
        { id: 3, text: 'Du machst mich happy 🌈', emoji: '💝' },
        { id: 4, text: 'Mit dir ist alles besser 🦋', emoji: '🌸' },
        { id: 5, text: 'Du bist einzigartig 💎', emoji: '⭐' },
        { id: 6, text: 'Du bist mein Sonnenschein 🌞', emoji: '☀️' },
        { id: 7, text: 'Ich liebe deine Stimme 🎵', emoji: '💫' },
        { id: 8, text: 'Du riechst immer so gut 🌹', emoji: '🌺' },
        { id: 9, text: 'Du bist meine beste Freundin 👯', emoji: '💖' },
        { id: 10, text: 'Du inspirierst mich jeden Tag 🔥', emoji: '🦋' },
    ];

    // Pick 5 random compliments
    const [compliments] = useState(() => {
        const shuffled = [...allCompliments].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
    });

    const [revealed, setRevealed] = useState([]);
    const [won, setWon] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const requiredReveals = 3;

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const revealCard = (id) => {
        if (revealed.includes(id) || won) return;

        const newRevealed = [...revealed, id];
        setRevealed(newRevealed);

        if (newRevealed.length >= requiredReveals) {
            setWon(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'compliment-reveal-1',
                        metric: 'reveals',
                        value: newRevealed.length,
                    });
                }
            }, 1500);
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
                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Du bist toll!' : 'Entdecke Komplimente! 💝'}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                    {won
                        ? 'Und das sind nur ein paar davon...'
                        : `Klicke ${requiredReveals - revealed.length} Karten auf`
                    }
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
                {compliments.slice(0, 4).map((compliment, index) => {
                    const isRevealed = revealed.includes(compliment.id);

                    return (
                        <button
                            key={compliment.id}
                            onClick={() => revealCard(compliment.id)}
                            disabled={isRevealed}
                            className={`
                                aspect-square rounded-2xl p-3
                                flex flex-col items-center justify-center
                                transition-all duration-500 transform
                                ${isRevealed
                                    ? 'bg-gradient-to-br from-pastel-pink to-pastel-lavender rotate-0 scale-100'
                                    : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:scale-105 cursor-pointer'
                                }
                                shadow-md border border-white/50
                            `}
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {isRevealed ? (
                                <div className="text-center animate-fade-in">
                                    <span className="text-3xl mb-2 block">{compliment.emoji}</span>
                                    <p className="text-xs font-medium text-gray-700 leading-tight">
                                        {compliment.text}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <span className="text-4xl opacity-50">?</span>
                                    <p className="text-xs text-gray-500 mt-1">Klick mich!</p>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Center Card */}
            <button
                onClick={() => revealCard(compliments[4].id)}
                disabled={revealed.includes(compliments[4].id)}
                className={`
                    w-40 h-24 rounded-2xl p-3
                    flex flex-col items-center justify-center
                    transition-all duration-500 transform mb-6
                    ${revealed.includes(compliments[4].id)
                        ? 'bg-gradient-to-br from-pastel-mint to-pastel-blue'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:scale-105 cursor-pointer'
                    }
                    shadow-md border border-white/50
                `}
            >
                {revealed.includes(compliments[4].id) ? (
                    <div className="text-center animate-fade-in">
                        <span className="text-2xl mb-1 block">{compliments[4].emoji}</span>
                        <p className="text-xs font-medium text-gray-700">
                            {compliments[4].text}
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <span className="text-3xl opacity-50">💝</span>
                        <p className="text-xs text-gray-500 mt-1">Bonus!</p>
                    </div>
                )}
            </button>

            {/* Progress */}
            <div className="flex gap-2 mb-4">
                {[...Array(requiredReveals)].map((_, i) => (
                    <div
                        key={i}
                        className={`
                            w-3 h-3 rounded-full transition-all duration-300
                            ${i < revealed.length
                                ? 'bg-pastel-pink scale-110'
                                : 'bg-gray-300'
                            }
                        `}
                    />
                ))}
            </div>

            {/* Success */}
            {won && (
                <div className="flex items-center justify-center gap-2 text-green-500 animate-slide-up">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Du verdienst alle Komplimente! 💕</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};

export default ComplimentReveal;
