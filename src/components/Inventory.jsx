import { useState, memo, useEffect } from 'react';

/**
 * Inventory Component - Shows collected badges and redeemable tickets
 * Slide-out drawer from the right side
 */

// Badge configurations for each milestone
const BADGE_CONFIG = {
    'milestone-7': { icon: '🌟', name: '7 Tage', color: 'from-yellow-400 to-amber-500' },
    'milestone-14': { icon: '💎', name: '14 Tage', color: 'from-cyan-400 to-blue-500' },
    'milestone-30': { icon: '🎖️', name: '30 Tage', color: 'from-green-400 to-emerald-500' },
    'milestone-50': { icon: '🏆', name: '50 Tage', color: 'from-orange-400 to-red-500' },
    'milestone-100': { icon: '👑', name: '100 Tage', color: 'from-purple-400 to-pink-500' },
};

const Inventory = memo(({ isOpen, onClose, badges = [], tickets = [], onUseTicket }) => {
    const [activeTab, setActiveTab] = useState('badges');

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`
                fixed right-0 top-0 bottom-0 w-80 max-w-[90vw]
                bg-white/95 backdrop-blur-xl shadow-2xl z-50
                transform transition-transform duration-300 ease-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        🎒 Inventar
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('badges')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'badges'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        🏅 Badges ({badges.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'tickets'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        🎟️ Gutscheine ({tickets.filter(t => !t.used).length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                    {activeTab === 'badges' ? (
                        <div className="space-y-3">
                            {badges.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-3 opacity-50">🏅</div>
                                    <p className="text-gray-500 text-sm">
                                        Noch keine Badges verdient.<br />
                                        Erreiche Streak-Meilensteine!
                                    </p>
                                </div>
                            ) : (
                                badges.map((badgeId) => {
                                    const config = BADGE_CONFIG[badgeId];
                                    if (!config) return null;
                                    return (
                                        <div
                                            key={badgeId}
                                            className={`
                                                flex items-center gap-3 p-4 rounded-xl
                                                bg-gradient-to-r ${config.color} bg-opacity-10
                                                border border-white/50 shadow-sm
                                            `}
                                        >
                                            <div className="text-3xl">{config.icon}</div>
                                            <div>
                                                <div className="font-bold text-gray-800">{config.name}</div>
                                                <div className="text-xs text-gray-600">Streak-Meilenstein</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-3 opacity-50">🎟️</div>
                                    <p className="text-gray-500 text-sm">
                                        Noch keine Gutscheine erhalten.<br />
                                        Erreiche 30+ Tage Streak!
                                    </p>
                                </div>
                            ) : (
                                tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className={`
                                            p-4 rounded-xl border-2 transition-all
                                            ${ticket.used
                                                ? 'bg-gray-100 border-gray-300 opacity-60'
                                                : 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-300 shadow-md'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-3xl">{ticket.icon}</div>
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-800">{ticket.name}</div>
                                                <div className="text-xs text-gray-600 mt-1">{ticket.description}</div>
                                                {ticket.used ? (
                                                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                                                        ✅ Eingelöst
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => onUseTicket(ticket.id)}
                                                        className="mt-2 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:opacity-90 transition-opacity"
                                                    >
                                                        Einlösen ✨
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});

Inventory.displayName = 'Inventory';
export default Inventory;
