import { useState, useEffect, useRef, useCallback } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * GhostDownload Game - Ghost of Tsushima Download Simulation
 * The download button is TRULY IMPOSSIBLE to catch!
 * Troll mechanics: huge detection radius, shrinking, invisibility, fake buttons, random teleports
 * After 30 seconds, shows meme message about maybe downloading in 2026
 */
const GhostDownload = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [buttonPos, setButtonPos] = useState({ x: 50, y: 50 });
    const [timeLeft, setTimeLeft] = useState(30);
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [message, setMessage] = useState('Bereit zum Download!');
    const [isPulsing, setIsPulsing] = useState(false);
    const [showEndMessage, setShowEndMessage] = useState(false);

    // Troll states
    const [buttonScale, setButtonScale] = useState(1);
    const [buttonOpacity, setButtonOpacity] = useState(1);
    const [buttonRotation, setButtonRotation] = useState(0);
    const [fakeButtons, setFakeButtons] = useState([]);
    const [isRunningAway, setIsRunningAway] = useState(false);

    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const timerRef = useRef(null);
    const trollIntervalRef = useRef(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const escapeMessages = [
        "Nee! 😏",
        "Zu langsam! 💨",
        "Fast! ...nicht. 😈",
        "Nochmal! 🎮",
        "Git gud! 😜",
        "404: Button nicht klickbar 🖥️",
        "Ausgewichen! 🏃",
        "Daneben! ⚡",
        "Skill Issue! 🎯",
        "Haha! Zu einfach! 😎",
        "Nicht zu fangen! 🏆",
        "Netter Versuch! 🐣",
        "Lag? Nein, du bist langsam! 📶",
        "Speedrunner sein wie... 🏃‍♂️",
        "Lädt... deine Skills 📊",
        "Error 418: I'm a teapot ☕",
        "Strg+Alt+Niederlage 💻",
        "Respawne woanders... 🔄",
        "Tarnung: 100 🥷",
        "Du hast meine Fallenkarte aktiviert! 🃏",
        "Omae wa mou shindeiru 🗡️",
        "*teleportiert hinter dich* 🌀",
        "PARKOUR! 🤸",
        "Ich bin Speed 💫",
        "Rolle... rolle... 🎲",
        "Alt+F4 hilft nicht! 😈",
        "Verbindung verloren... NICHT! 📡",
        "Kein Treffer! 🎯",
        "Unsichtbar: AN 👻",
        "Matrix Ausweichen! 🕶️",
        "Niemals! 🚫",
        "Besser als Ghost! 👻",
        "2026 vielleicht? 📅",
        "LMAOOO 🤣",
        "Du dachtest wirklich? 💀",
        "Ghost > Du ⚔️",
        "Bin schon weg! 🏃‍♀️",
        "Error: Skills.exe nicht gefunden 💻",
        "Teleport: Aktiviert 🌀",
        "Ich war nie hier 👻",
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);

        // Start countdown
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    clearInterval(trollIntervalRef.current);
                    setShowEndMessage(true);
                    setTimeout(() => {
                        setIsComplete(true);
                        setDownloadProgress(100);
                        if (onWin) {
                            onWin({
                                gameId: 'ghost-download-1',
                                metric: 'attempts',
                                value: attempts,
                            });
                        }
                    }, 2000);
                    return 0;
                }
                setDownloadProgress(Math.min(((30 - prev + 1) / 30) * 90, 90));
                return prev - 1;
            });
        }, 1000);

        // Random troll effects every 2-4 seconds
        trollIntervalRef.current = setInterval(() => {
            const trollType = Math.floor(Math.random() * 5);

            switch (trollType) {
                case 0:
                    // Random teleport (no attempt increment - user didn't try)
                    setButtonPos({
                        x: 15 + Math.random() * 70,
                        y: 15 + Math.random() * 70
                    });
                    setMessage("*teleportiert* 🌀");
                    break;
                case 1:
                    // Become invisible briefly
                    setButtonOpacity(0.1);
                    setMessage("Unsichtbar! 👻");
                    setTimeout(() => setButtonOpacity(1), 800);
                    break;
                case 2:
                    // Spawn fake buttons
                    const newFakes = Array.from({ length: 3 }, (_, i) => ({
                        id: Date.now() + i,
                        x: 10 + Math.random() * 80,
                        y: 10 + Math.random() * 80,
                    }));
                    setFakeButtons(newFakes);
                    setMessage("Welcher bin ich? 🎭");
                    setTimeout(() => setFakeButtons([]), 1500);
                    break;
                case 3:
                    // Spin and teleport
                    setButtonRotation(prev => prev + 720);
                    setTimeout(() => {
                        setButtonPos({
                            x: 15 + Math.random() * 70,
                            y: 15 + Math.random() * 70
                        });
                    }, 200);
                    setMessage("SPIN! 🌪️");
                    break;
                case 4:
                    // Shrink temporarily
                    setButtonScale(0.3);
                    setMessage("Wo bin ich? 🔍");
                    setTimeout(() => setButtonScale(1), 1000);
                    break;
            }
        }, 2500);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (trollIntervalRef.current) clearInterval(trollIntervalRef.current);
        };
    }, []);

    // Button click does NOTHING - it's truly impossible!
    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Troll: When clicked, teleport away and laugh
        setButtonPos({
            x: 15 + Math.random() * 70,
            y: 15 + Math.random() * 70
        });
        setMessage("HAHA NOPE! 😂");
        setAttempts(prev => prev + 1);
        return false;
    };

    const moveButton = useCallback((clientX, clientY) => {
        if (isComplete || showEndMessage || !containerRef.current || !buttonRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const mouseX = ((clientX - container.left) / container.width) * 100;
        const mouseY = ((clientY - container.top) / container.height) * 100;

        lastMousePos.current = { x: mouseX, y: mouseY };

        const buttonCenterX = buttonPos.x;
        const buttonCenterY = buttonPos.y;

        const dx = mouseX - buttonCenterX;
        const dy = mouseY - buttonCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // HUGE detection radius - 50% of container!
        if (distance < 50) {
            setAttempts(prev => prev + 1);
            setMessage(escapeMessages[Math.floor(Math.random() * escapeMessages.length)]);
            setIsPulsing(true);
            setIsRunningAway(true);
            setTimeout(() => {
                setIsPulsing(false);
                setIsRunningAway(false);
            }, 300);

            // Predict where mouse is going and escape the opposite way
            const escapeAngle = Math.atan2(dy, dx);
            // MASSIVE escape distance
            const escapeDistance = 40 + Math.random() * 30;

            let newX = buttonCenterX - Math.cos(escapeAngle) * escapeDistance;
            let newY = buttonCenterY - Math.sin(escapeAngle) * escapeDistance;

            // Add some randomness
            newX += (Math.random() - 0.5) * 20;
            newY += (Math.random() - 0.5) * 20;

            // Keep within bounds
            newX = Math.max(10, Math.min(90, newX));
            newY = Math.max(10, Math.min(90, newY));

            setButtonPos({ x: newX, y: newY });

            // Sometimes shrink when escaping
            if (Math.random() > 0.7) {
                setButtonScale(0.5);
                setTimeout(() => setButtonScale(1), 500);
            }

            // Sometimes become semi-transparent
            if (Math.random() > 0.8) {
                setButtonOpacity(0.3);
                setTimeout(() => setButtonOpacity(1), 400);
            }
        }
    }, [buttonPos, isComplete, showEndMessage, escapeMessages]);

    const handleMouseMove = useCallback((e) => {
        moveButton(e.clientX, e.clientY);
    }, [moveButton]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length > 0) {
            e.preventDefault();
            moveButton(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [moveButton]);

    // Prevent touch on button
    const handleTouchStart = (e) => {
        e.preventDefault();
        handleButtonClick(e);
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
                    {isComplete ? '🎉 Download gestartet!' : showEndMessage ? '😢' : 'Ghost of Tsushima'}
                </h2>
                <p className="text-sm text-gray-500">
                    {isComplete ? 'Endlich!' : showEndMessage ? '' : `⏱️ ${timeLeft}s`}
                </p>
            </div>

            {/* Game Container */}
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
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    className="relative h-48 bg-slate-900 overflow-hidden cursor-crosshair touch-none select-none"
                >
                    {/* Fake buttons (troll) */}
                    {fakeButtons.map(fake => (
                        <button
                            key={fake.id}
                            onClick={(e) => {
                                e.preventDefault();
                                setMessage("FAKE! 🎭");
                                setAttempts(prev => prev + 1);
                            }}
                            style={{
                                left: `${fake.x}%`,
                                top: `${fake.y}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                            className="absolute px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white opacity-60 pointer-events-auto"
                        >
                            ⬇️ Download
                        </button>
                    ))}

                    {/* Real Download Button (but impossible to catch!) */}
                    <button
                        ref={buttonRef}
                        onClick={handleButtonClick}
                        onTouchStart={handleTouchStart}
                        onMouseDown={handleButtonClick}
                        disabled={isComplete || showEndMessage}
                        style={{
                            left: `${buttonPos.x}%`,
                            top: `${buttonPos.y}%`,
                            transform: `translate(-50%, -50%) scale(${buttonScale}) rotate(${buttonRotation}deg)`,
                            opacity: buttonOpacity,
                            transition: isRunningAway ? 'all 0.05s ease-out' : 'all 0.15s ease-out',
                        }}
                        className={`
                            absolute px-6 py-3 rounded-lg font-bold z-10
                            ${isComplete
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            }
                            ${isPulsing ? 'shadow-xl shadow-blue-500/50' : ''}
                        `}
                    >
                        {isComplete ? '✅ Downloading...' : '⬇️ Download'}
                    </button>

                    {/* Message overlay */}
                    {!isComplete && !showEndMessage && attempts > 0 && (
                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                            <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                                {message}
                            </span>
                        </div>
                    )}

                    {/* Special end message overlay */}
                    {showEndMessage && !isComplete && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 animate-fade-in">
                            <div className="text-center p-4">
                                <p className="text-white text-lg font-medium">
                                    Vielleicht in 2026 wirst du es finally downloaden? ❤️
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Speicherplatz: 65.3 GB</span>
                        <span>€29.99</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${downloadProgress}%` }}
                        />
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-2">
                        {isComplete
                            ? 'Endlich startest du den Download! 🎉'
                            : 'Versuche den Button zu klicken... (viel Glück 😈)'
                        }
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-4 text-xs text-gray-400">
                <span>Fluchtversuche: {attempts}</span>
                {attempts > 10 && <span className="text-red-400">Skill Issue! 💀</span>}
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

