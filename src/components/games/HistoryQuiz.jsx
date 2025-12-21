import { useState, useEffect } from 'react';
import { SparkleIcon, HeartIcon } from '../icons/Icons';

/**
 * HistoryQuiz Game - German History Dates Quiz
 * Only asks for dates, no text answers
 */
const HistoryQuiz = ({ onWin }) => {
    const questions = [
        {
            question: 'Gründung des Deutschen Kaiserreichs?',
            answers: ['1848', '1871', '1890', '1914'],
            correct: 1,
            emoji: '🏰',
            hint: 'Versailles, Spiegelsaal...',
        },
        {
            question: 'Ende des Zweiten Weltkriegs in Europa?',
            answers: ['1943', '1944', '1945', '1946'],
            correct: 2,
            emoji: '🕊️',
            hint: 'Bedingungslose Kapitulation',
        },
        {
            question: 'Beginn des Vietnamkriegs?',
            answers: ['1950', '1955', '1960', '1965'],
            correct: 1,
            emoji: '🪖',
            hint: 'Französischer Rückzug...',
        },
        {
            question: 'Fall der Berliner Mauer?',
            answers: ['1987', '1988', '1989', '1990'],
            correct: 2,
            emoji: '🧱',
            hint: 'Schabowski-Pressekonferenz',
        },
        {
            question: 'Beginn des Ersten Weltkriegs?',
            answers: ['1912', '1913', '1914', '1915'],
            correct: 2,
            emoji: '⚔️',
            hint: 'Attentat in Sarajevo',
        },
        {
            question: 'Unterzeichnung des Westfälischen Friedens?',
            answers: ['1618', '1638', '1648', '1658'],
            correct: 2,
            emoji: '📜',
            hint: 'Ende des Dreißigjährigen Krieges',
        },
        {
            question: 'Deutsche Wiedervereinigung?',
            answers: ['1989', '1990', '1991', '1992'],
            correct: 1,
            emoji: '🇩🇪',
            hint: '3. Oktober...',
        },
        {
            question: 'Französische Revolution?',
            answers: ['1776', '1789', '1799', '1804'],
            correct: 1,
            emoji: '🗼',
            hint: 'Sturm auf die Bastille',
        },
        {
            question: 'Entdeckung Amerikas durch Kolumbus?',
            answers: ['1482', '1492', '1502', '1512'],
            correct: 1,
            emoji: '🚢',
            hint: 'Santa María',
        },
        {
            question: 'Mondlandung (Apollo 11)?',
            answers: ['1965', '1967', '1969', '1971'],
            correct: 2,
            emoji: '🌙',
            hint: 'Ein kleiner Schritt...',
        },
        {
            question: 'Untergang der Titanic?',
            answers: ['1908', '1910', '1912', '1914'],
            correct: 2,
            emoji: '🚢',
            hint: 'Eisberg voraus!',
        },
        {
            question: 'Erfindung des Buchdrucks (Gutenberg)?',
            answers: ['1440', '1450', '1460', '1470'],
            correct: 1,
            emoji: '📖',
            hint: 'Mainz',
        },
    ];

    // Pick 5 random questions
    const [gameQuestions] = useState(() => {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
    });

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleAnswerClick = (index) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        setShowHint(false);
        const isCorrect = index === gameQuestions[currentQuestion].correct;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestion < gameQuestions.length - 1) {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentQuestion(prev => prev + 1);
                    setSelectedAnswer(null);
                    setIsTransitioning(false);
                }, 300);
            } else {
                setShowResult(true);
                const finalScore = correctAnswers + (isCorrect ? 1 : 0);
                if (finalScore >= gameQuestions.length - 1) {
                    setTimeout(() => {
                        if (onWin) {
                            onWin({
                                gameId: 'history-quiz-1',
                                metric: 'correct',
                                value: finalScore,
                            });
                        }
                    }, 1500);
                }
            }
        }, 1200);
    };

    const resetGame = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setCorrectAnswers(0);
        setShowResult(false);
        setAttempts(prev => prev + 1);
        setIsTransitioning(false);
        setShowHint(false);
    };

    const currentQ = gameQuestions[currentQuestion];
    const finalScore = correctAnswers;

    return (
        <div
            className={`
                flex flex-col items-center w-full
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {!showResult ? (
                <>
                    {/* Progress Bar */}
                    <div className="w-full max-w-sm mb-6">
                        <div className="flex gap-2 mb-2">
                            {gameQuestions.map((_, index) => (
                                <div
                                    key={index}
                                    className={`
                                        flex-1 h-2 rounded-full transition-all duration-500
                                        ${index < currentQuestion
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                            : index === currentQuestion
                                                ? 'bg-gradient-to-r from-amber-300 to-amber-400'
                                                : 'bg-gray-200'}
                                    `}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-400 font-medium">
                                Frage {currentQuestion + 1} von {gameQuestions.length}
                            </p>
                            <p className="text-xs text-amber-600 font-bold">
                                📚 Geschichte
                            </p>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className={`
                        w-full max-w-sm mb-6
                        transition-all duration-300
                        ${isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}
                    `}>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center shadow-md">
                            <span className="text-4xl mb-4 block">{currentQ.emoji}</span>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                {currentQ.question}
                            </h2>

                            {/* Hint button */}
                            {!showHint && selectedAnswer === null && (
                                <button
                                    onClick={() => setShowHint(true)}
                                    className="text-xs text-amber-600 underline hover:text-amber-700"
                                >
                                    💡 Hinweis anzeigen
                                </button>
                            )}
                            {showHint && (
                                <p className="text-sm text-amber-700 italic mt-2 animate-fade-in">
                                    💡 {currentQ.hint}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Answer Options - Years only */}
                    <div className={`
                        w-full max-w-sm grid grid-cols-2 gap-3
                        transition-all duration-300
                        ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                    `}>
                        {currentQ.answers.map((answer, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQ.correct;
                            const showFeedback = selectedAnswer !== null;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`
                                        px-6 py-4 rounded-xl font-bold text-2xl text-center
                                        transition-all duration-300 ease-bouncy
                                        border-2
                                        ${!showFeedback
                                            ? 'bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-400 hover:scale-105 cursor-pointer'
                                            : isSelected
                                                ? isCorrect
                                                    ? 'bg-green-500 text-white border-green-500 scale-105'
                                                    : 'bg-red-500 text-white border-red-500'
                                                : isCorrect
                                                    ? 'bg-green-100 border-green-400 text-green-700'
                                                    : 'bg-white/40 border-gray-200 opacity-50'}
                                        ${showFeedback ? 'cursor-default' : ''}
                                    `}
                                >
                                    {answer}
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="text-center animate-fade-in w-full max-w-sm">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 mb-6 shadow-md">
                        {/* Result emoji */}
                        <div className="text-7xl mb-4">
                            {finalScore >= gameQuestions.length - 1 ? '🏆' : finalScore >= 3 ? '📚' : '📖'}
                        </div>

                        <h2 className="text-3xl font-black text-gray-800 mb-2">
                            {finalScore >= gameQuestions.length - 1
                                ? 'Historiker!'
                                : finalScore >= 3
                                    ? 'Gut informiert!'
                                    : 'Mehr lernen!'}
                        </h2>

                        {/* Score display */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {[...Array(gameQuestions.length)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-lg
                                        transition-all duration-300
                                        ${i < finalScore
                                            ? 'bg-amber-400 text-white'
                                            : 'bg-gray-200 text-gray-400'}
                                    `}
                                >
                                    {i < finalScore ? '✓' : '✗'}
                                </div>
                            ))}
                        </div>

                        <p className="text-xl text-gray-600 mb-2">
                            <span className="font-bold text-amber-600">{finalScore}</span> von {gameQuestions.length} richtig
                        </p>

                        {finalScore >= gameQuestions.length - 1 && (
                            <div className="flex items-center justify-center gap-2 text-green-500 mt-4">
                                <SparkleIcon className="w-5 h-5" />
                                <span className="font-bold text-sm">Geschichte gemeistert!</span>
                                <SparkleIcon className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={resetGame}
                        className="btn-secondary"
                    >
                        Nochmal versuchen 🔄
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryQuiz;
