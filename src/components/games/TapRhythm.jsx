import { useState, useEffect, useCallback, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * TapRhythm Game - Tap circles as they shrink to the target
 * Timing-based accuracy game
 */
const TapRhythm = ({ onWin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [won, setWon] = useState(false);
    const [score, setScore] = useState(0);
    const [circles, setCircles] = useState([]);
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const targetScore = 5;
    const circleIdRef = useRef(0);
    const gameLoopRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => {
            clearTimeout(timer);
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, []);

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setCombo(0);
        spawnCircle();
    };

    const spawnCircle = useCallback(() => {
        if (won) return;

        const id = circleIdRef.current++;
        const positions = [
            { x: 25, y: 30 },
            { x: 50, y: 25 },
            { x: 75, y: 30 },
            { x: 35, y: 55 },
            { x: 65, y: 55 },
            { x: 50, y: 70 },
        ];
        const pos = positions[Math.floor(Math.random() * positions.length)];

        const newCircle = {
            id,
            x: pos.x,
            y: pos.y,
            scale: 2.5,
            opacity: 1,
            color: ['pink', 'purple', 'blue', 'yellow'][Math.floor(Math.random() * 4)],
        };

        setCircles(prev => [...prev, newCircle]);

        // Shrink animation
        const shrinkInterval = setInterval(() => {
            setCircles(prev => prev.map(c => {
                if (c.id === id) {
                    const newScale = c.scale - 0.03;
                    if (newScale <= 0) {
                        clearInterval(shrinkInterval);
                        // Missed - remove circle
                        setTimeout(() => {
                            setCircles(p => p.filter(x => x.id !== id));
                            setCombo(0);
                            setFeedback({ type: 'miss', text: 'Miss!' });
                            setTimeout(() => setFeedback(null), 500);
                        }, 0);
                        return c;
                    }
                    return { ...c, scale: newScale };
                }
                return c;
            }));
        }, 30);

        // Schedule next circle
        if (!won) {
            setTimeout(() => spawnCircle(), 800 + Math.random() * 400);
        }
    }, [won]);

    const handleTap = (circle) => {
        if (won) return;

        // Check timing (scale should be close to 1)
        const accuracy = Math.abs(1 - circle.scale);

        let points = 0;
        let feedbackText = '';

        if (accuracy < 0.2) {
            points = 1;
            feedbackText = 'Perfekt! ✨';
        } else if (accuracy < 0.5) {
            points = 1;
            feedbackText = 'Gut! 👍';
        } else {
            feedbackText = 'Zu früh!';
            setCombo(0);
        }

        if (points > 0) {
            const newScore = score + points;
            setScore(newScore);
            setCombo(prev => prev + 1);

            if (newScore >= targetScore) {
                setWon(true);
                setTimeout(() => {
                    if (onWin) {
                        onWin({
                            gameId: 'tap-rhythm-1',
                            metric: 'score',
                            value: newScore,
                        });
                    }
                }, 1500);
            }
        }

        setFeedback({ type: points > 0 ? 'hit' : 'early', text: feedbackText });
        setTimeout(() => setFeedback(null), 400);

        // Remove tapped circle
        setCircles(prev => prev.filter(c => c.id !== circle.id));
    };

    const colorClasses = {
        pink: 'border-pink-400 bg-pink-400/20',
        purple: 'border-purple-400 bg-purple-400/20',
        blue: 'border-blue-400 bg-blue-400/20',
        yellow: 'border-yellow-400 bg-yellow-400/20',
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
                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Rhythmus-Meister!' : 'Tippe im Takt! 🎵'}
                </p>

                {/* Score */}
                <div className="flex justify-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                        Score: <span className="font-bold text-gray-700">{score}/{targetScore}</span>
                    </span>
                    {combo > 1 && (
                        <span className="text-sm text-orange-500 font-bold animate-pulse">
                            🔥 {combo}x Combo!
                        </span>
                    )}
                </div>
            </div>

            {/* Game area */}
            <div className="relative w-full h-64 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl overflow-hidden">
                {/* Target ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                    <div className="w-16 h-16 rounded-full border-2 border-white/30 border-dashed" />
                </div>

                {/* Circles */}
                {circles.map(circle => (
                    <button
                        key={circle.id}
                        onClick={() => handleTap(circle)}
                        onTouchEnd={(e) => { e.preventDefault(); handleTap(circle); }}
                        style={{
                            left: `${circle.x}%`,
                            top: `${circle.y}%`,
                            transform: `translate(-50%, -50%) scale(${circle.scale})`,
                        }}
                        className={`
                            absolute w-12 h-12 rounded-full
                            border-4 ${colorClasses[circle.color]}
                            transition-none
                            flex items-center justify-center
                            cursor-pointer touch-manipulation
                            select-none
                        `}
                        aria-label="Tap circle"
                    >
                        <div className={`
                            w-3 h-3 rounded-full
                            ${circle.color === 'pink' ? 'bg-pink-400' :
                                circle.color === 'purple' ? 'bg-purple-400' :
                                    circle.color === 'blue' ? 'bg-blue-400' : 'bg-yellow-400'}
                        `} />
                    </button>
                ))}

                {/* Feedback */}
                {feedback && (
                    <div className={`
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-2xl font-bold animate-bounce-in
                        ${feedback.type === 'hit' ? 'text-green-400' :
                            feedback.type === 'early' ? 'text-yellow-400' : 'text-red-400'}
                    `}>
                        {feedback.text}
                    </div>
                )}

                {/* Start overlay */}
                {!gameStarted && !won && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                        >
                            🎵 Start!
                        </button>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <p className="mt-4 text-sm text-gray-500 text-center">
                {won ? 'Du hast den Rhythmus!' : 'Tippe die Kreise wenn sie den Ring erreichen'}
            </p>

            {/* Win celebration */}
            {won && (
                <div className="mt-4 flex items-center gap-2 text-green-500 animate-bounce-in">
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                    <p className="font-bold">Musik in deinen Fingern! 🎶</p>
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                </div>
            )}
        </div>
    );
};

export default TapRhythm;
