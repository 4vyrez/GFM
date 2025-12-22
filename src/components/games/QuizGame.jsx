import { useState, useEffect } from 'react';
import { SparkleIcon, HeartIcon } from '../icons/Icons';

/**
 * Premium Quiz Game with slide-in animations
 */
const QuizGame = ({ onWin }) => {
    const allQuestions = [
        {
            question: 'Wann haben wir uns das erste Mal getroffen?',
            answers: ['11.07.2024', '07.11.2024', '21.07.2024', '28.07.2024'],
            correct: 0,
            emoji: '💑'
        },
        {
            question: 'Was ist mein Lieblingsessen?',
            answers: ['Pizza', 'Sushi', 'Burger', 'Pasta'],
            correct: 2,
            emoji: '🍽️'
        },
        {
            question: 'Welche Farbe mag ich am liebsten?',
            answers: ['Rosa', 'Blau', 'Grün', 'Lila'],
            correct: 1,
            emoji: '🎨'
        },
        {
            question: 'Was machen wir am liebsten zusammen?',
            answers: ['Spazieren gehen', 'Filme schauen', 'Kochen', 'Alles ❤️'],
            correct: 3,
            emoji: '💕'
        },
        {
            question: 'Welches Tier ist mein Lieblingstier?',
            answers: ['Wolf', 'Orca', 'Löwe', 'Adler'],
            correct: 1,
            emoji: '🐾'
        },
        {
            question: 'Was ist meine Lieblingsserie (Reallife)?',
            answers: ['You', 'Casa de Papel', 'Dark', 'Prison Break'],
            correct: 0,
            emoji: '🎬'
        },
        {
            question: 'Welche Jahreszeit mag ich am liebsten?',
            answers: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
            correct: 1,
            emoji: '☀️'
        },
        {
            question: 'Was trinke ich am liebsten?',
            answers: ['Kaffee', 'Tee', 'Cola', 'Wasser'],
            correct: 3,
            emoji: '☕'
        },
        {
            question: 'Wo würde ich am liebsten Urlaub machen?',
            answers: ['Tokio', 'Dubai', 'New York', 'Shanghai'],
            correct: 2,
            emoji: '✈️'
        },
        {
            question: 'Was ist meine Lieblingsspiel?',
            answers: ['Minecraft', 'Roblox', 'Valorant', 'Fortnite'],
            correct: 0,
            emoji: '🎮'
        },
    ];

    // Pick 6 random questions for each playthrough (need 3/6 = 50% to win)
    const [questions] = useState(() => {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 6);
    });

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleAnswerClick = (index) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        const isCorrect = index === questions[currentQuestion].correct;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentQuestion(prev => prev + 1);
                    setSelectedAnswer(null);
                    setIsTransitioning(false);
                }, 300);
            } else {
                setShowResult(true);
                const finalScore = correctAnswers + (isCorrect ? 1 : 0);
                // Win condition: 50% correct (3 out of 6)
                if (finalScore >= Math.ceil(questions.length / 2)) {
                    setTimeout(() => {
                        if (onWin) {
                            onWin({
                                gameId: 'quiz-1',
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
        setStreak(0);
        setShowResult(false);
        setAttempts(prev => prev + 1);
        setIsTransitioning(false);
    };


    const currentQ = questions[currentQuestion];
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
                            {questions.map((_, index) => (
                                <div
                                    key={index}
                                    className={`
                                        flex-1 h-2 rounded-full transition-all duration-500
                                        ${index < currentQuestion
                                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                                            : index === currentQuestion
                                                ? 'bg-gradient-to-r from-pastel-lavender to-pastel-pink'
                                                : 'bg-gray-200'}
                                    `}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 text-center font-medium">
                            Frage {currentQuestion + 1} von {questions.length}
                        </p>
                    </div>

                    {/* Question Card */}
                    <div className={`
                        w-full max-w-sm mb-6
                        transition-all duration-300
                        ${isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}
                    `}>
                        <div className="glass-card p-6 text-center">
                            <span className="text-4xl mb-4 block">{currentQ.emoji}</span>
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentQ.question}
                            </h2>
                        </div>
                    </div>

                    {/* Answer Options */}
                    <div className={`
                        w-full max-w-sm space-y-3
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
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    className={`
                                        w-full px-6 py-4 rounded-2xl font-medium text-left
                                        transition-all duration-300 ease-bouncy
                                        animate-slide-in-up
                                        border-2
                                        ${!showFeedback
                                            ? 'bg-white/80 border-white/50 hover:bg-white hover:scale-102 hover:shadow-md cursor-pointer'
                                            : isSelected
                                                ? isCorrect
                                                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-500 scale-102 shadow-md'
                                                    : 'bg-gradient-to-r from-red-400 to-red-500 text-white border-red-500'
                                                : isCorrect
                                                    ? 'bg-green-100 border-green-300 text-green-700'
                                                    : 'bg-white/40 border-white/30 opacity-50'}
                                        ${showFeedback ? 'cursor-default' : ''}
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{answer}</span>
                                        {showFeedback && isSelected && (
                                            <span className="text-xl animate-pop-in">
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                        )}
                                        {showFeedback && !isSelected && isCorrect && (
                                            <span className="text-xl animate-pop-in">✓</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="text-center animate-fade-in w-full max-w-sm" role="alert" aria-live="polite">
                    <div className="glass-card p-8 mb-6">
                        {/* Result emoji */}
                        <div className="text-7xl mb-4" aria-hidden="true">
                            {finalScore >= Math.ceil(questions.length / 2) ? '🏆' : finalScore >= 2 ? '💕' : '💪'}
                        </div>

                        <h2 className="text-3xl font-black text-gray-800 mb-2">
                            {finalScore >= Math.ceil(questions.length / 2)
                                ? 'Perfekt!'
                                : finalScore >= 2
                                    ? 'Gut gemacht!'
                                    : 'Fast geschafft!'}
                        </h2>

                        {/* Score display */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {[...Array(questions.length)].map((_, i) => (
                                <HeartIcon
                                    key={i}
                                    className={`
                                        w-8 h-8 transition-all duration-300
                                        ${i < finalScore ? '' : 'opacity-20 grayscale'}
                                    `}
                                    style={{ animationDelay: `${i * 100}ms` }}
                                />
                            ))}
                        </div>

                        <p className="text-xl text-gray-600 mb-2">
                            <span className="font-bold text-pastel-pink">{finalScore}</span> von {questions.length} richtig
                        </p>

                        {finalScore >= Math.ceil(questions.length / 2) && (
                            <div className="flex items-center justify-center gap-2 text-green-500 mt-4">
                                <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                                <span className="font-bold text-sm">Du kennst mich so gut!</span>
                                <SparkleIcon className="w-5 h-5" aria-hidden="true" />
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

export default QuizGame;
