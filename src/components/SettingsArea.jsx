import { useState, useEffect, useMemo } from 'react';
import { useTheme, themes } from '../context/ThemeContext';

// Theme categories for organization
const CATEGORIES = [
    { id: 'all', label: 'Alle', icon: '✨' },
    { id: 'pretty', label: 'Hübsch', icon: '💕' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'retro', label: 'Retro', icon: '📺' },
    { id: 'parody', label: 'Parodie', icon: '🎭' },
    { id: 'serious', label: 'Seriös', icon: '💼' },
    { id: 'chaos', label: 'Wild', icon: '🤯' },
];

// Mini UI Preview - Shows a tiny mockup of the app with the theme applied
const MiniUIPreview = ({ theme, isActive }) => {
    const themeStyles = useMemo(() => {
        const styles = {
            'default': {
                bg: 'linear-gradient(135deg, #ffe4e1, #e6e6fa, #aec6cf)',
                card: 'rgba(255,255,255,0.85)',
                cardBorder: 'rgba(255,255,255,0.6)',
                accent: '#FFB7C5',
                text: '#1f2937',
                streakBg: 'linear-gradient(135deg, #fff5f5, #fff0f5)',
                buttonBg: 'linear-gradient(135deg, #FFB7C5, #FF7F7F)',
            },
            'professional': {
                bg: '#f8f9fa',
                card: '#ffffff',
                cardBorder: '#dee2e6',
                accent: '#0d6efd',
                text: '#212529',
                streakBg: '#ffffff',
                buttonBg: '#0d6efd',
            },
            'windows-xp': {
                bg: 'linear-gradient(180deg, #235cdb, #3168d9)',
                card: '#ece9d8',
                cardBorder: '#0054e3',
                accent: '#0054e3',
                text: '#000000',
                streakBg: '#ece9d8',
                buttonBg: 'linear-gradient(180deg, #fff, #ece9d8)',
                titleBar: true,
            },
            'apple': {
                bg: '#f5f5f7',
                card: '#ffffff',
                cardBorder: 'transparent',
                accent: '#0071e3',
                text: '#1d1d1f',
                streakBg: '#ffffff',
                buttonBg: '#0071e3',
            },
            'fortnite': {
                bg: 'linear-gradient(135deg, #1b0a3c, #2d1557)',
                card: 'rgba(43, 17, 87, 0.95)',
                cardBorder: '#00f593',
                accent: '#00f593',
                text: '#ffffff',
                streakBg: 'rgba(43, 17, 87, 0.95)',
                buttonBg: 'linear-gradient(90deg, #00f593, #00d9ff)',
                glow: true,
            },
            'overkill': {
                bg: 'linear-gradient(-45deg, #ff006e, #fb5607, #ffbe0b, #8338ec)',
                card: 'rgba(255,255,255,0.95)',
                cardBorder: '#ff006e',
                accent: '#ff006e',
                text: '#000000',
                streakBg: '#ffffff',
                buttonBg: 'linear-gradient(90deg, #ff006e, #fb5607)',
                dashed: true,
            },
            'dark-pro': {
                bg: 'linear-gradient(135deg, #0f0f1a, #1a1a2e)',
                card: 'rgba(25, 25, 40, 0.9)',
                cardBorder: 'rgba(139, 92, 246, 0.3)',
                accent: '#8b5cf6',
                text: '#f0f0f0',
                streakBg: 'rgba(25, 25, 40, 0.9)',
                buttonBg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                glow: true,
            },
            'light-clean': {
                bg: '#ffffff',
                card: '#fafafa',
                cardBorder: '#f0f0f0',
                accent: '#111111',
                text: '#111111',
                streakBg: '#fafafa',
                buttonBg: '#111111',
            },
            'geocities': {
                bg: '#000080',
                card: '#c0c0c0',
                cardBorder: '#808080',
                accent: '#ff00ff',
                text: '#000000',
                streakBg: '#c0c0c0',
                buttonBg: '#c0c0c0',
                retro: true,
            },
            'amazon': {
                bg: '#eaeded',
                card: '#ffffff',
                cardBorder: '#d5d9d9',
                accent: '#ff9900',
                text: '#0f1111',
                streakBg: '#ffffff',
                buttonBg: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
            },
            'dropship': {
                bg: '#ffffff',
                card: '#ffffff',
                cardBorder: '#e53935',
                accent: '#e53935',
                text: '#1a1a1a',
                streakBg: '#fff7ed',
                buttonBg: '#e53935',
                urgency: true,
            },
            'minecraft': {
                bg: '#78b1de',
                card: '#8b7355',
                cardBorder: '#5e4935',
                accent: '#5c8a2f',
                text: '#3f3f3f',
                streakBg: '#8b7355',
                buttonBg: 'linear-gradient(180deg, #ababab, #6b6b6b)',
                pixelated: true,
            },
            'vaporwave': {
                bg: 'linear-gradient(180deg, #ff6ad5, #ad8cff, #94d0ff)',
                card: 'rgba(255, 100, 200, 0.2)',
                cardBorder: 'rgba(0, 255, 255, 0.6)',
                accent: '#00ffff',
                text: '#ffffff',
                streakBg: 'rgba(255, 100, 200, 0.2)',
                buttonBg: 'linear-gradient(90deg, #ff6ad5, #00ffff)',
                aesthetic: true,
            },
            'terminal': {
                bg: '#0a0a0a',
                card: 'rgba(0, 20, 0, 0.9)',
                cardBorder: '#00ff00',
                accent: '#00ff00',
                text: '#00ff00',
                streakBg: 'rgba(0, 20, 0, 0.9)',
                buttonBg: 'transparent',
                terminal: true,
            },
        };
        return styles[theme.id] || styles['default'];
    }, [theme.id]);

    const borderRadius = themeStyles.pixelated ? '0' : themeStyles.retro ? '0' : '8px';

    return (
        <div
            className="w-full aspect-[3/4] rounded-xl overflow-hidden relative"
            style={{
                background: themeStyles.bg,
                fontFamily: themeStyles.terminal ? 'monospace' : themeStyles.pixelated ? 'monospace' : 'inherit',
            }}
        >
            {/* Mini Header */}
            <div className="p-2 text-center">
                <div
                    className="text-[8px] font-bold truncate"
                    style={{ color: themeStyles.text }}
                >
                    Guten Tag 💕
                </div>
            </div>

            {/* Mini Streak Card */}
            <div
                className="mx-2 p-2 mb-2"
                style={{
                    background: themeStyles.streakBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius,
                    boxShadow: themeStyles.glow ? `0 0 8px ${themeStyles.accent}40` : 'none',
                }}
            >
                <div className="flex items-center justify-center gap-1">
                    <span className="text-[10px]">🔥</span>
                    <span
                        className="text-[10px] font-bold"
                        style={{ color: themeStyles.text }}
                    >
                        7
                    </span>
                </div>
            </div>

            {/* Mini Content Card */}
            <div
                className="mx-2 p-2"
                style={{
                    background: themeStyles.card,
                    border: themeStyles.dashed
                        ? `2px dashed ${themeStyles.cardBorder}`
                        : `1px solid ${themeStyles.cardBorder}`,
                    borderRadius,
                    boxShadow: themeStyles.glow ? `0 0 8px ${themeStyles.accent}40` : 'none',
                }}
            >
                {/* Mini Photo placeholder */}
                <div
                    className="w-full aspect-video mb-2 flex items-center justify-center"
                    style={{
                        background: themeStyles.accent + '20',
                        borderRadius: borderRadius === '0' ? '0' : '4px',
                    }}
                >
                    <span className="text-[12px]">📸</span>
                </div>

                {/* Mini Button */}
                <div
                    className="w-full py-1 text-center text-[6px] font-bold"
                    style={{
                        background: themeStyles.buttonBg,
                        borderRadius: borderRadius === '0' ? '0' : '4px',
                        color: themeStyles.buttonBg.includes('gradient') || themeStyles.terminal ? (themeStyles.terminal ? '#00ff00' : '#fff') : '#fff',
                        border: themeStyles.terminal ? `1px solid ${themeStyles.accent}` : 'none',
                    }}
                >
                    Weiter
                </div>
            </div>

            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] shadow-lg">
                    ✓
                </div>
            )}

            {/* Theme-specific decorations */}
            {themeStyles.urgency && (
                <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[6px] text-center py-0.5 font-bold">
                    🔥 87% OFF!
                </div>
            )}
            {themeStyles.titleBar && (
                <div
                    className="absolute top-0 left-0 right-0 h-3 flex items-center px-1"
                    style={{ background: 'linear-gradient(180deg, #0a246a, #0e49c5)' }}
                >
                    <span className="text-[6px] text-white font-bold">🗔 GFM</span>
                </div>
            )}
        </div>
    );
};

// Theme Card with interactive preview
const ThemeCard = ({ theme, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={() => onClick(theme.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative group w-full text-left
                bg-white/60 backdrop-blur-sm
                border border-white/40
                transition-all duration-300 ease-out overflow-hidden
                ${isActive
                    ? 'ring-2 ring-pastel-pink ring-offset-2 shadow-lg scale-[1.02]'
                    : 'hover:shadow-md hover:-translate-y-1'
                }
            `}
            style={{ borderRadius: '16px' }}
        >
            {/* Preview Container */}
            <div className="p-3">
                <div
                    className={`
                        transition-transform duration-300
                        ${isHovered && !isActive ? 'scale-[1.02]' : 'scale-100'}
                    `}
                >
                    <MiniUIPreview theme={theme} isActive={isActive} />
                </div>
            </div>

            {/* Theme Info */}
            <div className="px-3 pb-3">
                <p className="font-bold text-sm text-gray-800 truncate mb-0.5">
                    {theme.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {theme.description}
                </p>
            </div>

            {/* Hover glow effect */}
            <div
                className={`
                    absolute inset-0 pointer-events-none transition-opacity duration-300
                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    background: `radial-gradient(circle at center, ${theme.preview?.accent || '#FFB7C5'}15, transparent 70%)`,
                    borderRadius: 'inherit',
                }}
            />
        </button>
    );
};

// Main Settings Area Component
const SettingsArea = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const { currentTheme, setTheme, getTheme } = useTheme();
    const activeTheme = getTheme();

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    // Filter themes by category
    const filteredThemes = useMemo(() => {
        if (activeCategory === 'all') return themes;
        return themes.filter(theme => theme.category === activeCategory);
    }, [activeCategory]);

    // Get taglines for current theme
    const themeVibes = {
        'default': '✨ Die Original-Vibes, voller Liebe gemacht',
        'professional': '📈 Perfekt wenn der Chef reinkommt',
        'windows-xp': '🪟 Nostalgie pur - Bliss Wallpaper Feelings',
        'apple': '🍎 So clean dass man vom Screen essen könnte',
        'fortnite': '🎮 WHERE WE DROPPIN? TILTED TOWERS!',
        'overkill': '🤯 Wir haben nicht gefragt ob wir sollten...',
        'dark-pro': '🌙 Für die Nachteulen unter uns',
        'light-clean': '☯️ Marie Kondo wäre stolz',
        'geocities': '🚧 UNDER CONSTRUCTION seit 1997',
        'amazon': '📦 Gratis Lieferung für deine Emotionen',
        'dropship': '🚀 NUR NOCH 3 SEKUNDEN ZU LEBEN!!!',
        'minecraft': '⛏️ Das ist ne schöne App... wär schade wenn...',
        'vaporwave': '🌴 Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ',
        'terminal': '💚 I\'m in. *hacker voice*',
    };

    return (
        <div
            className={`
                transform transition-all duration-500 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
        >
            <div className="max-w-lg mx-auto">
                {/* Hero Header */}
                <div className="glass-card p-6 mb-6 relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-pastel-lavender/40 to-pastel-pink/40 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-pastel-blue/30 to-pastel-mint/30 rounded-full blur-2xl" />

                    <div className="relative z-10">
                        {/* Title */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className="text-5xl animate-float">🎨</div>
                            <div>
                                <h2 className="text-2xl font-black text-gradient">Style Lab</h2>
                                <p className="text-gray-500 text-sm">Dein Vibe, deine Regeln</p>
                            </div>
                        </div>

                        {/* Current Theme Display */}
                        <div className="bg-white/60 backdrop-blur-xs rounded-2xl p-4 border border-white/40">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-white/50">
                                    <MiniUIPreview theme={activeTheme} isActive={false} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Aktueller Style</p>
                                    <p className="font-bold text-gray-800 truncate">{activeTheme.name}</p>
                                    <p className="text-xs text-gray-500 italic truncate mt-0.5">
                                        {themeVibes[currentTheme]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-2 min-w-max px-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium
                                    transition-all duration-200 whitespace-nowrap
                                    ${activeCategory === cat.id
                                        ? 'bg-white shadow-md text-gray-800'
                                        : 'bg-white/40 text-gray-600 hover:bg-white/60'
                                    }
                                `}
                            >
                                <span className="mr-1">{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Count */}
                <div className="text-center mb-4">
                    <span className="text-xs text-gray-500">
                        {filteredThemes.length} {filteredThemes.length === 1 ? 'Theme' : 'Themes'}
                        {activeCategory !== 'all' && ` in "${CATEGORIES.find(c => c.id === activeCategory)?.label}"`}
                    </span>
                </div>

                {/* Theme Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {filteredThemes.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            theme={theme}
                            isActive={currentTheme === theme.id}
                            onClick={setTheme}
                        />
                    ))}
                </div>

                {/* Fun Footer */}
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">{themes.length}</span> Themes •
                        <span className="font-bold"> 1100+</span> Zeilen CSS •
                        <span className="font-bold"> ∞</span> Möglichkeiten
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Made with 💕 und viel zu viel Kaffee
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsArea;
