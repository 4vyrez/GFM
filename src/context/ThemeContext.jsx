import { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions with metadata
export const themes = [
    {
        id: 'default',
        name: '✨ Cute Pastel',
        description: 'Dreamy pastels & glassmorphism',
        category: 'pretty',
        preview: {
            bg: 'linear-gradient(135deg, #FFE4E1, #E6E6FA, #AEC6CF)',
            accent: '#FFB7C5',
            card: 'rgba(255,255,255,0.8)'
        }
    },
    {
        id: 'professional',
        name: '💼 Corporate',
        description: 'Boring, safe, business-like',
        category: 'serious',
        preview: {
            bg: '#f5f5f5',
            accent: '#2563eb',
            card: '#ffffff'
        }
    },
    {
        id: 'windows-xp',
        name: '🪟 Windows XP',
        description: 'Classic Luna blue vibes',
        category: 'retro',
        preview: {
            bg: 'linear-gradient(to bottom, #245edc, #3a6ea5)',
            accent: '#3a6ea5',
            card: '#ece9d8'
        }
    },
    {
        id: 'apple',
        name: '🍎 Apple Modern',
        description: 'Ultra-clean minimalist',
        category: 'serious',
        preview: {
            bg: '#ffffff',
            accent: '#007AFF',
            card: '#f5f5f7'
        }
    },
    {
        id: 'fortnite',
        name: '🎮 Fortnite Mode',
        description: 'Victory royale gaming vibes',
        category: 'gaming',
        preview: {
            bg: 'linear-gradient(135deg, #1a0533, #2d1b4e)',
            accent: '#00ff88',
            card: 'rgba(45, 27, 78, 0.9)'
        }
    },
    {
        id: 'overkill',
        name: '🤯 Maximum Chaos',
        description: 'Rainbow spinning madness',
        category: 'chaos',
        preview: {
            bg: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
            accent: '#ff00ff',
            card: 'rgba(255,255,255,0.9)'
        }
    },
    {
        id: 'dark-pro',
        name: '🌙 Dark Mode Pro',
        description: 'Sleek dark with glow accents',
        category: 'serious',
        preview: {
            bg: '#0a0a0f',
            accent: '#a855f7',
            card: 'rgba(20, 20, 30, 0.95)'
        }
    },
    {
        id: 'light-clean',
        name: '☀️ Light & Clean',
        description: 'Minimal white zen mode',
        category: 'serious',
        preview: {
            bg: '#fafafa',
            accent: '#333333',
            card: '#ffffff'
        }
    },
    {
        id: 'geocities',
        name: '🌐 90s Geocities',
        description: 'Under construction vibes',
        category: 'retro',
        preview: {
            bg: '#000080',
            accent: '#ffff00',
            card: '#c0c0c0'
        }
    },
    {
        id: 'amazon',
        name: '📦 Shopping Clone',
        description: 'Prime delivery aesthetic',
        category: 'parody',
        preview: {
            bg: '#232f3e',
            accent: '#ff9900',
            card: '#ffffff'
        }
    },
    {
        id: 'dropship',
        name: '🚀 Dropshipping FOMO',
        description: 'ONLY 3 LEFT! ORDER NOW!',
        category: 'parody',
        preview: {
            bg: '#ffffff',
            accent: '#dc2626',
            card: '#fff7ed'
        }
    },
    {
        id: 'minecraft',
        name: '⛏️ Minecraft',
        description: 'Pixelated block aesthetic',
        category: 'gaming',
        preview: {
            bg: '#87CEEB',
            accent: '#5D8731',
            card: '#8B7355'
        }
    },
    {
        id: 'vaporwave',
        name: '🌴 Vaporwave',
        description: 'A E S T H E T I C',
        category: 'retro',
        preview: {
            bg: 'linear-gradient(135deg, #ff71ce, #01cdfe, #05ffa1)',
            accent: '#ff71ce',
            card: 'rgba(1, 205, 254, 0.3)'
        }
    },
    {
        id: 'terminal',
        name: '💚 Hacker Terminal',
        description: 'Access granted...',
        category: 'retro',
        preview: {
            bg: '#0d0d0d',
            accent: '#00ff00',
            card: 'rgba(0, 255, 0, 0.1)'
        }
    }
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('gfm-theme') || 'default';
        }
        return 'default';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('gfm-theme', currentTheme);

        // Add theme class for Tailwind-based theming
        document.body.className = document.body.className
            .replace(/theme-\w+/g, '')
            .trim();
        document.body.classList.add(`theme-${currentTheme}`);
    }, [currentTheme]);

    const setTheme = (themeId) => {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            setCurrentTheme(themeId);
        }
    };

    const getTheme = () => themes.find(t => t.id === currentTheme) || themes[0];

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            setTheme,
            getTheme,
            themes
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
