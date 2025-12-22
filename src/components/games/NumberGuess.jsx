import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * Premium Number Guess Game with animated feedback
 */
const NumberGuess = ({ onWin }) => {
    const [secretNumber, setSecretNumber] = useState(null);
    const [guess, setGuess] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [lastGuessDirection, setLastGuessDirection] = useState(null); // 'up' | 'down' | null
    const inputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        startNewGame();
        return () => clearTimeout(timer);
    }, []);

    const startNewGame = () => {
        const number = Math.floor(Math.random() * 100) + 1;
        setSecretNumber(number);
        setGuess('');
        setGuesses([]);
        setFeedback('');
        setWon(false);
        setLastGuessDirection(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const guessNum = parseInt(guess);

        if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
            setFeedback('Bitte eine Zahl zwischen 1 und 100 eingeben!');
            return;
        }

        const newGuesses = [...guesses, guessNum];
        setGuesses(newGuesses);
        setGuess('');

        if (guessNum === secretNumber) {
            setWon(true);
            setFeedback('🎉 Richtig! Du hast gewonnen!');
            setLastGuessDirection(null);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'number-guess-1',
                        metric: 'attempts',
                        value: newGuesses.length
                    });
                }
            }, 1500);
        } else if (guessNum < secretNumber) {
            setLastGuessDirection('up');
            const diff = secretNumber - guessNum;
            const evenOdd = secretNumber % 2 === 0 ? '(Gerade Zahl!)' : '(Ungerade!)';
            if (diff <= 5) {
                setFeedback(`🔥 Ganz heiß! Etwas höher! ${evenOdd}`);
            } else if (diff <= 15) {
                setFeedback('📈 Höher!');
            } else {
                setFeedback('⬆️ Viel höher!');
            }
        } else {
            setLastGuessDirection('down');
            const diff = guessNum - secretNumber;
            const evenOdd = secretNumber % 2 === 0 ? '(Gerade Zahl!)' : '(Ungerade!)';
            if (diff <= 5) {
                setFeedback(`🔥 Ganz heiß! Etwas niedriger! ${evenOdd}`);
            } else if (diff <= 15) {
                setFeedback('📉 Niedriger!');
            } else {
                setFeedback('⬇️ Viel niedriger!');
            }
        }

        // Refocus input
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const resetGame = () => {
        startNewGame();
        setAttempts(prev => prev + 1);
    };

    // Calculate optimal next guess (binary search hint)
    const getOptimalGuess = () => {
        const r = getRange();
        return Math.floor((r.min + r.max) / 2);
    };

    // Calculate range based on guesses
    const getRange = () => {
        if (guesses.length === 0) return { min: 1, max: 100 };
        const lowerGuesses = guesses.filter(g => g < secretNumber);
        const higherGuesses = guesses.filter(g => g > secretNumber);
        return {
            min: lowerGuesses.length > 0 ? Math.max(...lowerGuesses) : 1,
            max: higherGuesses.length > 0 ? Math.min(...higherGuesses) : 100
        };
    };

    const range = getRange();
    const rangePercentage = ((range.max - range.min) / 99) * 100;

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
                    <span className="w-1 h-1 rounded-full bg-gray-300" aria-hidden="true" />
                    <span>{guesses.length} {guesses.length === 1 ? 'Tipp' : 'Tipps'}</span>
                </div>

                <p className={`
                    text-xl font-bold mb-2 transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Geschafft!' : 'Errate die Zahl zwischen 1 und 100!'}
                </p>

                {feedback && (
                    <div className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-full
                        transition-all duration-300 animate-bounce-in
                        ${won
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gradient-to-r from-pastel-lavender/50 to-pastel-pink/50 text-gray-700'}
                    `}>
                        {/* Direction indicator */}
                        {lastGuessDirection && !won && (
                            <span className={`
                                text-2xl
                                ${lastGuessDirection === 'up' ? 'animate-bounce' : 'animate-bounce'}
                            `}>
                                {lastGuessDirection === 'up' ? '⬆️' : '⬇️'}
                            </span>
                        )}
                        <span className="font-medium">{feedback}</span>
                    </div>
                )}
            </div>

            {/* Input Form */}
            {!won && (
                <form onSubmit={handleSubmit} className="w-full max-w-sm mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                type="number"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                placeholder="Deine Zahl..."
                                min="1"
                                max="100"
                                className="
                                    w-full px-6 py-4 rounded-2xl
                                    border-2 border-white/50
                                    bg-white/80 backdrop-blur-sm
                                    text-xl font-bold text-gray-800 text-center
                                    placeholder-gray-400
                                    focus:outline-none focus:border-pastel-lavender focus:ring-2 focus:ring-pastel-lavender/30
                                    transition-all duration-200
                                    shadow-sm
                                "
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary px-6"
                        >
                            <span className="text-xl">✓</span>
                        </button>
                    </div>
                </form>
            )}

            {/* Range Visualizer */}
            {!won && guesses.length > 0 && (
                <div className="w-full max-w-sm mb-6 animate-fade-in">
                    <div className="glass-card p-4">
                        <p className="text-xs text-gray-500 mb-3 text-center font-medium">
                            Möglicher Bereich
                        </p>
                        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            {/* Full range bar */}
                            <div
                                className="absolute h-full bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue rounded-full transition-all duration-500"
                                style={{
                                    left: `${(range.min - 1) / 99 * 100}%`,
                                    width: `${rangePercentage}%`
                                }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-sm font-bold text-gray-600">
                            <span>{range.min}</span>
                            <span className="text-gray-400">← Die Zahl ist hier drin →</span>
                            <span>{range.max}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Guess History */}
            {guesses.length > 0 && (
                <div className="w-full max-w-sm mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Deine Tipps:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {guesses.map((g, index) => (
                            <div
                                key={index}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`
                                    px-3 py-1.5 rounded-full text-sm font-bold
                                    shadow-sm animate-scale-in
                                    ${g === secretNumber
                                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                                        : g < secretNumber
                                            ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600'
                                            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-600'}
                                `}
                            >
                                {g}
                                {g !== secretNumber && (
                                    <span className="ml-1 text-xs">
                                        {g < secretNumber ? '↑' : '↓'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Result */}
            {won && (
                <div className="text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                        <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                        <p className="text-lg font-bold">
                            Gefunden in {guesses.length} {guesses.length === 1 ? 'Versuch' : 'Versuchen'}! 🎯
                        </p>
                        <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        {guesses.length <= 3 && '🌟 Unglaublich! Meisterhaft!'}
                        {guesses.length > 3 && guesses.length <= 5 && '🧠 Perfektes Spiel! Binary Search Pro!'}
                        {guesses.length > 5 && guesses.length <= 7 && '✨ Optimal gelöst! Super!'}
                        {guesses.length > 7 && guesses.length <= 10 && '💪 Gut gemacht!'}
                        {guesses.length > 10 && '🎉 Geschafft!'}
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

export default NumberGuess;
