import { formatMetricValue, getMetricLabel } from '../utils/storage';
import { StarIcon, SparkleIcon, HeartIcon, TrophyIcon } from './icons/Icons';
import Card from './ui/Card';

const ComparisonDisplay = ({ userScore, partnerScore }) => {
    if (!userScore || !partnerScore) return null;

    const metric = userScore.metric || partnerScore.metric;
    const metricLabel = getMetricLabel(metric);

    // Determine who did better
    const lowerIsBetter = ['milliseconds', 'seconds', 'attempts', 'moves', 'flips'].includes(metric);
    let userBetter = false;

    if (lowerIsBetter) {
        userBetter = userScore.value < partnerScore.value;
    } else {
        userBetter = userScore.value > partnerScore.value;
    }

    return (
        <Card className="mb-4 animate-fade-in !p-0 overflow-hidden" variant="glass">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-pastel-lavender/50 via-pastel-pink/30 to-pastel-lavender/50 px-4 py-3 border-b border-white/30">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">
                    {metricLabel}
                </h3>
            </div>

            <div className="p-4">
                {/* Scores Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* User Score */}
                    <div className={`
                        relative p-4 rounded-2xl border-2 transition-all duration-300
                        ${userBetter
                            ? 'bg-gradient-to-br from-pastel-pink/20 to-pastel-coral/10 border-pastel-pink'
                            : 'bg-gray-50/80 border-gray-200/50'}
                    `}>
                        {userBetter && (
                            <div className="absolute -top-2 -right-2">
                                <TrophyIcon className="w-6 h-6 animate-bounce-in" />
                            </div>
                        )}

                        <div className="text-xs font-bold uppercase tracking-wide mb-2 text-center opacity-70">
                            Dein Score
                        </div>
                        <div className={`
                            text-2xl font-black text-center
                            ${userBetter ? 'text-gradient-warm' : 'text-gray-600'}
                        `}>
                            {formatMetricValue(metric, userScore.value)}
                        </div>
                    </div>

                    {/* Partner Score */}
                    <div className={`
                        relative p-4 rounded-2xl border-2 transition-all duration-300
                        ${!userBetter
                            ? 'bg-gradient-to-br from-pastel-peach/20 to-orange-100/10 border-pastel-peach'
                            : 'bg-gray-50/80 border-gray-200/50'}
                    `}>
                        {!userBetter && (
                            <div className="absolute -top-2 -right-2">
                                <TrophyIcon className="w-6 h-6 animate-bounce-in" />
                            </div>
                        )}

                        <div className="text-xs font-bold uppercase tracking-wide mb-2 text-center opacity-70">
                            Mein Bestes
                        </div>
                        <div className={`
                            text-2xl font-black text-center
                            ${!userBetter ? 'text-gradient' : 'text-gray-600'}
                        `}>
                            {formatMetricValue(metric, partnerScore.value)}
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className={`
                    flex items-center justify-center gap-2 py-2 px-4 rounded-xl
                    ${userBetter
                        ? 'bg-gradient-to-r from-yellow-100/80 to-orange-100/80'
                        : 'bg-gradient-to-r from-pink-100/80 to-rose-100/80'}
                `}>
                    {userBetter ? (
                        <>
                            <SparkleIcon className="w-5 h-5" />
                            <p className="text-sm font-bold text-gray-700">Du warst besser!</p>
                            <SparkleIcon className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <HeartIcon className="w-5 h-5" />
                            <p className="text-sm font-bold text-gray-700">Ich war besser!</p>
                            <HeartIcon className="w-5 h-5" />
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ComparisonDisplay;
