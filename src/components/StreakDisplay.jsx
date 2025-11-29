import { useState, useEffect } from 'react';
import { getTodayDate } from '../utils/storage';

const StreakDisplay = ({ streak, hasFreeze, lastUpdate, nextAvailableDate, isCompact = false }) => {
    const isUpdatedToday = lastUpdate === getTodayDate();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!nextAvailableDate) {
                setTimeLeft('Bereit!');
                return;
            }

            const now = new Date();
            const targetLocal = new Date(nextAvailableDate + 'T00:00:00');
            const diff = targetLocal - now;

            if (diff <= 0) {
                setTimeLeft('Bereit!');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeLeft(`Wieder verfügbar in ${days} Tagen, ${hours} Std. und ${minutes} Min.`);
            } else if (hours > 0) {
                setTimeLeft(`Wieder verfügbar in ${hours} Std. und ${minutes} Min.`);
            } else {
                setTimeLeft(`Wieder verfügbar in ${minutes} Min.`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000);
        return () => clearInterval(timer);
    }, [nextAvailableDate]);

    return (
        <div className={`
            relative transition-all duration-700 ease-apple z-20
            ${isCompact
                ? 'bg-white/90 backdrop-blur-md shadow-sm max-w-md mx-auto h-16 rounded-2xl mb-6'
                : 'card max-w-md mx-auto h-64 mb-8'
            }
        `}>
            {/* Flame Icon */}
            <div className={`
                absolute transition-all duration-700 ease-apple flex items-center justify-center
                ${isCompact
                    ? 'top-2 left-4 w-12 h-12 text-3xl'
                    : 'top-8 left-1/2 -translate-x-1/2 w-24 h-24 text-7xl'
                }
            `}>
                <span className={`filter drop-shadow-sm transition-all duration-700 ease-apple ${isUpdatedToday ? 'animate-pulse' : 'grayscale-[0.3]'}`}>
                    🔥
                </span>
                {hasFreeze && (
                    <span className={`
                        absolute -top-1 -right-1 transition-all duration-500 ease-apple
                        ${isCompact ? 'text-xs' : 'text-xl'}
                    `}>
                        ❄️
                    </span>
                )}
            </div>

            {/* Streak Count */}
            <div className={`
                absolute transition-all duration-700 ease-apple flex flex-col justify-center
                ${isCompact
                    ? 'top-2 left-16 h-12 items-start'
                    : 'top-32 left-1/2 -translate-x-1/2 items-center'
                }
            `}>
                <p className={`
                    font-bold transition-all duration-700 ease-apple whitespace-nowrap
                    ${isCompact ? 'text-xl' : 'text-5xl'} 
                    ${isUpdatedToday ? 'text-orange-500' : 'text-gray-700'}
                `}>
                    {streak}
                </p>
                {!isCompact && (
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1 opacity-100 transition-opacity duration-300 ease-apple">
                        Deine Streak
                    </p>
                )}
            </div>

            {/* Timer / Status Text */}
            <div className={`
                absolute transition-all duration-700 ease-apple flex items-center
                ${isCompact
                    ? 'top-0 right-6 h-16 justify-end'
                    : 'bottom-6 left-0 right-0 justify-center'
                }
            `}>
                <div className={`flex flex-col ${isCompact ? 'items-end' : 'items-center'}`}>
                    {/* Progress Dots (Only visible in large mode or simplified in compact) */}
                    <div className={`flex gap-1.5 transition-all duration-700 ease-apple ${isCompact ? 'opacity-0 h-0 w-0 overflow-hidden' : 'mb-2 opacity-100'}`}>
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-full transition-all duration-500 ease-apple ${i < 3 ? 'bg-pastel-pink' : 'bg-gray-200'} h-2 w-2`}
                            />
                        ))}
                    </div>

                    <span className={`font-medium text-gray-400 transition-all duration-700 ease-apple whitespace-nowrap ${isCompact ? 'text-xs' : 'text-sm'}`}>
                        {timeLeft}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StreakDisplay;
