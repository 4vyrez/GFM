import { useState, useEffect } from 'react';
import { getData, saveData, getTodayDate } from '../utils/storage';

const MoodReaction = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const moods = [
        { emoji: '❤️', label: 'Liebe' },
        { emoji: '🥰', label: 'Verliebt' },
        { emoji: '😊', label: 'Glücklich' },
        { emoji: '🥹', label: 'Gerührt' },
        { emoji: '💕', label: 'Dankbar' },
    ];

    useEffect(() => {
        const data = getData();
        const today = getTodayDate();
        if (data.moodReactions && data.moodReactions[today]) {
            setSelectedMood(data.moodReactions[today]);
        }
    }, []);

    const handleMoodSelect = (emoji) => {
        if (selectedMood === emoji) return; // Already selected

        setIsAnimating(true);
        setSelectedMood(emoji);

        const data = getData();
        const today = getTodayDate();
        const updatedData = {
            ...data,
            moodReactions: {
                ...data.moodReactions,
                [today]: emoji
            }
        };
        saveData(updatedData);

        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-3 font-medium">
                Wie fühlt sich das an?
            </p>
            <div className="flex justify-center gap-2">
                {moods.map((mood, index) => (
                    <button
                        key={mood.emoji}
                        onClick={() => handleMoodSelect(mood.emoji)}
                        className={`
                            relative w-10 h-10 rounded-full
                            flex items-center justify-center
                            text-xl
                            transition-all duration-300 ease-apple
                            ${selectedMood === mood.emoji
                                ? 'bg-pastel-pink/30 scale-110 shadow-md ring-2 ring-pastel-pink/50'
                                : 'bg-white/50 hover:bg-white/80 hover:scale-105'}
                            ${isAnimating && selectedMood === mood.emoji ? 'animate-bounce-in' : ''}
                        `}
                        style={{
                            animationDelay: `${index * 50}ms`,
                        }}
                        title={mood.label}
                    >
                        <span className={`
                            transition-transform duration-300
                            ${selectedMood === mood.emoji ? 'scale-110' : 'grayscale-[30%]'}
                        `}>
                            {mood.emoji}
                        </span>

                        {selectedMood === mood.emoji && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pastel-pink rounded-full" />
                        )}
                    </button>
                ))}
            </div>
            {selectedMood && (
                <p className="text-xs text-gray-400 mt-3 animate-fade-in">
                    Deine Reaktion heute: {selectedMood}
                </p>
            )}
        </div>
    );
};

export default MoodReaction;
