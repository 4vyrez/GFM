import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * Premium Reaction Race Game with ripple effects and pulsing animations
 */
const ReactionRace = ({ onWin }) => {
    const [gameState, setGameState] = useState('ready');
    const [startTime, setStartTime] = useState(null);
    const [reactionTime, setReactionTime] = useState(null);
    const [attempts, setAttempts] = useState(1);
    const [bestTime, setBestTime] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [ripples, setRipples] = useState([]);
    const [countdown, setCountdown] = useState(null);
    const buttonRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => {
            clearTimeout(timer);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const createRipple = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
    };

    const startGame = () => {
        // Start with countdown
        setCountdown(3);
        setReactionTime(null);
        setGameState('countdown');

        // Countdown sequence
        setTimeout(() => setCountdown(2), 600);
        setTimeout(() => setCountdown(1), 1200);
        setTimeout(() => {
            setCountdown(null);
            setGameState('waiting');

            const delay = 2000 + Math.random() * 3000;
            timeoutRef.current = setTimeout(() => {
                setGameState('go');
                setStartTime(Date.now());
            }, delay);
        }, 1800);
    };

    const handleClick = (e) => {
        createRipple(e);

        if (gameState === 'waiting') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setGameState('too-early');
            return;
        }

        if (gameState === 'go') {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setGameState('clicked');

            if (!bestTime || time < bestTime) {
                setBestTime(time);
            }

            if (time < 500) {
                setTimeout(() => {
                    if (onWin) {
                        onWin({
                            gameId: 'reaction-race-1',
                            metric: 'milliseconds',
                            value: time
                        });
                    }
                }, 1500);
            }
        }
    };

    const resetGame = () => {
        setGameState('ready');
        setReactionTime(null);
        setAttempts(prev => prev + 1);
    };

    const getButtonStyle = () => {
        const styles = {
            ready: 'bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-blue',
            countdown: 'bg-gradient-to-br from-pastel-lavender via-purple-200 to-pastel-lavender',
            waiting: 'bg-gradient-to-br from-pastel-peach via-orange-200 to-pastel-peach animate-pulse',
            go: 'bg-gradient-to-br from-green-400 via-green-300 to-green-400 shadow-glow-pink',
            'too-early': 'bg-gradient-to-br from-red-400 via-red-300 to-red-400',
            clicked: reactionTime < 500
                ? 'bg-gradient-to-br from-green-500 via-green-400 to-green-500'
                : 'bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400'
        };
        return styles[gameState] || styles.ready;
    };

    const getMessage = () => {
        if (gameState === 'ready') return 'Bereit? Klick zum Starten!';
        if (gameState === 'countdown') return 'Los geht\'s...';
        if (gameState === 'waiting') return 'Warte auf Grün...';
        if (gameState === 'go') return 'JETZT!';
        if (gameState === 'too-early') return 'Zu früh! 😅';
        if (gameState === 'clicked') {
            if (reactionTime < 300) return '⚡ Blitzschnell!';
            if (reactionTime < 500) return '🎉 Wow! Mega schnell!';
            if (reactionTime < 700) return '😊 Gut! Fast geschafft!';
            return '💪 Nochmal versuchen!';
        }
        return '';
    };

    return (
        <div
            className={`
                flex flex-col items-center w-full
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {/* Stats */}
            <div className="flex gap-3 mb-6">
                <div className="badge">
                    Versuch #{attempts}
                </div>
                {bestTime && (
                    <div className="badge bg-green-100 text-green-600 border-green-200">
                        <SparkleIcon className="w-3 h-3" />
                        Beste: {bestTime}ms
                    </div>
                )}
            </div>

            {/* Message */}
            <p className={`
                text-xl font-bold text-gray-700 mb-8 text-center min-h-[28px]
                transition-all duration-300
                ${gameState === 'go' ? 'text-green-500 scale-110' : ''}
                ${gameState === 'too-early' ? 'text-red-400' : ''}
            `}>
                {getMessage()}
            </p>

            {/* Main Button with ripple effect */}
            <div className="relative">
                {/* Pulsing ring when waiting */}
                {gameState === 'waiting' && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-pastel-peach/50 animate-ping" style={{ animationDuration: '1.5s' }} aria-hidden="true" />
                        <div className="absolute -inset-4 rounded-full border-4 border-pastel-peach/30 animate-pulse" aria-hidden="true" />
                    </>
                )}

                {/* Glow when ready to click */}
                {gameState === 'go' && (
                    <div className="absolute -inset-4 rounded-full bg-green-400/40 blur-xl animate-pulse-glow" aria-hidden="true" />
                )}

                <button
                    ref={buttonRef}
                    onClick={gameState === 'ready' ? startGame : handleClick}
                    disabled={gameState === 'too-early' || gameState === 'clicked'}
                    className={`
                        relative overflow-hidden
                        w-56 h-56 sm:w-64 sm:h-64 rounded-full
                        text-2xl font-bold text-white
                        shadow-premium
                        transform transition-all duration-300 ease-bouncy
                        ${getButtonStyle()}
                        ${gameState === 'ready' || gameState === 'go'
                            ? 'hover:scale-105 active:scale-95 cursor-pointer'
                            : ''}
                        ${gameState === 'too-early' || gameState === 'clicked'
                            ? 'cursor-not-allowed' : ''}
                        flex items-center justify-center
                    `}
                >
                    {/* Ripple effects */}
                    {ripples.map(ripple => (
                        <span
                            key={ripple.id}
                            className="absolute rounded-full bg-white/40 pointer-events-none animate-ripple"
                            style={{
                                left: ripple.x - 10,
                                top: ripple.y - 10,
                                width: 20,
                                height: 20,
                            }}
                        />
                    ))}

                    {/* Button content */}
                    <div className="relative z-10">
                        {gameState === 'ready' && (
                            <span className="text-5xl animate-bounce-subtle">▶️</span>
                        )}
                        {gameState === 'countdown' && countdown && (
                            <span
                                key={countdown}
                                className="text-7xl font-black animate-scale-in"
                                style={{
                                    animation: 'scaleInOut 0.5s ease-out',
                                }}
                            >
                                {countdown}
                            </span>
                        )}
                        {gameState === 'waiting' && (
                            <span className="text-5xl">⏳</span>
                        )}
                        {gameState === 'go' && (
                            <span className="text-6xl animate-scale-in">👆</span>
                        )}
                        {gameState === 'too-early' && (
                            <span className="text-5xl">❌</span>
                        )}
                        {gameState === 'clicked' && (
                            <div className="text-center animate-pop-in">
                                <div className="text-5xl mb-2">{reactionTime < 500 ? '🔥' : '⏱️'}</div>
                                <div className="text-xl font-black">{reactionTime}ms</div>
                            </div>
                        )}
                    </div>
                </button>
            </div>

            {/* Result info */}
            {reactionTime !== null && (
                <div className="mt-8 text-center animate-slide-up">
                    <p className={`
                        text-sm font-medium mb-4
                        ${reactionTime < 500 ? 'text-green-500' : 'text-gray-500'}
                    `}>
                        {reactionTime < 500
                            ? 'Unter 500ms - Du hast gewonnen! 🎯'
                            : 'Versuch es nochmal unter 500ms zu schaffen!'}
                    </p>
                </div>
            )}

            {/* Reset Button */}
            {(gameState === 'too-early' || gameState === 'clicked') && (
                <button
                    onClick={resetGame}
                    className="mt-6 btn-secondary animate-fade-in"
                >
                    Nochmal versuchen 🔄
                </button>
            )}
        </div>
    );
};

export default ReactionRace;
