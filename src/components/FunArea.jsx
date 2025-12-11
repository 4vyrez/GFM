import { useState, useEffect } from 'react';
import { GameControllerIcon, FlameIcon, SparkleIcon } from './icons/Icons';
import InfoButton from './ui/InfoButton';

const FunArea = ({ children, gameDescription }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    return (
        <div
            className={`
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
        >
            <div className="max-w-md mx-auto mb-8 bg-white/80 backdrop-blur-glass rounded-3xl shadow-glass border border-white/60 p-6 relative overflow-hidden">
                {/* Decorative background gradient */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pastel-lavender/40 to-pastel-pink/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pastel-mint/30 to-pastel-blue/30 rounded-full blur-2xl" />

                {/* Info Button - Top Right */}
                <InfoButton className="absolute top-3 right-3 z-30">
                    {gameDescription || 'Spiele das Spiel, um deinen Streak zu behalten.'}
                </InfoButton>

                {/* Header with animation */}
                <div className="text-center mb-6 relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        {/* Animated game controller */}
                        <div className="relative">
                            <GameControllerIcon className="w-8 h-8 text-gray-700 animate-float" />
                            {/* Sparkle decoration */}
                            <SparkleIcon className="absolute -top-1 -right-1 w-3 h-3 animate-pulse-glow" />
                        </div>

                        <h2 className="text-2xl font-bold text-gradient">
                            Überraschung für heute!
                        </h2>
                    </div>

                    <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                        <span>Spiele das Spiel, um deine Flamme am Leben zu erhalten!</span>
                        <FlameIcon className="w-5 h-5" animated />
                    </p>
                </div>

                {/* Game Content Container with premium styling */}
                <div className="relative">
                    {/* Inner glow border */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl" />

                    <div className="relative bg-gradient-to-br from-gray-50/80 to-white/60 backdrop-blur-xs rounded-2xl p-5 border border-white/50 shadow-inner">
                        {children}
                    </div>
                </div>

                {/* Bottom decorative element */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-pastel-pink/30 to-transparent" />
            </div>
        </div>
    );
};

export default FunArea;
