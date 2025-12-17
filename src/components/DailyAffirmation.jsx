import { useState, useEffect, memo } from 'react';

/**
 * DailyAffirmation - Floating toast that appears with a sweet message
 * Shows periodically to brighten the user's experience
 */
const DailyAffirmation = memo(({ delay = 5000 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentAffirmation, setCurrentAffirmation] = useState(null);

    const affirmations = [
        { emoji: '💕', text: 'Du bist wundervoll!' },
        { emoji: '✨', text: 'Heute wird ein guter Tag!' },
        { emoji: '🌸', text: 'Du verdienst alles Glück!' },
        { emoji: '💖', text: 'Ich denke an dich!' },
        { emoji: '🦋', text: 'Du bist mein Sonnenschein!' },
        { emoji: '⭐', text: 'Du strahlst so schön!' },
        { emoji: '🌈', text: 'Alles wird gut!' },
        { emoji: '💫', text: 'Du bist einzigartig!' },
    ];

    useEffect(() => {
        // Show affirmation after delay
        const showTimer = setTimeout(() => {
            setCurrentAffirmation(
                affirmations[Math.floor(Math.random() * affirmations.length)]
            );
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(showTimer);
    }, [delay]);

    useEffect(() => {
        if (isVisible) {
            // Auto-hide after 4 seconds
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);
            return () => clearTimeout(hideTimer);
        }
    }, [isVisible]);

    if (!currentAffirmation) return null;

    return (
        <div
            className={`
                fixed top-20 left-1/2 -translate-x-1/2 z-40
                pointer-events-none
                transition-all duration-500 ease-apple
                ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4'
                }
            `}
        >
            <div className="
                bg-white/90 backdrop-blur-lg
                px-6 py-3 rounded-full
                shadow-lg border border-white/50
                flex items-center gap-3
            ">
                <span className="text-2xl animate-bounce">{currentAffirmation.emoji}</span>
                <span className="text-gray-700 font-medium">{currentAffirmation.text}</span>
            </div>
        </div>
    );
});

DailyAffirmation.displayName = 'DailyAffirmation';

export default DailyAffirmation;
