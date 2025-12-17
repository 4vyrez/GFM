import { useState, useEffect, useRef } from 'react';
import { SparkleIcon, FlameIcon } from '../icons/Icons';

/**
 * StreakGuardian Game - Protect the flame from rain
 * Keep the flame safe for 15 seconds
 */
const StreakGuardian = ({ onWin }) => {
    const [isActive, setIsActive] = useState(false);
    const [shieldActive, setShieldActive] = useState(false);
    const [drops, setDrops] = useState([]);
    const [timeLeft, setTimeLeft] = useState(15);
    const [flameHealth, setFlameHealth] = useState(100);
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const gameLoopRef = useRef(null);
    const dropIdRef = useRef(0);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, []);

    const startGame = () => {
        setIsActive(true);
        setTimeLeft(15);
        setFlameHealth(100);
        setDrops([]);
        setWon(false);
        setLost(false);

        // Game loop
        gameLoopRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Win!
                    clearInterval(gameLoopRef.current);
                    setIsActive(false);
                    setWon(true);
                    setTimeout(() => {
                        if (onWin) {
                            onWin({
                                gameId: 'streak-guardian-1',
                                metric: 'health',
                                value: flameHealth,
                            });
                        }
                    }, 1500);
                    return 0;
                }
                return prev - 1;
            });

            // Spawn drops
            if (Math.random() < 0.4) {
                const newDrop = {
                    id: dropIdRef.current++,
                    x: 20 + Math.random() * 60,
                    y: 0,
                };
                setDrops(prev => [...prev, newDrop]);
            }
        }, 1000);
    };

    // Move drops down
    useEffect(() => {
        if (!isActive) return;

        const moveInterval = setInterval(() => {
            setDrops(prev => {
                const newDrops = prev.map(drop => ({
                    ...drop,
                    y: drop.y + 8,
                })).filter(drop => {
                    // Check if drop hits flame area (center bottom)
                    if (drop.y >= 85 && drop.x >= 35 && drop.x <= 65) {
                        if (!shieldActive) {
                            setFlameHealth(h => {
                                const newHealth = h - 15;
                                if (newHealth <= 0) {
                                    clearInterval(gameLoopRef.current);
                                    clearInterval(moveInterval);
                                    setIsActive(false);
                                    setLost(true);
                                }
                                return Math.max(0, newHealth);
                            });
                        }
                        return false; // Remove drop
                    }
                    return drop.y < 100;
                });
                return newDrops;
            });
        }, 100);

        return () => clearInterval(moveInterval);
    }, [isActive, shieldActive]);

    const toggleShield = (active) => {
        setShieldActive(active);
    };

    if (won) {
        return (
            <div className={`flex flex-col items-center w-full py-8 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-6xl mb-4 animate-bounce-in">🔥</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Flamme gerettet!</h3>
                <p className="text-gray-500 mb-4">Health: {flameHealth}%</p>
                <div className="flex items-center gap-2 text-green-500">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Streak Guardian! 🛡️</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            </div>
        );
    }

    if (lost) {
        return (
            <div className={`flex flex-col items-center w-full py-8 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-6xl mb-4">💨</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Die Flamme ist ausgegangen!</h3>
                <p className="text-gray-400 mb-4">Aber keine Sorge, versuch's nochmal!</p>
                <button onClick={() => { setLost(false); startGame(); }} className="btn-secondary">
                    Nochmal versuchen 🔄
                </button>
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
                <p className="text-xl font-bold text-gray-700">
                    {isActive ? `⏱️ ${timeLeft}s` : 'Beschütze die Flamme! 🔥'}
                </p>

                {isActive && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">Health:</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${flameHealth > 50 ? 'bg-green-400' :
                                        flameHealth > 25 ? 'bg-yellow-400' : 'bg-red-400'
                                    }`}
                                style={{ width: `${flameHealth}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold">{flameHealth}%</span>
                    </div>
                )}
            </div>

            {/* Game Area */}
            <div className="relative w-full h-64 bg-gradient-to-b from-gray-700 to-gray-900 rounded-2xl overflow-hidden shadow-xl mb-6">
                {/* Rain drops */}
                {drops.map(drop => (
                    <div
                        key={drop.id}
                        className="absolute w-2 h-4 bg-blue-400 rounded-full opacity-80"
                        style={{
                            left: `${drop.x}%`,
                            top: `${drop.y}%`,
                            transform: 'translateX(-50%)',
                        }}
                    />
                ))}

                {/* Flame */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <FlameIcon className={`w-16 h-16 ${flameHealth < 30 ? 'opacity-50' : ''}`} animated />
                </div>

                {/* Shield */}
                {shieldActive && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-24 border-4 border-blue-400 rounded-full bg-blue-400/20 animate-pulse" />
                )}

                {/* Instructions overlay when not active */}
                {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                            <p className="text-lg mb-2">🌧️ Regen kommt!</p>
                            <p className="text-sm opacity-80">Halte den Schild-Button gedrückt</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Shield Button */}
            {isActive ? (
                <button
                    onMouseDown={() => toggleShield(true)}
                    onMouseUp={() => toggleShield(false)}
                    onMouseLeave={() => toggleShield(false)}
                    onTouchStart={() => toggleShield(true)}
                    onTouchEnd={() => toggleShield(false)}
                    className={`
                        w-24 h-24 rounded-full font-bold text-white text-lg
                        transition-all duration-150 shadow-lg
                        ${shieldActive
                            ? 'bg-blue-500 scale-95 shadow-blue-400/50'
                            : 'bg-gradient-to-br from-pastel-lavender to-pastel-pink hover:scale-105'
                        }
                    `}
                >
                    {shieldActive ? '🛡️' : '👆'}
                </button>
            ) : (
                <button onClick={startGame} className="btn-primary">
                    Spiel starten 🎮
                </button>
            )}

            {/* Hint */}
            <p className="text-xs text-gray-400 mt-4 text-center">
                {isActive
                    ? 'Halte gedrückt für Schild! 🛡️'
                    : '15 Sekunden durchhalten = Win!'
                }
            </p>
        </div>
    );
};

export default StreakGuardian;
