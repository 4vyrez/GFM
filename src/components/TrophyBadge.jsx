import { SparkleIcon } from './icons/Icons';

/**
 * Trophy Badge Component - Displays achievement on win
 */
const TrophyBadge = ({ score, metric, isPerfect = false }) => {
    const getTrophyEmoji = () => {
        if (isPerfect) return '🏆';
        if (score >= 90) return '🥇';
        if (score >= 70) return '🥈';
        return '🥉';
    };

    const getMessage = () => {
        if (isPerfect) return 'PERFEKT!';
        if (score >= 90) return 'Ausgezeichnet!';
        if (score >= 70) return 'Sehr gut!';
        return 'Geschafft!';
    };

    return (
        <div className="flex flex-col items-center gap-2 animate-bounce-in">
            <div className="relative">
                <span className="text-5xl filter drop-shadow-lg">{getTrophyEmoji()}</span>
                {isPerfect && (
                    <div className="absolute -top-1 -right-1">
                        <SparkleIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                    </div>
                )}
            </div>
            <p className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {getMessage()}
            </p>
            {metric && score !== undefined && (
                <p className="text-xs text-gray-400">
                    {metric}: {score}
                </p>
            )}
        </div>
    );
};

export default TrophyBadge;
