import { useState, useEffect } from 'react';

const FunArea = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 300);
    }, []);

    return (
        <div
            className={`card max-w-2xl mx-auto transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    🎮 Überraschung für heute!
                </h2>
                <p className="text-gray-600 text-sm">
                    Wenn du magst, kannst du das hier spielen. Musst du aber nicht 💕
                </p>
            </div>

            {/* Game Component */}
            <div className="mt-6 flex justify-center">
                {children}
            </div>
        </div>
    );
};

export default FunArea;
