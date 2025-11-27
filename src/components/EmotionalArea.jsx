import { useState, useEffect } from 'react';

const EmotionalArea = ({ photo, message }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Fade in animation on mount
        setTimeout(() => setIsVisible(true), 100);
        // Reset expansion when message changes
        setIsExpanded(false);
    }, [message]);

    const isLongText = message.text.length > 120;
    const displayedText = isExpanded || !isLongText ? message.text : message.text.slice(0, 120) + '...';

    return (
        <div
            className={`relative max-w-2xl mx-auto transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
        >
            {/* Glassmorphism Card */}
            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden border border-white/50 transition-all duration-500">

                {/* Image Banner */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
                    <img
                        src={`/photos/${photo.filename}`}
                        alt={photo.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                    {/* Optional: Photo Label/Date if available, or just a nice icon */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        📸 Erinnerung
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 sm:p-10 text-center">
                    <div className="mb-6">
                        <span className="text-4xl">🌸</span>
                    </div>

                    <div className={`relative transition-all duration-500 ${isExpanded ? 'mb-4' : ''}`}>
                        <p
                            className="text-2xl md:text-3xl font-serif text-gray-800 leading-relaxed italic transition-all duration-300"
                            onClick={() => isLongText && setIsExpanded(!isExpanded)}
                        >
                            "{displayedText}"
                        </p>

                        {isLongText && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-4 text-sm text-gray-500 hover:text-pastel-pink font-medium transition-colors focus:outline-none"
                            >
                                {isExpanded ? 'Weniger anzeigen' : 'Alles lesen ✨'}
                            </button>
                        )}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div className="h-1 w-16 bg-pastel-pink rounded-full opacity-50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmotionalArea;
