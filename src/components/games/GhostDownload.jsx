import { useState, useEffect, useRef, useCallback } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * GhostDownload Game - Ghost of Tsushima Download Simulation
 * The download button escapes the cursor when approached
 * After 30 seconds, auto-win (she finally gets to download it!)
 * Reference: Girlfriend always wants to download but never does
 */
const GhostDownload = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [buttonPos, setButtonPos] = useState({ x: 50, y: 50 });
    const [timeLeft, setTimeLeft] = useState(30);
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [message, setMessage] = useState('Bereit zum Download!');

    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const timerRef = useRef(null);

    const escapeMessages = [
        "Nope! 😏",
        "Zu langsam! 💨",
        "Fast! ...nicht. 😈",
        "Try again! 🎮",
        "Git gud! 😜",
        "404: Button not clickable 🖥️",
        "DODGE! 🏃",
        "You missed! ⚡",
        "Skill Issue! 🎯",
        "Haha! Too easy! 😎",
        "Cannot be caught! 🏆",
        "Nice try, noob! 🐣",
        "Lag? Nein, du bist langsam! 📶",
        "Speedrunner sein wie... 🏃‍♂️",
        "Loading... deine Skills 📊",
        "Error 418: I'm a teapot ☕",
        "Ctrl+Alt+Defeat 💻",
        "Respawning elsewhere... 🔄",
        "Stealth: 100 🥷",
        "You activated my trap card! 🃏",
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);

        // Start countdown
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    completeGame();
                    return 0;
                }

                // Slowly fill fake download bar
                setDownloadProgress(((30 - prev + 1) / 30) * 100);

                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const completeGame = () => {
        setIsComplete(true);
        setDownloadProgress(100);
        setMessage('Download gestartet! Endlich! 🎉');

        setTimeout(() => {
            if (onWin) {
                onWin({
                    gameId: 'ghost-download-1',
                    metric: 'attempts',
                    value: attempts,
                });
            }
        }, 2000);
    };

    const moveButton = useCallback((e) => {
        if (isComplete || !containerRef.current || !buttonRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const button = buttonRef.current.getBoundingClientRect();

        // Get mouse position relative to container
        const mouseX = ((e.clientX - container.left) / container.width) * 100;
        const mouseY = ((e.clientY - container.top) / container.height) * 100;

        // Calculate distance to button center
        const buttonCenterX = buttonPos.x;
        const buttonCenterY = buttonPos.y;

        const dx = mouseX - buttonCenterX;
        const dy = mouseY - buttonCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If mouse is close, move button away
        if (distance < 25) {
            setAttempts(prev => prev + 1);
            setMessage(escapeMessages[Math.floor(Math.random() * escapeMessages.length)]);

            // Calculate escape direction (opposite of mouse approach)
            const angle = Math.atan2(dy, dx);
            const escapeDistance = 25 + Math.random() * 15;

            let newX = buttonCenterX - Math.cos(angle) * escapeDistance;
            let newY = buttonCenterY - Math.sin(angle) * escapeDistance;

            // Keep within bounds (with padding)
            newX = Math.max(15, Math.min(85, newX));
            newY = Math.max(15, Math.min(85, newY));

            setButtonPos({ x: newX, y: newY });
        }
    }, [buttonPos, isComplete, attempts]);

    const handleButtonClick = () => {
        // This should basically never happen, but just in case
        if (!isComplete) {
            completeGame();
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
            <div className="text-center mb-4 w-full">
                <h2 className="text-xl font-bold text-gray-700 mb-1">
                    {isComplete ? '🎉 Download gestartet!' : 'Ghost of Tsushima'}
                </h2>
                <p className="text-sm text-gray-500">
                    {isComplete ? 'Endlich!' : `⏱️ ${timeLeft}s`}
                </p>
            </div>

            {/* Game Container - styled like a store page */}
            <div className="w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-xl">
                {/* Game Banner */}
                <div className="relative h-32 bg-gradient-to-br from-amber-600 via-orange-700 to-red-900 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-6xl filter drop-shadow-lg">⚔️</span>
                        <p className="text-white font-bold text-lg mt-1 drop-shadow">Ghost of Tsushima</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
                        -50%
                    </div>
                </div>

                {/* Game Area */}
                <div
                    ref={containerRef}
                    onMouseMove={moveButton}
                    className="relative h-48 bg-slate-900 overflow-hidden cursor-crosshair"
                >
                    {/* Escaping Download Button */}
                    <button
                        ref={buttonRef}
                        onClick={handleButtonClick}
                        disabled={isComplete}
                        style={{
                            left: `${buttonPos.x}%`,
                            top: `${buttonPos.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        className={`
                            absolute px-6 py-3 rounded-lg font-bold
                            transition-all duration-150 ease-out
                            ${isComplete
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg'
                            }
                        `}
                    >
                        {isComplete ? '✅ Downloading...' : '⬇️ Download'}
                    </button>

                    {/* Message overlay */}
                    {!isComplete && attempts > 0 && (
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                                {message}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer with fake download bar */}
                <div className="p-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Speicherplatz: 65.3 GB</span>
                        <span>€29.99</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${downloadProgress}%` }}
                        />
                    </div>

                    <p className="text-center text-xs text-slate-500 mt-2">
                        {isComplete
                            ? 'Endlich startest du den Download! 🎉'
                            : 'Versuche den Button zu klicken...'
                        }
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-4 text-xs text-gray-400">
                <span>Fluchtversuche: {attempts}</span>
            </div>

            {/* Win celebration */}
            {isComplete && (
                <div className="mt-4 flex items-center gap-2 text-green-500 animate-bounce-in">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Diesmal hast du es geschafft! 🗡️</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};

export default GhostDownload;
