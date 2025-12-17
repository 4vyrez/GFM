import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * MemeQuiz Game - Internet and gaming meme quiz
 * With REAL gaming insiders, ironic humor, and FiveM references!
 */
const MemeQuiz = ({ onWin }) => {
    const questions = [
        {
            question: "Was bedeutet 'GG' unter echten Gamern WIRKLICH?",
            options: ['Good Game (aufrichtig)', 'Get Good (du bist trash)', 'Great Graphics', 'Game Glitched'],
            correct: 1, // Get Good - the ironic meaning
            emoji: '😏',
            explanation: 'Sarkastisch wenn jemand schlecht spielt'
        },
        {
            question: "Was heißt 'nt' im Chat?",
            options: ['Not Today', 'Nice Try', 'No Thanks', 'Next Time'],
            correct: 1,
            emoji: '👏',
            explanation: 'Höflich nach einem Fail'
        },
        {
            question: "Was macht F8 in FiveM?",
            options: ['Screenshot', 'Console öffnen', 'Disconnect/Quit', 'Adminmenü'],
            correct: 2, // F8 Quit
            emoji: '🚗',
            explanation: 'Der schnelle Weg raus...'
        },
        {
            question: "Was ist ein 'Tryhard'?",
            options: ['Ein Pro-Gamer', 'Jemand der zu ernst spielt', 'Ein Entwickler', 'Ein Cheater'],
            correct: 1,
            emoji: '😤',
            explanation: 'Sweaty gameplay incoming'
        },
        {
            question: "'F' im Chat bedeutet...",
            options: ['Fail', 'Press F to Pay Respects', 'Fun', 'Finished'],
            correct: 1,
            emoji: '🪦',
            explanation: 'RIP aus Call of Duty'
        },
        {
            question: "Was ist 'Camping'?",
            options: ['Draußen spielen', 'An einer Stelle lauern', 'AFK sein', 'Team wechseln'],
            correct: 1,
            emoji: '⛺',
            explanation: '*sitzt im Busch mit Sniper*'
        },
        {
            question: "Was bedeutet 'AFK'?",
            options: ['All For Kills', 'Away From Keyboard', 'Attack From Behind', 'Always Fun Kingdom'],
            correct: 1,
            emoji: '⌨️',
            explanation: 'Kurz mal essen...'
        },
        {
            question: "Was ist ein 'Noob'?",
            options: ['Ein Profi', 'Ein Anfänger', 'Ein Cheater', 'Ein Bot'],
            correct: 1,
            emoji: '🐣',
            explanation: 'Welcome to the game!'
        },
        {
            question: "Was macht man bei einem 'Rage Quit'?",
            options: ['Gewinnen', 'Wütend das Spiel verlassen', 'Beschweren', 'Team wechseln'],
            correct: 1,
            emoji: '🎮💥',
            explanation: '*Tastatur fliegt ans Fenster*'
        },
        {
            question: "'Ez' im Chat bedeutet...",
            options: ['Erstaunlich', 'Easy (war zu einfach)', 'Ende Zone', 'Extra Zeit'],
            correct: 1,
            emoji: '😎',
            explanation: 'Maximum toxicity achieved'
        },
    ];

    // Shuffle and pick 5 random questions
    const [gameQuestions] = useState(() => {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
    });

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const requiredScore = 3; // Need 3 correct to win

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleAnswer = (index) => {
        if (showResult) return;

        setSelected(index);
        setShowResult(true);
        setShowExplanation(true);

        const isCorrect = index === gameQuestions[currentQuestion].correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Move to next question after delay
        setTimeout(() => {
            if (currentQuestion < gameQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelected(null);
                setShowResult(false);
                setShowExplanation(false);
            } else {
                // Game complete
                setGameComplete(true);
                const finalScore = isCorrect ? score + 1 : score;
                if (finalScore >= requiredScore) {
                    setTimeout(() => {
                        if (onWin) {
                            onWin({
                                gameId: 'meme-quiz-1',
                                metric: 'correct',
                                value: finalScore,
                            });
                        }
                    }, 1500);
                }
            }
        }, 2000);
    };

    const resetGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelected(null);
        setShowResult(false);
        setGameComplete(false);
        setShowExplanation(false);
    };

    const question = gameQuestions[currentQuestion];
    const won = score >= requiredScore || (gameComplete && score + (selected === question?.correct ? 1 : 0) >= requiredScore);

    if (gameComplete) {
        const finalScore = score;
        return (
            <div
                className={`
                    flex flex-col items-center w-full py-6
                    transform transition-all duration-700 ease-apple
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
            >
                <div className={`text-6xl mb-4 ${finalScore >= requiredScore ? 'animate-bounce-in' : ''}`}>
                    {finalScore >= requiredScore ? '🎮' : '😅'}
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${finalScore >= requiredScore ? 'text-green-600' : 'text-gray-700'}`}>
                    {finalScore >= requiredScore ? 'True Gamer!' : 'Noch nicht ganz...'}
                </h3>

                <p className="text-gray-500 mb-4">
                    {finalScore} von {gameQuestions.length} richtig
                </p>

                {finalScore >= requiredScore ? (
                    <div className="flex items-center gap-2 text-green-500">
                        <SparkleIcon className="w-5 h-5" />
                        <p className="font-bold">Du kennst deine Memes! GG! 🎮</p>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-400 mb-4">
                            Du brauchst mindestens {requiredScore} richtige Antworten
                        </p>
                        <button onClick={resetGame} className="btn-secondary">
                            Nochmal versuchen 🔄
                        </button>
                    </>
                )}
            </div>
        );
    }

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
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 mb-3 shadow-sm border border-white/50">
                    <span>Frage {currentQuestion + 1}/{gameQuestions.length}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>Score: {score}</span>
                </div>

                <p className="text-xl font-bold text-gray-700">
                    Gamer Quiz 🎮
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pastel-lavender to-pastel-pink transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / gameQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="text-center mb-6">
                <div className="text-4xl mb-3">{question.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 max-w-xs">
                    {question.question}
                </h3>
            </div>

            {/* Options */}
            <div className="w-full max-w-xs space-y-2">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={`
                            w-full py-3 px-4 rounded-xl font-medium text-left
                            transition-all duration-300
                            ${showResult
                                ? index === question.correct
                                    ? 'bg-green-500 text-white'
                                    : selected === index
                                        ? 'bg-red-400 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                : 'bg-white/80 hover:bg-pastel-lavender/50 border border-gray-200'
                            }
                        `}
                    >
                        <span className="mr-2">{['A', 'B', 'C', 'D'][index]}.</span>
                        {option}
                    </button>
                ))}
            </div>

            {/* Explanation */}
            {showExplanation && question.explanation && (
                <div className={`
                    mt-4 px-4 py-2 rounded-xl text-sm
                    ${selected === question.correct
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }
                    animate-fade-in
                `}>
                    💡 {question.explanation}
                </div>
            )}

            {/* Feedback */}
            {showResult && (
                <p className={`
                    mt-4 font-medium animate-fade-in
                    ${selected === question.correct ? 'text-green-600' : 'text-red-500'}
                `}>
                    {selected === question.correct ? 'Richtig! 🎯' : 'Nicht ganz! 😅'}
                </p>
            )}
        </div>
    );
};

export default MemeQuiz;
