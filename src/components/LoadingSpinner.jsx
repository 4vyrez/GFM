/**
 * Loading Spinner Component
 * Displays animated loading state for games
 */
const LoadingSpinner = ({ message = 'Lädt...' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
            <div className="relative w-16 h-16">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-pink-200 opacity-30" />
                {/* Spinning ring */}
                <div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-400 animate-spin"
                    style={{ animationDuration: '1s' }}
                />
                {/* Inner pulse */}
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 animate-pulse" />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    💕
                </div>
            </div>
            <p className="text-gray-500 font-medium text-sm animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
