import { useState, useEffect, useRef } from 'react';
import { getTodayDate } from '../utils/storage';
import { FlameIcon, StreakFreezeIcon } from './icons/Icons';
import InfoButton from './ui/InfoButton';

const StreakDisplay = ({ streak, streakFreezes = 0, lastUpdate, nextAvailableDate, isCompact = false }) => {
    const isUpdatedToday = lastUpdate === getTodayDate();
    const [timeLeft, setTimeLeft] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const prevStreak = useRef(streak);

    // Animate when streak changes
    useEffect(() => {
        if (prevStreak.current !== streak) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
            prevStreak.current = streak;
        }
    }, [streak]);

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
            max-w-md mx-auto relative
            bg-white/85 backdrop-blur-glass
            rounded-3xl
            border border-white/60
            overflow-hidden
            transition-all duration-500 ease-apple
            ${isCompact ? 'mb-4 p-4' : 'mb-8 p-6'}
            ${isUpdatedToday ? 'shadow-glow-orange' : 'shadow-glass'}
        `}>
            {/* Animated background glow when active */}
            {isUpdatedToday && (
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -inset-4 bg-gradient-to-br from-orange-200/30 via-yellow-100/20 to-orange-100/30 animate-pulse-glow blur-xl" />
                </div>
            )}

            {/* Info Button - Top Right */}
            <InfoButton className="absolute top-3 right-3 z-30">
                <div className="flex items-center gap-2 mb-2">
                    <StreakFreezeIcon className="w-4 h-4" />
                    <span className="font-bold text-gray-800">Streak Freeze</span>
                </div>
                <p className="leading-relaxed text-gray-500">
                    Sammle bis zu 3 Kristalle. Ein Kristall friert deinen Streak ein, wenn du mal einen Tag verpasst.
                </p>
            </InfoButton>

            {/* Streak Freezes - Top Left with stagger animation */}
            <div className={`
                absolute left-4 flex items-center gap-1.5 transition-all duration-500
                ${isCompact ? 'top-3' : 'top-4'}
            `}>
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        style={{ animationDelay: `${i * 100}ms` }}
                        className={`
                            transition-all duration-300 transform
                            ${i < streakFreezes ? 'animate-bounce-in opacity-100 scale-100' : 'opacity-30 scale-90'}
                        `}
                    >
                        <StreakFreezeIcon
                            className={`
                                transition-all duration-300
                                ${isCompact ? 'w-5 h-5' : 'w-7 h-7'}
                            `}
                            used={i >= streakFreezes}
                        />
                    </div>
                ))}
            </div>

            {/* Main Content with animated layout */}
            <div className={`
                flex items-center
                transition-all duration-500 ease-apple
                ${isCompact ? 'flex-row gap-4 pt-0' : 'flex-col pt-10'}
            `}>
                {/* Flame Icon Container with glow */}
                <div className={`
                    relative
                    transition-all duration-500 ease-apple flex-shrink-0
                    ${isCompact ? 'w-14 h-14' : 'w-36 h-36 mb-2'}
                `}>
                    {/* Ambient glow behind flame */}
                    {isUpdatedToday && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`
                                rounded-full bg-gradient-to-br from-orange-400/40 to-yellow-300/30
                                animate-pulse-glow blur-lg
                                ${isCompact ? 'w-12 h-12' : 'w-28 h-28'}
                            `} />
                        </div>
                    )}

                    <FlameIcon
                        className={`
                            w-full h-full relative z-10
                            transition-all duration-300
                            ${isUpdatedToday ? 'drop-shadow-lg' : 'opacity-40 grayscale'}
                        `}
                        animated={isUpdatedToday}
                    />
                </div>

                {/* Text Content */}
                <div className={`
                    transition-all duration-500 ease-apple
                    ${isCompact ? 'flex items-center gap-3' : 'flex flex-col items-center text-center'}
                `}>
                    {/* Streak Count with animation */}
                    <span className={`
                        font-black tracking-tight transition-all duration-500
                        ${isCompact ? 'text-4xl' : 'text-8xl'}
                        ${isUpdatedToday ? 'text-gradient-warm' : 'text-gray-300'}
                        ${isAnimating ? 'animate-bounce-in' : ''}
                    `}>
                        {streak}
                    </span>

                    {/* Label - only shown in full mode */}
                    <span className={`
                        text-sm uppercase tracking-widest font-bold
                        transition-all duration-500
                        ${isUpdatedToday ? 'text-orange-400/80' : 'text-gray-400'}
                        ${isCompact ? 'hidden' : 'mt-1 mb-4'}
                    `}>
                        Tage Streak
                    </span>
                </div>

                {/* Timer Pill - only in full mode */}
                <div className={`
                    transition-all duration-500
                    ${isCompact ? 'hidden' : 'block'}
                `}>
                    <span className={`
                        inline-flex items-center gap-2
                        text-xs font-semibold
                        bg-gradient-to-r from-gray-100/80 to-gray-50/80
                        backdrop-blur-xs
                        px-5 py-2.5 rounded-full
                        border border-gray-200/50
                        text-gray-500
                        shadow-sm
                    `}>
                        {timeLeft === 'Bereit!' && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                        {timeLeft}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StreakDisplay;
