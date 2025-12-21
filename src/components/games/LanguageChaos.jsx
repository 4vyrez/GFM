import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * LanguageChaos Game - Japanese Game Settings Meme
 * Navigate through confusing emoji-only menus to find language settings
 * No text hints at all - pure emoji puzzle navigation
 */
const LanguageChaos = ({ onWin }) => {
    const [currentMenu, setCurrentMenu] = useState('main');
    const [menuHistory, setMenuHistory] = useState([]);
    const [found, setFound] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [wrongClicks, setWrongClicks] = useState(0);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    // Menu structure - completely emoji based, no text at all
    const menus = {
        main: {
            title: '⚙️',
            subtitle: '🎮',
            items: [
                { icon: '🔊', action: 'audio' },
                { icon: '🎮', action: 'controls' },
                { icon: '📺', action: 'display' },
                { icon: '💾', action: 'save' },
                { icon: '🔧', action: 'advanced' },
                { icon: '❓', action: 'help' },
            ]
        },
        audio: {
            title: '🔊',
            subtitle: '🎵',
            items: [
                { icon: '🎵', action: 'dead' },
                { icon: '🔈', action: 'dead' },
                { icon: '🎧', action: 'dead' },
                { icon: '🔔', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        controls: {
            title: '🎮',
            subtitle: '🕹️',
            items: [
                { icon: '🕹️', action: 'dead' },
                { icon: '⌨️', action: 'dead' },
                { icon: '🖱️', action: 'dead' },
                { icon: '📱', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        display: {
            title: '📺',
            subtitle: '🖥️',
            items: [
                { icon: '🖥️', action: 'dead' },
                { icon: '🌙', action: 'dead' },
                { icon: '☀️', action: 'dead' },
                { icon: '🔲', action: 'accessibility' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        accessibility: {
            title: '🔲',
            subtitle: '👁️',
            items: [
                { icon: '👁️', action: 'dead' },
                { icon: '🔤', action: 'dead' },
                { icon: '🌐', action: 'language' }, // Hidden here!
                { icon: '🎨', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        save: {
            title: '💾',
            subtitle: '📁',
            items: [
                { icon: '📁', action: 'dead' },
                { icon: '🗑️', action: 'dead' },
                { icon: '☁️', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        advanced: {
            title: '🔧',
            subtitle: '⚡',
            items: [
                { icon: '⚡', action: 'dead' },
                { icon: '🔋', action: 'dead' },
                { icon: '📊', action: 'system' },
                { icon: '🔒', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        system: {
            title: '📊',
            subtitle: '💻',
            items: [
                { icon: '💻', action: 'dead' },
                { icon: '🔄', action: 'dead' },
                { icon: '📋', action: 'dead' },
                { icon: '🗂️', action: 'region' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        region: {
            title: '🗂️',
            subtitle: '🗺️',
            items: [
                { icon: '🗺️', action: 'dead' },
                { icon: '⏰', action: 'dead' },
                { icon: '🌐', action: 'language' }, // Also hidden here!
                { icon: '📅', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        help: {
            title: '❓',
            subtitle: '📖',
            items: [
                { icon: '📖', action: 'dead' },
                { icon: '💭', action: 'dead' },
                { icon: '📧', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
        language: {
            title: '🌐',
            subtitle: '🗣️',
            items: [
                { icon: '🇯🇵', action: 'dead' },
                { icon: '🇩🇪', action: 'found' }, // GOAL!
                { icon: '🇬🇧', action: 'dead' },
                { icon: '🇫🇷', action: 'dead' },
                { icon: '🇪🇸', action: 'dead' },
                { icon: '⬅️', action: 'back' },
            ]
        },
    };

    const handleItemClick = (action) => {
        setAttempts(prev => prev + 1);

        if (action === 'found') {
            setFound(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'language-chaos-1',
                        metric: 'attempts',
                        value: attempts + 1,
                    });
                }
            }, 2000);
            return;
        }

        if (action === 'back') {
            if (menuHistory.length > 0) {
                const newHistory = [...menuHistory];
                const previousMenu = newHistory.pop();
                setMenuHistory(newHistory);
                setCurrentMenu(previousMenu);
            }
            return;
        }

        if (action === 'dead') {
            setWrongClicks(prev => prev + 1);
            return;
        }

        // Navigate to submenu
        if (menus[action]) {
            setMenuHistory([...menuHistory, currentMenu]);
            setCurrentMenu(action);
        }
    };

    const currentMenuData = menus[currentMenu];

    if (found) {
        return (
            <div
                className={`
                    flex flex-col items-center w-full py-8
                    transform transition-all duration-700 ease-apple
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
            >
                <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                    🇩🇪 Deutsch aktiviert!
                </h3>
                <p className="text-gray-500 mb-4">Du hast durch das Menü-Labyrinth gefunden!</p>
                <div className="flex items-center gap-2 text-green-500">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="font-bold">Japanese Game Experience ✓</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-400 mt-4">
                    Klicks: {attempts} | Tiefe: {menuHistory.length + 1} Ebenen
                </p>
            </div>
        );
    }

    return (
        <div
            className={`
                flex flex-col items-center w-full
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {/* Header - Pure emoji title bar */}
            <div className="w-full max-w-sm mb-4">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{currentMenuData.title}</span>
                        <span className="text-lg opacity-60">{currentMenuData.subtitle}</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>

                {/* Breadcrumb - emoji only */}
                <div className="bg-gray-700 px-3 py-1.5 flex items-center gap-1 text-sm overflow-x-auto">
                    {menuHistory.map((menu, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-gray-400">
                            <span>{menus[menu].title}</span>
                            <span>›</span>
                        </span>
                    ))}
                    <span className="text-white">{currentMenuData.title}</span>
                </div>

                {/* Menu Grid */}
                <div className="bg-gray-900 p-3 rounded-b-xl">
                    <div className="grid grid-cols-3 gap-2">
                        {currentMenuData.items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleItemClick(item.action)}
                                className={`
                                    aspect-square rounded-lg
                                    flex items-center justify-center
                                    text-3xl transition-all duration-200
                                    ${item.action === 'back'
                                        ? 'bg-gray-700 hover:bg-gray-600 col-span-3 aspect-auto py-2'
                                        : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                                    }
                                    hover:scale-105 active:scale-95
                                `}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status - minimal */}
            <div className="flex gap-4 text-xs text-gray-400">
                <span>📍 {menuHistory.length + 1}</span>
                <span>👆 {attempts}</span>
                {wrongClicks > 0 && <span className="text-red-400">❌ {wrongClicks}</span>}
            </div>

            {/* Subtle hint after many wrong clicks */}
            {wrongClicks >= 8 && (
                <p className="text-xs text-gray-500 mt-3 animate-fade-in">
                    💡 🌐 = ...?
                </p>
            )}
        </div>
    );
};

export default LanguageChaos;
