import { useState, useEffect } from 'react';
import { FlameIcon, SparkleIcon } from './icons/Icons';

const milestones = [
    { days: 7, emoji: '🌟', title: '1 Woche!', message: 'Eine ganze Woche zusammen! 💕', badge: 'Starter' },
    { days: 14, emoji: '💎', title: '2 Wochen!', message: 'Du bist unglaublich! 🌸', badge: 'Committed' },
    { days: 30, emoji: '🔥', title: '1 Monat!', message: 'Ein ganzer Monat! Wahnsinn! 🎉', badge: 'Dedicated' },
    { days: 50, emoji: '👑', title: '50 Tage!', message: 'Du bist eine Legende! 👸', badge: 'Legend' },
    { days: 100, emoji: '💖', title: '100 Tage!', message: 'Ich liebe dich so sehr! 💕💕💕', badge: 'Eternal' },
];

const StreakMilestone = ({ streak, isVisible, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentMilestone, setCurrentMilestone] = useState(null);

    useEffect(() => {
        const milestone = milestones.find(m => m.days === streak);
        if (milestone && isVisible) {
            setCurrentMilestone(milestone);
            setIsAnimating(true);
        }
    }, [streak, isVisible]);

    if (!isVisible || !currentMilestone) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className={`
                absolute inset-0 bg-black/50 backdrop-blur-sm
                transition-opacity duration-500
                ${isAnimating ? 'opacity-100' : 'opacity-0'}
            `} />

            {/* Radial burst */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 50%)`
                }}
            />

            {/* Confetti */}
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 rounded-sm confetti-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        backgroundColor: ['#FF6B9D', '#FFD700', '#4FC3F7', '#A855F7', '#FF7F7F'][i % 5],
                        animationDelay: `${Math.random() * 0.5}s`,
                    }}
                />
            ))}

            {/* Content */}
            <div
                className={`
                    relative z-10 text-center
                    transition-all duration-700 ease-spring
                    ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Big emoji */}
                <div className="text-8xl mb-4 animate-bounce-in">
                    {currentMilestone.emoji}
                </div>

                {/* Streak number with flame */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FlameIcon className="w-12 h-12" animated />
                    <span className="text-6xl font-black text-white drop-shadow-lg">
                        {streak}
                    </span>
                    <FlameIcon className="w-12 h-12" animated />
                </div>

                {/* Title */}
                <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2 animate-slide-up">
                    {currentMilestone.title}
                </h2>

                {/* Message */}
                <p className="text-lg text-white/90 font-medium mb-6 animate-fade-in">
                    {currentMilestone.message}
                </p>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg animate-pop-in">
                    <SparkleIcon className="w-5 h-5" />
                    <span className="font-bold text-gray-800">
                        {currentMilestone.badge} Badge freigeschaltet!
                    </span>
                    <SparkleIcon className="w-5 h-5" />
                </div>

                {/* Tap to close */}
                <p className="text-white/60 text-sm mt-8 animate-fade-in">
                    Tippe zum Schließen
                </p>
            </div>
        </div>
    );
};

export { milestones };
export default StreakMilestone;
