import { getData } from '../utils/storage';
import { SparkleIcon } from './icons/Icons';

const StatsPanel = ({ appData }) => {
    const data = appData || getData();

    const stats = [
        {
            label: 'Aktueller Streak',
            value: data.streak || 0,
            emoji: '🔥',
            color: 'from-orange-400 to-red-400'
        },
        {
            label: 'Bester Streak',
            value: Math.max(data.longestStreak || 0, data.streak || 0),
            emoji: '🏆',
            color: 'from-yellow-400 to-orange-400'
        },
        {
            label: 'Besuche',
            value: data.totalVisits || 0,
            emoji: '📱',
            color: 'from-blue-400 to-purple-400'
        },
        {
            label: 'Spiele gespielt',
            value: (data.playedGames || []).length,
            emoji: '🎮',
            color: 'from-green-400 to-teal-400'
        },
        {
            label: 'Freeze Kristalle',
            value: data.streakFreezes || 0,
            emoji: '❄️',
            color: 'from-cyan-400 to-blue-400'
        },
        {
            label: 'Fotos gesehen',
            value: (data.shownPhotoIds || []).length,
            emoji: '📸',
            color: 'from-pink-400 to-rose-400'
        },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
                <SparkleIcon className="w-5 h-5" />
                <h3 className="text-lg font-bold text-gray-800">Deine Stats</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className={`
                            relative overflow-hidden
                            bg-gradient-to-br ${stat.color}
                            rounded-2xl p-4
                            text-white
                            shadow-md
                            transition-all duration-300
                            hover:scale-[1.02] hover:shadow-lg
                        `}
                        style={{
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Background decoration */}
                        <div className="absolute -right-2 -top-2 text-4xl opacity-20">
                            {stat.emoji}
                        </div>

                        <div className="relative z-10">
                            <div className="text-3xl font-black mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium opacity-90">
                                {stat.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsPanel;
