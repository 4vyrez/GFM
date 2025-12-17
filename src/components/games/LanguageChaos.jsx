import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * LanguageChaos Game - Japanese Game Settings Meme
 * Navigate chaotic UI to find the language toggle
 */
const LanguageChaos = ({ onWin }) => {
    const [found, setFound] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        // Show hint after 10 seconds
        setTimeout(() => setShowHint(true), 10000);
    }, []);

    // Fake Japanese-style symbols/icons for visual chaos
    const fakeOptions = [
        { icon: '⚙️', text: '設定オプション', fake: true },
        { icon: '🔊', text: 'サウンド設定', fake: true },
        { icon: '🎮', text: 'コントロール', fake: true },
        { icon: '📺', text: 'ディスプレイ', fake: true },
        { icon: '💾', text: 'セーブデータ', fake: true },
        { icon: '🌐', text: 'Language / 言語', fake: false }, // The real one!
        { icon: '🔔', text: '通知設定', fake: true },
        { icon: '❓', text: 'ヘルプ', fake: true },
        { icon: '🎵', text: 'BGM設定', fake: true },
    ];

    const handleOptionClick = (option) => {
        setAttempts(prev => prev + 1);

        if (!option.fake) {
            setFound(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'language-chaos-1',
                        metric: 'attempts',
                        value: attempts + 1,
                    });
                }
            }, 2000);
        }
    };

    if (found) {
        return (
            <div
                className={`
                    flex flex-col items-center w-full py-8
                    transform transition-all duration-700 ease-apple
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
            >
                <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                    Language Changed!
                </h3>
                <p className="text-gray-500 mb-4">Du hast es gefunden! 🌐</p>
                <div className="flex items-center gap-2 text-green-500">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Average Japanese Game Experience ✓</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
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
            {/* Header - "Japanese Game" style */}
            <div className="text-center mb-4 w-full">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg mb-3 shadow-md">
                    <h3 className="text-lg font-bold">ゲーム設定</h3>
                    <p className="text-xs opacity-80">Game Settings</p>
                </div>

                <p className="text-gray-600 text-sm font-medium">
                    🎮 Average Japanese Game Experience™
                </p>
                <p className="text-gray-400 text-xs mt-1">
                    Finde die Spracheinstellungen...
                </p>
            </div>

            {/* Chaotic Settings Menu */}
            <div className="w-full max-w-sm bg-gray-900 rounded-xl p-3 shadow-xl border border-gray-700">
                <div className="grid grid-cols-3 gap-2">
                    {fakeOptions.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={`
                                flex flex-col items-center justify-center
                                p-3 rounded-lg transition-all duration-200
                                ${!option.fake && showHint
                                    ? 'bg-green-900/50 border border-green-500/50'
                                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                                }
                                hover:scale-105 active:scale-95
                            `}
                        >
                            <span className="text-2xl mb-1">{option.icon}</span>
                            <span className="text-[10px] text-gray-300 text-center leading-tight">
                                {option.text}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Status Bar */}
                <div className="mt-3 pt-2 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                    <span>Ver. 1.04.2</span>
                    <span>Klicks: {attempts}</span>
                </div>
            </div>

            {/* Hint */}
            {showHint && (
                <p className="text-xs text-green-600 mt-4 animate-fade-in">
                    💡 Tipp: Such nach dem 🌐 Symbol...
                </p>
            )}

            {/* Attempts Counter */}
            {attempts > 3 && !showHint && (
                <p className="text-xs text-gray-400 mt-4 animate-fade-in">
                    Hmm, vielleicht hat es mit Sprache zu tun? 🤔
                </p>
            )}
        </div>
    );
};

export default LanguageChaos;
