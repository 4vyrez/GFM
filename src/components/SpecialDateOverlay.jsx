import React, { useState, useEffect } from 'react';
import { getSpecialDateForToday } from '../data/specials';

/**
 * SpecialDateOverlay Component
 * 
 * Displays a special celebration overlay for birthday (Aug 15) 
 * and anniversary (Aug 18)
 */
const SpecialDateOverlay = ({ onClose }) => {
    const [special, setSpecial] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const todaySpecial = getSpecialDateForToday();
        if (todaySpecial) {
            setSpecial(todaySpecial);
            // Small delay for smooth entrance
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(), 300);
    };

    if (!special) return null;

    const isBirthday = special.animation === 'birthday';
    const isAnniversary = special.animation === 'hearts';

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleClose}
        >
            {/* Background with animated gradient */}
            <div
                className={`absolute inset-0 ${isBirthday
                        ? 'bg-gradient-to-br from-pink-500/90 via-purple-500/90 to-pink-600/90'
                        : 'bg-gradient-to-br from-red-400/90 via-pink-500/90 to-rose-500/90'
                    }`}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                            fontSize: `${20 + Math.random() * 15}px`,
                        }}
                    >
                        {isBirthday
                            ? ['🎂', '🎈', '🎉', '🎁', '✨', '🥳'][i % 6]
                            : ['💕', '💖', '💗', '💓', '❤️', '✨'][i % 6]
                        }
                    </div>
                ))}
            </div>

            {/* Content Card */}
            <div
                className={`relative z-10 max-w-md mx-4 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'
                    }`}
                onClick={e => e.stopPropagation()}
            >
                {/* Special Image (if exists) */}
                {special.specialImage && !imageError && (
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={`/images/special/${special.specialImage}`}
                            alt={special.title}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                    </div>
                )}

                {/* Icon and Title */}
                <div className="p-6 text-center">
                    <div className="text-6xl mb-4 animate-bounce-in">
                        {special.icon}
                    </div>

                    <h2 className="text-2xl font-black text-gray-800 mb-4">
                        {special.title}
                    </h2>

                    <p className="text-gray-600 leading-relaxed mb-6">
                        {special.message}
                    </p>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className={`px-8 py-3 rounded-full font-bold text-white 
                            ${isBirthday
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                                : 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600'
                            } 
                            transform hover:scale-105 transition-all shadow-lg`}
                    >
                        Danke! 💖
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpecialDateOverlay;
