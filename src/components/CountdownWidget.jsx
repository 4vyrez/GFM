import { useState, useEffect, memo, useRef } from 'react';

/**
 * CountdownWidget - Countdown to a special date
 * OPTIMIZED: Updates only every minute instead of every second to reduce re-renders
 */
const CountdownWidget = memo(({ targetDate, label = 'Bis Weihnachten' }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        isPast: false,
    });
    const intervalRef = useRef(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const target = new Date(targetDate);
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, isPast: true });
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            const newTime = {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                isPast: false,
            };

            // Only update if values changed
            setTimeLeft(prev => {
                if (prev.days === newTime.days &&
                    prev.hours === newTime.hours &&
                    prev.minutes === newTime.minutes) {
                    return prev;
                }
                return newTime;
            });
        };

        calculateTimeLeft();
        // Update every 30 seconds instead of every second
        intervalRef.current = setInterval(calculateTimeLeft, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [targetDate]);

    if (timeLeft.isPast) {
        return (
            <div className="
                bg-white/80 backdrop-blur-sm rounded-2xl p-4
                border border-white/50 shadow-sm
                text-center
            ">
                <p className="text-2xl mb-1">🎉</p>
                <p className="text-gray-700 font-bold">Es ist soweit!</p>
            </div>
        );
    }

    return (
        <div className="
            bg-white/80 backdrop-blur-sm rounded-2xl p-4
            border border-white/50 shadow-sm
        ">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 text-center">
                {label} 🎄
            </p>

            <div className="flex justify-center gap-3">
                <TimeUnit value={timeLeft.days} label="Tage" />
                <span className="text-gray-300 font-light text-xl self-start mt-1">:</span>
                <TimeUnit value={timeLeft.hours} label="Std" />
                <span className="text-gray-300 font-light text-xl self-start mt-1">:</span>
                <TimeUnit value={timeLeft.minutes} label="Min" />
            </div>
        </div>
    );
});

const TimeUnit = memo(({ value, label }) => (
    <div className="text-center">
        <div className="
            bg-gradient-to-br from-pastel-pink/30 to-pastel-lavender/30
            rounded-xl px-3 py-2 min-w-[3rem]
        ">
            <span className="text-2xl font-bold text-gray-800">
                {String(value).padStart(2, '0')}
            </span>
        </div>
        <span className="text-xs text-gray-400 mt-1 block">{label}</span>
    </div>
));

CountdownWidget.displayName = 'CountdownWidget';
TimeUnit.displayName = 'TimeUnit';

export default CountdownWidget;
