import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * LoveCode Game - Rearrange words into correct sentence
 * Drag/click words to form the correct order
 */
const LoveCode = ({ onWin }) => {
    const sentences = [
        { words: ['Mit', 'dir', 'ist', 'alles', 'besser'], correct: 'Mit dir ist alles besser' },
        { words: ['Wir', 'gegen', 'den', 'Rest'], correct: 'Wir gegen den Rest' },
        { words: ['Du', 'bist', 'mein', 'Ruhepol'], correct: 'Du bist mein Ruhepol' },
        { words: ['Zusammen', 'sind', 'wir', 'unbesiegbar'], correct: 'Zusammen sind wir unbesiegbar' },
        { words: ['Du', 'machst', 'mich', 'glücklich'], correct: 'Du machst mich glücklich' },
    ];

    const [currentSentence, setCurrentSentence] = useState(null);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [won, setWon] = useState(false);
    const [wrong, setWrong] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        initGame();
        return () => clearTimeout(timer);
    }, []);

    const initGame = () => {
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        const shuffled = [...sentence.words].sort(() => Math.random() - 0.5);
        setCurrentSentence(sentence);
        setShuffledWords(shuffled);
        setSelectedWords([]);
        setWon(false);
        setWrong(false);
    };

    const handleWordClick = (word, index) => {
        if (won) return;
        setWrong(false);

        // Add to selected
        setSelectedWords([...selectedWords, word]);
        // Remove from available
        const newShuffled = [...shuffledWords];
        newShuffled.splice(index, 1);
        setShuffledWords(newShuffled);
    };

    const handleSelectedClick = (word, index) => {
        if (won) return;
        setWrong(false);

        // Remove from selected
        const newSelected = [...selectedWords];
        newSelected.splice(index, 1);
        setSelectedWords(newSelected);
        // Add back to available
        setShuffledWords([...shuffledWords, word]);
    };

    const checkAnswer = () => {
        const playerAnswer = selectedWords.join(' ');
        if (playerAnswer === currentSentence.correct) {
            setWon(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'love-code-1',
                        metric: 'attempts',
                        value: attempts,
                    });
                }
            }, 1500);
        } else {
            setWrong(true);
            setAttempts(prev => prev + 1);
        }
    };

    const resetGame = () => {
        initGame();
        setAttempts(prev => prev + 1);
    };

    if (!currentSentence) return null;

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
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Richtig!' : 'Sortiere die Wörter! 💬'}
                </p>
            </div>

            {/* Selected Words Area */}
            <div className="w-full max-w-sm mb-4">
                <p className="text-xs text-gray-400 mb-2">Dein Satz:</p>
                <div className={`
                    min-h-[60px] p-3 rounded-xl border-2 border-dashed
                    flex flex-wrap gap-2 items-center justify-center
                    transition-all duration-300
                    ${won ? 'bg-green-100 border-green-400' : ''}
                    ${wrong ? 'bg-red-100 border-red-400 animate-shake' : 'border-gray-300 bg-white/50'}
                `}>
                    {selectedWords.length === 0 ? (
                        <span className="text-gray-400 text-sm">Klicke auf Wörter...</span>
                    ) : (
                        selectedWords.map((word, index) => (
                            <button
                                key={`${word}-${index}`}
                                onClick={() => handleSelectedClick(word, index)}
                                disabled={won}
                                className={`
                                    px-3 py-1.5 rounded-lg font-medium text-sm
                                    transition-all duration-200
                                    ${won
                                        ? 'bg-green-500 text-white'
                                        : 'bg-pastel-lavender text-gray-700 hover:bg-pastel-pink'
                                    }
                                `}
                            >
                                {word}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Available Words */}
            <div className="w-full max-w-sm mb-6">
                <p className="text-xs text-gray-400 mb-2">Verfügbare Wörter:</p>
                <div className="flex flex-wrap gap-2 justify-center min-h-[50px]">
                    {shuffledWords.map((word, index) => (
                        <button
                            key={`${word}-${index}`}
                            onClick={() => handleWordClick(word, index)}
                            disabled={won}
                            className="
                                px-4 py-2 rounded-xl font-medium
                                bg-white/80 border border-gray-200
                                shadow-sm hover:shadow-md
                                hover:bg-pastel-mint transition-all duration-200
                                hover:scale-105 active:scale-95
                            "
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>

            {/* Check Button */}
            {!won && selectedWords.length === currentSentence.words.length && (
                <button onClick={checkAnswer} className="btn-primary mb-4">
                    Überprüfen ✓
                </button>
            )}

            {/* Wrong Answer Message */}
            {wrong && (
                <p className="text-red-500 text-sm mb-4 animate-fade-in">
                    Hmm, das stimmt noch nicht ganz 🤔
                </p>
            )}

            {/* Success */}
            {won && (
                <div className="text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                        <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                        <p className="text-lg font-bold">Perfekt! 💕</p>
                        <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <p className="text-gray-500 text-sm italic">
                        "{currentSentence.correct}"
                    </p>
                </div>
            )}

            {/* Shuffle Button */}
            {!won && shuffledWords.length > 0 && (
                <button
                    onClick={resetGame}
                    className="text-sm text-gray-400 hover:text-gray-600 mt-2"
                >
                    🔀 Neu mischen
                </button>
            )}
        </div>
    );
};

export default LoveCode;
