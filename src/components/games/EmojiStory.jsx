import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * Premium Emoji Story Game with staggered animations
 */
const EmojiStory = ({ onWin }) => {
    const stories = [
        {
            text: 'Du und ich gehen spazieren im Park und finden ein Herz',
            correctOrder: ['👫', '🚶', '🌳', '❤️'],
            allEmojis: ['👫', '🚶', '🌳', '❤️', '🌙', '☀️', '🎈', '🌸'],
        },
        {
            text: 'Wir schauen Sterne an und sehen einen Stern fallen',
            correctOrder: ['👫', '🌙', '⭐', '💫'],
            allEmojis: ['👫', '🌙', '⭐', '💫', '☀️', '🎈', '❤️', '🌸'],
        },
        {
            text: 'Gemeinsam frühstücken wir und trinken Kaffee mit Herz',
            correctOrder: ['👫', '🍳', '☕', '❤️'],
            allEmojis: ['👫', '🍳', '☕', '❤️', '🌙', '⭐', '🎈', '🌸'],
        },
        {
            text: 'Wir kuscheln auf dem Sofa und schauen einen Film',
            correctOrder: ['👫', '🛋️', '📺', '❤️'],
            allEmojis: ['👫', '🛋️', '📺', '❤️', '🍿', '🎬', '😴', '🌙'],
        },
        {
            text: 'Zusammen spielen wir Games und gewinnen als Team',
            correctOrder: ['👫', '🎮', '🏆', '❤️'],
            allEmojis: ['👫', '🎮', '🏆', '❤️', '💻', '⭐', '🎯', '🔥'],
        },
    ];

    const [currentStory, setCurrentStory] = useState(null);
    const [selectedEmojis, setSelectedEmojis] = useState([]);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [wrongAttempt, setWrongAttempt] = useState(false);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        const story = stories[Math.floor(Math.random() * stories.length)];
        setCurrentStory(story);
        setStartTime(Date.now());
    }, []);

    const handleEmojiClick = (emoji) => {
        if (won || wrongAttempt) return;

        const newSelected = [...selectedEmojis, emoji];
        setSelectedEmojis(newSelected);

        const isCorrectSoFar = currentStory.correctOrder
            .slice(0, newSelected.length)
            .every((e, i) => e === newSelected[i]);

        if (!isCorrectSoFar) {
            setWrongAttempt(true);
            setTimeout(() => {
                setSelectedEmojis([]);
                setWrongAttempt(false);
            }, 800);
            return;
        }

        if (newSelected.length === currentStory.correctOrder.length) {
            setWon(true);
            const duration = Math.round((Date.now() - startTime) / 1000);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'emoji-story-1',
                        metric: 'seconds',
                        value: duration,
                    });
                }
            }, 1500);
        }
    };

    const resetGame = () => {
        const story = stories[Math.floor(Math.random() * stories.length)];
        setCurrentStory(story);
        setSelectedEmojis([]);
        setWon(false);
        setWrongAttempt(false);
        setAttempts(prev => prev + 1);
        setStartTime(Date.now());
    };

    if (!currentStory) return null;

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
                <div className="badge mb-3">
                    Versuch #{attempts}
                </div>

                <p className={`
                    text-xl font-bold mb-4 transition-all duration-300
                    ${won ? 'text-green-500' : wrongAttempt ? 'text-red-400' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Geschichte komplett!' : wrongAttempt ? '❌ Falsche Reihenfolge!' : 'Erstelle die Geschichte! 📖'}
                </p>

                {/* Story text with typing effect style */}
                <div className="bg-gradient-to-r from-pastel-lavender/30 via-pastel-pink/20 to-pastel-lavender/30 rounded-2xl px-6 py-4 border border-white/50">
                    <p className="text-sm text-gray-600 italic font-medium">
                        "{currentStory.text}"
                    </p>
                </div>
            </div>

            {/* Selected Story Display */}
            <div className={`
                w-full max-w-sm mx-auto
                bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm
                p-6 rounded-3xl mb-6 min-h-[100px]
                flex items-center justify-center gap-4
                shadow-glass border border-white/50
                transition-all duration-300
                ${wrongAttempt ? 'animate-wiggle border-red-300' : ''}
            `}>
                {selectedEmojis.map((emoji, index) => (
                    <span
                        key={index}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="text-5xl animate-bounce-in drop-shadow-sm"
                    >
                        {emoji}
                    </span>
                ))}
                {selectedEmojis.length < currentStory.correctOrder.length && !won && (
                    [...Array(currentStory.correctOrder.length - selectedEmojis.length)].map((_, i) => (
                        <span key={`placeholder-${i}`} className="text-4xl text-gray-300/50">
                            ❓
                        </span>
                    ))
                )}
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mb-6">
                {currentStory.correctOrder.map((_, index) => (
                    <div
                        key={index}
                        className={`
                            w-3 h-3 rounded-full transition-all duration-300 ease-bouncy
                            ${index < selectedEmojis.length
                                ? wrongAttempt
                                    ? 'bg-red-400'
                                    : 'bg-gradient-to-br from-pastel-pink to-pastel-lavender scale-110'
                                : 'bg-gray-200'}
                        `}
                    />
                ))}
            </div>

            {/* Emoji Selection Grid */}
            {!won && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {currentStory.allEmojis.map((emoji, index) => {
                        const isSelected = selectedEmojis.includes(emoji);
                        return (
                            <button
                                key={index}
                                onClick={() => handleEmojiClick(emoji)}
                                disabled={isSelected || wrongAttempt}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`
                                    w-16 h-16 rounded-2xl text-3xl
                                    flex items-center justify-center
                                    transition-all duration-200 ease-bouncy
                                    animate-fade-in
                                    ${isSelected
                                        ? 'bg-pastel-lavender/30 opacity-40 scale-90 cursor-not-allowed'
                                        : 'bg-white/90 hover:scale-110 hover:shadow-lg hover:bg-white cursor-pointer shadow-md active:scale-95'}
                                    border border-white/50
                                `}
                            >
                                {emoji}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Win state */}
            {won && (
                <div className="text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-3">
                        <SparkleIcon className="w-5 h-5" />
                        <span className="font-bold">Perfekte Geschichte!</span>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
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

export default EmojiStory;
