import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * FakeUpdate Game - Fake system update with funny messages
 * Watch the progress bar fill with funny status messages
 */
const FakeUpdate = ({ onWin }) => {
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const messages = [
        { text: 'Suche nach Updates...', emoji: '🔍' },
        { text: 'Love-Update 2.0 gefunden!', emoji: '💕' },
        { text: 'Downloading cuteness...', emoji: '🐱' },
        { text: 'Installiere neue Kuscheleinheiten...', emoji: '🤗' },
        { text: 'Optimiere Umarmungsalgorithmen...', emoji: '💝' },
        { text: 'Upgrading Schmetterlinge im Bauch...', emoji: '🦋' },
        { text: 'Patching Herzklopfen-Module...', emoji: '💓' },
        { text: 'Removing bugs from Theos Gehirn...', emoji: '🐛' },
        { text: 'Installing more love...', emoji: '❤️' },
        { text: 'Finalizing awesomeness...', emoji: '✨' },
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    useEffect(() => {
        if (isComplete) return;

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const increment = 1 + Math.random() * 2;
                const newProgress = Math.min(prev + increment, 100);

                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    setIsComplete(true);
                    setTimeout(() => {
                        if (onWin) {
                            onWin({
                                gameId: 'fake-update-1',
                                metric: 'seconds',
                                value: Math.round(progress / 10),
                            });
                        }
                    }, 2000);
                }

                return newProgress;
            });
        }, 150);

        return () => clearInterval(progressInterval);
    }, [isComplete, onWin]);

    useEffect(() => {
        // Update message based on progress
        const messageIndex = Math.min(
            Math.floor(progress / 10),
            messages.length - 1
        );
        setCurrentMessage(messageIndex);
    }, [progress]);

    return (
        <div
            className={`
                flex flex-col items-center w-full
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {/* Fake Windows-style update screen */}
            <div className="w-full max-w-sm bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className={`
                        text-5xl mb-4
                        ${isComplete ? 'animate-bounce-in' : 'animate-pulse'}
                    `}>
                        {isComplete ? '✅' : '⏳'}
                    </div>

                    <h2 className="text-white text-xl font-bold mb-1">
                        {isComplete ? 'Update erfolgreich!' : 'Updating...'}
                    </h2>

                    <p className="text-blue-200 text-sm">
                        {isComplete
                            ? 'Dein Herz wurde aktualisiert! 💕'
                            : 'Bitte nicht das Fenster schließen 😊'
                        }
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="relative h-6 bg-blue-900/50 rounded-full overflow-hidden">
                        <div
                            className={`
                                absolute inset-y-0 left-0 rounded-full
                                transition-all duration-200
                                ${isComplete
                                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                                    : 'bg-gradient-to-r from-blue-300 to-blue-400'
                                }
                            `}
                            style={{ width: `${progress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-sm font-bold drop-shadow">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Current Action */}
                <div className="bg-blue-900/30 rounded-lg p-3 min-h-[60px] flex items-center">
                    <span className="text-2xl mr-3">
                        {messages[currentMessage].emoji}
                    </span>
                    <span className="text-blue-100 text-sm">
                        {messages[currentMessage].text}
                    </span>
                </div>
            </div>

            {/* Success Animation */}
            {isComplete && (
                <div className="mt-6 text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                        <SparkleIcon className="w-5 h-5" />
                        <p className="text-lg font-bold">System bereit! 💕</p>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Love.exe wurde erfolgreich installiert
                    </p>
                </div>
            )}

            {/* Fake system info */}
            {!isComplete && (
                <p className="mt-4 text-xs text-gray-400">
                    System: LoveOS 💕 | Version: {(progress / 100 * 2).toFixed(1)}.0
                </p>
            )}
        </div>
    );
};

export default FakeUpdate;
