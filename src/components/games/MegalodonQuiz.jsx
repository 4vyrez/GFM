import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * MegalodonQuiz Game - Insider quiz about pronunciation
 * The correct emphasis is on "lo" (MegaLOdon)
 */
const MegalodonQuiz = ({ onWin }) => {
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const options = [
        { id: 'me', text: 'MEgalodon', emphasis: 'Me', correct: false },
        { id: 'ga', text: 'MeGAlodon', emphasis: 'ga', correct: false },
        { id: 'lo', text: 'MegaLOdon', emphasis: 'lo', correct: true },
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleSelect = (option) => {
        if (revealed) return;
        setSelected(option.id);
        setRevealed(true);

        if (option.correct) {
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'megalodon-quiz-1',
                        metric: 'correct',
                        value: 1,
                    });
                }
            }, 2500);
        }
    };

    const isCorrect = selected === 'lo';

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
                    <span>🦈 Insider Quiz</span>
                </div>

                <p className="text-xl font-bold text-gray-700">
                    Wo liegt die Betonung?
                </p>
            </div>

            {/* The Word */}
            <div className="mb-6 text-center">
                <div className="text-5xl mb-2">🦈</div>
                <h2 className="text-3xl font-black text-gray-800 tracking-wide">
                    MEGALODON
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                    (Der größte Hai aller Zeiten)
                </p>
            </div>

            {/* Options */}
            <div className="w-full max-w-xs space-y-3 mb-6">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option)}
                        disabled={revealed}
                        className={`
                            w-full py-4 px-6 rounded-xl font-bold text-lg
                            transition-all duration-300
                            ${revealed
                                ? option.correct
                                    ? 'bg-green-500 text-white scale-105 shadow-lg'
                                    : selected === option.id
                                        ? 'bg-red-400 text-white'
                                        : 'bg-gray-200 text-gray-400'
                                : 'bg-white/80 hover:bg-pastel-lavender/50 border border-gray-200 hover:scale-105'
                            }
                        `}
                    >
                        <span>Betonung auf "</span>
                        <span className="underline">{option.emphasis}</span>
                        <span>"</span>
                    </button>
                ))}
            </div>

            {/* Result */}
            {revealed && (
                <div className="text-center animate-slide-up max-w-sm">
                    {isCorrect ? (
                        <>
                            <div className="flex items-center justify-center gap-2 text-green-500 mb-3">
                                <SparkleIcon className="w-5 h-5" />
                                <p className="text-xl font-bold">Richtig! 🎉</p>
                                <SparkleIcon className="w-5 h-5" />
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Ja genau! <strong>MegaLOdon</strong> – die Betonung liegt auf der dritten Silbe!
                                Du hattest Recht (oder jetzt weißt du es für immer 😄)
                            </p>
                            <p className="text-2xl mt-3">🦈✨</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-bold text-red-500 mb-2">
                                Fast! 😅
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Die richtige Betonung ist <strong>MegaLOdon</strong> –
                                auf der dritten Silbe "lo"!
                            </p>
                            <p className="text-gray-400 text-xs mt-3">
                                (Jetzt weißt du es aber! 🦈)
                            </p>

                            <button
                                onClick={() => {
                                    setSelected(null);
                                    setRevealed(false);
                                }}
                                className="btn-secondary mt-4"
                            >
                                Nochmal versuchen 🔄
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Fun Fact */}
            {!revealed && (
                <p className="text-xs text-gray-400 text-center mt-4 max-w-xs">
                    💡 Fun Fact: Megalodon bedeutet "großer Zahn" auf Griechisch!
                </p>
            )}
        </div>
    );
};

export default MegalodonQuiz;
