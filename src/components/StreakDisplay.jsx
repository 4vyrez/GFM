const StreakDisplay = ({ streak, hasFreeze }) => {
    return (
        <div className="card max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between">
                {/* Streak Counter */}
                <div className="flex items-center gap-3">
                    <span className="text-4xl">🔥</span>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Deine Streak</p>
                        <p className="text-3xl font-bold text-gray-800">{streak}</p>
                    </div>
                </div>

                {/* Streak Freeze Indicator (Duolingo Insider) */}
                {hasFreeze && (
                    <div className="flex items-center gap-2 bg-pastel-lavender px-4 py-2 rounded-lg">
                        <span className="text-2xl">❄️</span>
                        <span className="text-sm font-medium text-gray-700">Streak auf Eis</span>
                    </div>
                )}
            </div>

            {/* Subtle, positive encouragement */}
            <p className="text-xs text-gray-500 mt-4 text-center">
                Schön, dass du da bist! ✨
            </p>
        </div>
    );
};

export default StreakDisplay;
