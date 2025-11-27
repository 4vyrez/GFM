import { getTodayDate } from '../utils/storage';

const StreakDisplay = ({ streak, hasFreeze, lastUpdate }) => {
    const isUpdatedToday = lastUpdate === getTodayDate();

    return (
        <div className="card max-w-md mx-auto mb-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center justify-between px-2">
                {/* Streak Counter */}
                <div className="flex items-center gap-4">
                    <span className={`text-5xl filter drop-shadow-sm transition-all duration-500 ${isUpdatedToday ? 'scale-110 animate-pulse' : 'grayscale-[0.3]'}`}>
                        🔥
                    </span>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">
                            Deine Streak
                        </p>
                        <p className={`text-4xl font-bold ${isUpdatedToday ? 'text-orange-500' : 'text-gray-700'}`}>
                            {streak}
                        </p>
                    </div>
                </div>

                {/* Streak Freeze Indicator */}
                {hasFreeze && (
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                        <span className="text-2xl">❄️</span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Auf Eis</span>
                            <span className="text-[10px] text-blue-400 leading-none">Geschützt</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-100 my-4 w-full"></div>

            {/* Subtle, positive encouragement */}
            <p className="text-sm text-gray-400 font-medium text-center italic">
                Schön, dass du da bist! ✨
            </p>
        </div>
    );
};

export default StreakDisplay;
