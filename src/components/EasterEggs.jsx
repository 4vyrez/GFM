import { useState, useEffect, useCallback } from 'react';

/**
 * EasterEggs Component - Fun hidden features
 * - Konami Code (↑↑↓↓←→←→BA) unlocks secret mode
 * - Hold streak display for 5s to toggle dev insights
 * - Seasonal detection for special decorations
 */
const EasterEggs = ({ onKonamiUnlock, onDevModeToggle }) => {
    const [konamiProgress, setKonamiProgress] = useState(0);
    const [showKonamiHint, setShowKonamiHint] = useState(false);
    const [showUnlocked, setShowUnlocked] = useState(false);

    // Konami Code: ↑↑↓↓←→←→BA
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    const handleKeyDown = useCallback((event) => {
        const key = event.code;
        const expectedKey = konamiCode[konamiProgress];

        if (key === expectedKey) {
            const newProgress = konamiProgress + 1;
            setKonamiProgress(newProgress);

            // Show hint after first correct key
            if (newProgress === 1) {
                setShowKonamiHint(true);
                setTimeout(() => setShowKonamiHint(false), 2000);
            }

            // Check if complete
            if (newProgress === konamiCode.length) {
                setShowUnlocked(true);
                setKonamiProgress(0);

                // Trigger callback
                if (onKonamiUnlock) {
                    onKonamiUnlock();
                }

                // Hide after animation
                setTimeout(() => setShowUnlocked(false), 3000);
            }
        } else if (key.startsWith('Arrow') || key === 'KeyB' || key === 'KeyA') {
            // Wrong key in sequence - reset
            setKonamiProgress(0);
        }
    }, [konamiProgress, onKonamiUnlock]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Check for seasonal dates
    const getSeasonalEmoji = () => {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();

        // Christmas season (Dec 1-31)
        if (month === 11) return '🎄';
        // Valentine's (Feb 14)
        if (month === 1 && day === 14) return '💘';
        // Halloween (Oct 31)
        if (month === 9 && day === 31) return '🎃';
        // New Year (Jan 1)
        if (month === 0 && day === 1) return '🎆';
        // Spring (Mar-May)
        if (month >= 2 && month <= 4) return '🌸';
        // Summer (Jun-Aug)
        if (month >= 5 && month <= 7) return '☀️';
        // Fall (Sep-Nov)
        if (month >= 8 && month <= 10) return '🍂';

        return null;
    };

    const seasonalEmoji = getSeasonalEmoji();

    return (
        <>
            {/* Konami Hint Popup */}
            {showKonamiHint && (
                <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-mono animate-fade-in">
                    🎮 Konami Code detected... continue!
                </div>
            )}

            {/* Konami Unlock Celebration */}
            {showUnlocked && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="text-center animate-bounce-in">
                        <div className="text-8xl mb-4">🎮</div>
                        <p className="text-3xl font-black text-white mb-2">+30 LIVES!</p>
                        <p className="text-lg text-white/80">Secret Mode Unlocked 🔓</p>
                    </div>
                </div>
            )}

            {/* Seasonal floating decoration */}
            {seasonalEmoji && (
                <div
                    className="fixed bottom-20 right-4 text-2xl opacity-40 animate-float pointer-events-none"
                    title="Seasonal decoration"
                >
                    {seasonalEmoji}
                </div>
            )}
        </>
    );
};

// Fun loading messages that rotate
export const loadingMessages = [
    'Wird geladen... ✨',
    'Magie passiert... 🪄',
    'Herzen sammeln... 💕',
    'Liebe laden... 💝',
    'Flammen entzünden... 🔥',
    'Sterne züchten... ⭐',
    'Glitzer verteilen... ✨',
    'Kuschelmomente vorbereiten... 🤗',
    'Süßes backen... 🧁',
    'Schmetterlinge loslassen... 🦋',
];

export const getRandomLoadingMessage = () => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
};

// Daily motivation quotes - one per day for variety
export const motivationQuotes = [
    { text: "Du schaffst das! 💪", emoji: "🌟" },
    { text: "Jeder Tag ist eine neue Chance.", emoji: "🌅" },
    { text: "Du bist stärker als du denkst.", emoji: "💎" },
    { text: "Kleine Schritte führen zu großen Zielen.", emoji: "🎯" },
    { text: "Glaub an dich selbst!", emoji: "✨" },
    { text: "Du machst das großartig.", emoji: "🏆" },
    { text: "Heute ist dein Tag!", emoji: "☀️" },
    { text: "Bleib dran, es lohnt sich.", emoji: "🔥" },
    { text: "Du inspirierst mich.", emoji: "💕" },
    { text: "Zusammen sind wir unschlagbar.", emoji: "🤝" },
    { text: "Sei stolz auf dich!", emoji: "👑" },
    { text: "Das Beste kommt noch.", emoji: "🌈" },
    { text: "Du bist einzigartig wunderbar.", emoji: "💫" },
    { text: "Atme tief durch, du hast das.", emoji: "🌿" },
    { text: "Deine Energie ist ansteckend.", emoji: "⚡" },
    { text: "Träume groß!", emoji: "🚀" },
    { text: "Du bist mein Lieblingsmensch.", emoji: "❤️" },
    { text: "Mach weiter so!", emoji: "🎉" },
    { text: "Du bist genug, genau so wie du bist.", emoji: "🌸" },
    { text: "Lass dich nicht unterkriegen.", emoji: "💪" },
];

// Get motivation quote for today (consistent per day)
export const getDailyMotivation = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % motivationQuotes.length;
    return motivationQuotes[index];
};

export default EasterEggs;

