import { useState, useEffect, useRef } from 'react';
import { CameraIcon, SparkleIcon } from './icons/Icons';
import Card from './ui/Card';
import PhotoModal from './PhotoModal';
import PhotoFrameEffects from './PhotoFrameEffects';

const EmotionalArea = ({ photo, message }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [textRevealed, setTextRevealed] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const messageRef = useRef(null);

    useEffect(() => {
        // Staggered entrance animations
        const timer1 = setTimeout(() => setIsVisible(true), 100);
        const timer2 = setTimeout(() => setTextRevealed(true), 800);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    useEffect(() => {
        // Reset expansion when message changes
        setIsExpanded(false);
        setTextRevealed(false);
        setTimeout(() => setTextRevealed(true), 300);
    }, [message]);

    const isLongText = message.text.length > 120;
    const displayedText = isExpanded || !isLongText ? message.text : message.text.slice(0, 120) + '...';

    // Split text into words for reveal animation
    const words = displayedText.split(' ');

    return (
        <div
            className={`
                relative max-w-md mx-auto
                transform transition-all duration-1000 ease-apple
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
        >
            <Card
                className="overflow-hidden !p-0 group"
                variant="glass"
                hover
            >
                {/* Image Banner with Ken Burns - Clickable */}
                <div
                    className="relative h-72 sm:h-80 w-full overflow-hidden cursor-pointer"
                    onClick={() => setIsPhotoModalOpen(true)}
                >
                    {/* Placeholder shimmer while loading */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/30 to-pastel-lavender/30 animate-pulse" />
                    )}

                    <img
                        src={`/photos/${photo.filename}`}
                        alt={photo.alt}
                        onLoad={() => setImageLoaded(true)}
                        className={`
                            w-full h-full object-cover
                            transition-all duration-1000 ease-apple
                            ken-burns
                            ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                        `}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Animated border ring */}
                    <div className="absolute inset-0 border-4 border-white/20 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Click hint - appears on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                            🔍 Klicken für Vollbild
                        </div>
                    </div>

                    {/* Photo Label with glass effect */}
                    <div className={`
                        absolute bottom-4 right-4
                        bg-white/90 backdrop-blur-sm
                        px-4 py-1.5 rounded-xl
                        text-xs font-bold text-gray-700
                        shadow-md
                        flex items-center gap-2
                        border border-white/50
                        transform transition-all duration-300
                        ${imageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    `}>
                        <CameraIcon className="w-4 h-4" />
                        <span>Erinnerung</span>
                    </div>

                    {/* Floating sparkles decoration */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                        <SparkleIcon className="w-4 h-4" />
                    </div>

                    {/* Photo Frame Effects - Animated decorations */}
                    <PhotoFrameEffects isActive={imageLoaded} />
                </div>

                {/* Content Section */}
                <div className="p-8 sm:p-10 text-center bg-gradient-to-b from-white/80 to-white/95">
                    {/* Decorative sparkles - replaced flower animation */}
                    <div className={`
                        mb-6 flex justify-center items-center gap-2
                        transition-all duration-700 delay-300
                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                    `}>
                        <SparkleIcon className="w-5 h-5 animate-float text-yellow-400" />
                        <div className="text-3xl animate-heartbeat">💕</div>
                        <SparkleIcon className="w-5 h-5 animate-float-slow text-pink-400" />
                    </div>

                    {/* Message with optimized reveal animation */}
                    <div
                        ref={messageRef}
                        className={`relative transition-all duration-500 ${isExpanded ? 'mb-4' : ''}`}
                    >
                        <p
                            className="text-2xl md:text-3xl font-serif text-gray-800 leading-relaxed italic cursor-pointer"
                            onClick={() => isLongText && setIsExpanded(!isExpanded)}
                        >
                            "
                            {words.slice(0, 30).map((word, index) => (
                                <span
                                    key={index}
                                    style={{
                                        transitionDelay: textRevealed ? `${Math.min(index * 30, 300)}ms` : '0ms',
                                    }}
                                    className={`
                                        inline-block transition-opacity duration-300
                                        ${textRevealed ? 'opacity-100' : 'opacity-0'}
                                    `}
                                >
                                    {word}{index < words.length - 1 ? '\u00A0' : ''}
                                </span>
                            ))}
                            {words.length > 30 && (
                                <span className={`transition-opacity duration-300 ${textRevealed ? 'opacity-100' : 'opacity-0'}`}>
                                    {words.slice(30).join(' ')}
                                </span>
                            )}
                            "
                        </p>

                        {isLongText && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`
                                    mt-6 text-sm font-bold uppercase tracking-wide
                                    text-gray-400 hover:text-pastel-pink
                                    transition-all duration-300
                                    flex items-center justify-center gap-2 mx-auto
                                    group/btn
                                `}
                            >
                                <span>{isExpanded ? 'Weniger anzeigen' : 'Alles lesen'}</span>
                                <SparkleIcon className={`
                                    w-4 h-4 transition-transform duration-300
                                    ${isExpanded ? 'rotate-180' : 'group-hover/btn:rotate-12'}
                                `} />
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Photo Modal for fullscreen view */}
            <PhotoModal
                photo={photo}
                isOpen={isPhotoModalOpen}
                onClose={() => setIsPhotoModalOpen(false)}
            />
        </div>
    );
};

export default EmotionalArea;
