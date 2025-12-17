import { memo } from 'react';

/**
 * PhotoFrameEffects - Animated decorative elements around photos
 * OPTIMIZED: Uses CSS-only animations, memo for no re-renders
 */
const PhotoFrameEffects = memo(({ isActive = true }) => {
    if (!isActive) return null;

    // Static decorations - no state, pure CSS animations
    return (
        <div
            className="absolute inset-0 pointer-events-none overflow-visible z-10"
            aria-hidden="true"
        >
            {/* Animated decorations with staggered CSS animations */}
            <span
                className="absolute top-2 left-4 text-lg opacity-60"
                style={{ animation: 'float-gentle 3s ease-in-out infinite' }}
            >
                ✨
            </span>
            <span
                className="absolute top-4 right-6 text-base opacity-50"
                style={{ animation: 'float-gentle 3s ease-in-out 0.5s infinite' }}
            >
                💫
            </span>
            <span
                className="absolute bottom-16 left-2 text-xl opacity-60"
                style={{ animation: 'float-gentle 3s ease-in-out 1s infinite' }}
            >
                🌸
            </span>
            <span
                className="absolute bottom-20 right-4 text-lg opacity-50"
                style={{ animation: 'float-gentle 3s ease-in-out 1.5s infinite' }}
            >
                💕
            </span>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-t-3xl bg-gradient-to-t from-pink-200/10 via-transparent to-purple-200/10" />

            <style>{`
                @keyframes float-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
});

PhotoFrameEffects.displayName = 'PhotoFrameEffects';

export default PhotoFrameEffects;
