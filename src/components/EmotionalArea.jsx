import { useState, useEffect } from 'react';

const EmotionalArea = ({ photo, message }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fade in animation on mount
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <div
            className={`card max-w-2xl mx-auto transform transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
        >
            {/* Photo Section */}
            <div className="relative mb-6 rounded-xl overflow-hidden shadow-md">
                <img
                    src={`/photos/${photo.filename}`}
                    alt={photo.alt}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '400px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Message Section */}
            <div className="text-center">
                <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
                    {message.text}
                </p>
            </div>
        </div>
    );
};

export default EmotionalArea;
