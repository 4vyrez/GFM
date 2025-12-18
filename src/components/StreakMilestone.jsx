import { useState, useEffect, useMemo } from 'react';
import { FlameIcon, SparkleIcon } from './icons/Icons';
import { getData, saveData } from '../utils/storage';

const milestones = [
    {
        days: 7,
        emoji: '🌟',
        title: '1 Woche!',
        message: 'Eine ganze Woche zusammen! 💕',
        badgeId: 'milestone-7',
        badgeName: '7-Tage Champion',
        animation: 'sparkle'
    },
    {
        days: 14,
        emoji: '💎',
        title: '2 Wochen!',
        message: 'Du bist unglaublich! 🌸',
        badgeId: 'milestone-14',
        badgeName: '2-Wochen Diamant',
        animation: 'shine'
    },
    {
        days: 30,
        emoji: '🌱',
        title: '1 Monat!',
        message: 'Ein ganzer Monat! Du hast dir etwas verdient! 🎉',
        badgeId: 'milestone-30',
        badgeName: '30-Tage Held',
        animation: 'plant',
        ticket: {
            id: 'massage-voucher-30',
            name: 'Gratis Massage',
            icon: '💆',
            description: 'Ein Gutschein für eine entspannende Massage von deinem Schatz!'
        }
    },
    {
        days: 50,
        emoji: '🏆',
        title: '50 Tage!',
        message: 'Du bist eine Legende! 👸',
        badgeId: 'milestone-50',
        badgeName: 'Goldpokal',
        animation: 'trophy'
    },
    {
        days: 100,
        emoji: '👑',
        title: '100 TAGE!',
        message: 'LEGENDÄR! Du bist die Königin meines Herzens! 💕💕💕',
        badgeId: 'milestone-100',
        badgeName: 'Legendärer Status',
        animation: 'fireworks',
        ticket: {
            id: 'date-voucher-100',
            name: 'Gratis Date deiner Wahl',
            icon: '🎟️',
            description: 'Ein Date, ganz wie DU es dir wünschst! Alles ist möglich!'
        }
    },
];

// Growing Plant Animation Component for 30-day milestone
const PlantAnimation = () => {
    const [stage, setStage] = useState(0);
    const stages = ['🌱', '🌿', '🪴', '🌸', '🌺'];

    useEffect(() => {
        const interval = setInterval(() => {
            setStage(prev => {
                if (prev < stages.length - 1) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <div
                className="text-8xl transition-all duration-500 ease-spring"
                style={{ transform: `scale(${1 + stage * 0.15})` }}
            >
                {stages[stage]}
            </div>
            {/* Growing sparkles */}
            {[...Array(8)].map((_, i) => (
                <SparkleIcon
                    key={i}
                    className="absolute w-6 h-6 text-green-300 animate-pulse"
                    style={{
                        top: `${20 + Math.sin(i * 0.8) * 30}%`,
                        left: `${50 + Math.cos(i * 0.8) * 40}%`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: stage >= 2 ? 1 : 0,
                    }}
                />
            ))}
        </div>
    );
};

// Fireworks Animation Component for 100-day milestone
const FireworksAnimation = () => {
    const fireworks = useMemo(() => (
        [...Array(20)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 60 + 20,
            delay: Math.random() * 2,
            color: ['#FF6B9D', '#FFD700', '#4FC3F7', '#A855F7', '#FF7F7F', '#00FF88'][i % 6],
            size: 8 + Math.random() * 12,
        }))
    ), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {fireworks.map(fw => (
                <div
                    key={fw.id}
                    className="absolute rounded-full animate-firework"
                    style={{
                        left: `${fw.x}%`,
                        top: `${fw.y}%`,
                        width: fw.size,
                        height: fw.size,
                        backgroundColor: fw.color,
                        animationDelay: `${fw.delay}s`,
                        boxShadow: `0 0 ${fw.size}px ${fw.color}, 0 0 ${fw.size * 2}px ${fw.color}`,
                    }}
                />
            ))}
            {/* Crown emoji floating */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl animate-bounce-in">👑</div>
            </div>
        </div>
    );
};

// Ticket/Voucher Popup Component
const TicketPopup = ({ ticket, onCollect }) => (
    <div
        className="mt-6 bg-gradient-to-br from-pink-100 to-purple-100 p-6 rounded-2xl border-4 border-dashed border-pink-400 shadow-xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="text-5xl mb-2">{ticket.icon}</div>
        <h3 className="text-xl font-black text-gray-800 mb-1">{ticket.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
        <button
            onClick={onCollect}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
        >
            ✨ Jetzt einsammeln!
        </button>
    </div>
);

const StreakMilestone = ({ streak, isVisible, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentMilestone, setCurrentMilestone] = useState(null);
    const [ticketCollected, setTicketCollected] = useState(false);

    useEffect(() => {
        const milestone = milestones.find(m => m.days === streak);
        if (milestone && isVisible) {
            setCurrentMilestone(milestone);
            setIsAnimating(true);
            setTicketCollected(false);

            // Save badge to inventory
            const data = getData();
            if (!data.collectedBadges.includes(milestone.badgeId)) {
                const updatedData = {
                    ...data,
                    collectedBadges: [...data.collectedBadges, milestone.badgeId]
                };
                saveData(updatedData);
            }
        }
    }, [streak, isVisible]);

    const handleCollectTicket = () => {
        if (!currentMilestone?.ticket) return;

        const data = getData();
        const ticketExists = data.collectedTickets.some(t => t.id === currentMilestone.ticket.id);

        if (!ticketExists) {
            const updatedData = {
                ...data,
                collectedTickets: [
                    ...data.collectedTickets,
                    { ...currentMilestone.ticket, used: false }
                ]
            };
            saveData(updatedData);
        }

        setTicketCollected(true);
    };

    const handleClose = () => {
        // Only allow close if ticket is collected (if there is one)
        if (currentMilestone?.ticket && !ticketCollected) {
            return; // Must collect ticket first
        }
        onClose();
    };

    if (!isVisible || !currentMilestone) return null;

    const is30Day = streak === 30;
    const is100Day = streak === 100;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            onClick={handleClose}
        >
            {/* Backdrop */}
            <div className={`
                absolute inset-0 backdrop-blur-md
                transition-opacity duration-500
                ${isAnimating ? 'opacity-100' : 'opacity-0'}
                ${is100Day ? 'bg-black/70' : 'bg-black/50'}
            `} />

            {/* Special Animations */}
            {is100Day && <FireworksAnimation />}

            {/* Radial burst */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: is100Day
                        ? `radial-gradient(circle at center, rgba(147,51,234,0.4) 0%, transparent 60%)`
                        : is30Day
                            ? `radial-gradient(circle at center, rgba(34,197,94,0.3) 0%, transparent 50%)`
                            : `radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 50%)`
                }}
            />

            {/* Confetti (for non-firework milestones) */}
            {!is100Day && [...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 rounded-sm confetti-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        backgroundColor: ['#FF6B9D', '#FFD700', '#4FC3F7', '#A855F7', '#FF7F7F'][i % 5],
                        animationDelay: `${Math.random() * 0.5}s`,
                    }}
                />
            ))}

            {/* Content */}
            <div
                className={`
                    relative z-10 text-center max-w-sm px-4
                    transition-all duration-700 ease-spring
                    ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Special Animation or Emoji */}
                <div className="mb-4">
                    {is30Day ? (
                        <PlantAnimation />
                    ) : is100Day ? (
                        null // Crown is in FireworksAnimation
                    ) : (
                        <div className="text-8xl animate-bounce-in">
                            {currentMilestone.emoji}
                        </div>
                    )}
                </div>

                {/* Streak number with flame */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FlameIcon className="w-12 h-12" animated />
                    <span className={`font-black drop-shadow-lg ${is100Day ? 'text-7xl text-yellow-300' : 'text-6xl text-white'}`}>
                        {streak}
                    </span>
                    <FlameIcon className="w-12 h-12" animated />
                </div>

                {/* Title */}
                <h2 className={`font-black drop-shadow-lg mb-2 animate-slide-up ${is100Day ? 'text-5xl text-yellow-300' : 'text-4xl text-white'}`}>
                    {currentMilestone.title}
                </h2>

                {/* Message */}
                <p className="text-lg text-white/90 font-medium mb-4 animate-fade-in">
                    {currentMilestone.message}
                </p>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg animate-pop-in">
                    <SparkleIcon className="w-5 h-5" />
                    <span className="font-bold text-gray-800">
                        {currentMilestone.badgeName} freigeschaltet!
                    </span>
                    <SparkleIcon className="w-5 h-5" />
                </div>

                {/* Ticket/Voucher Popup for 30 and 100 days */}
                {currentMilestone.ticket && !ticketCollected && (
                    <TicketPopup
                        ticket={currentMilestone.ticket}
                        onCollect={handleCollectTicket}
                    />
                )}

                {/* Ticket Collected Confirmation */}
                {currentMilestone.ticket && ticketCollected && (
                    <div className="mt-6 text-white font-bold animate-pop-in">
                        ✅ Gutschein im Inventar gespeichert!
                    </div>
                )}

                {/* Tap to close */}
                <p className="text-white/60 text-sm mt-6 animate-fade-in">
                    {currentMilestone.ticket && !ticketCollected
                        ? 'Sammle zuerst deinen Gutschein!'
                        : 'Tippe zum Schließen'}
                </p>
            </div>
        </div>
    );
};

export { milestones };
export default StreakMilestone;
