import { useTheme } from '../context/ThemeContext';

const StylePicker = ({ themes }) => {
    const { currentTheme, setTheme } = useTheme();

    return (
        <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
                const isActive = currentTheme === theme.id;

                return (
                    <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={`
              relative group
              p-4 rounded-2xl
              transition-all duration-300 ease-apple
              ${isActive
                                ? 'ring-2 ring-offset-2 ring-pastel-pink shadow-lg scale-[1.02]'
                                : 'bg-white/60 hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5'
                            }
            `}
                        style={{
                            background: isActive ? 'rgba(255,255,255,0.9)' : undefined
                        }}
                    >
                        {/* Theme Preview Swatch */}
                        <div
                            className="w-full h-16 rounded-xl mb-3 shadow-inner overflow-hidden relative"
                            style={{
                                background: theme.preview.bg,
                            }}
                        >
                            {/* Mini card preview */}
                            <div
                                className="absolute bottom-2 left-2 right-2 h-6 rounded-md shadow-sm"
                                style={{
                                    background: theme.preview.card,
                                    border: `1px solid ${theme.preview.accent}33`
                                }}
                            />

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md animate-pop-in">
                                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Theme Info */}
                        <div className="text-left">
                            <p className={`
                font-bold text-sm truncate
                ${isActive ? 'text-gray-800' : 'text-gray-700'}
              `}>
                                {theme.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {theme.description}
                            </p>
                        </div>

                        {/* Hover effect glow */}
                        <div
                            className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 pointer-events-none
              `}
                            style={{
                                background: `radial-gradient(circle at center, ${theme.preview.accent}15, transparent 70%)`
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StylePicker;
