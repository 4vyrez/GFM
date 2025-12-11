// Premium Duolingo-inspired icons with gradients and animations

export const FlameIcon = ({ className = "w-6 h-6", animated = false }) => (
    <svg viewBox="0 0 100 100" className={`${className} ${animated ? 'animate-flame-flicker' : ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            {/* Enhanced gradient with more vibrant colors */}
            <linearGradient id="premiumFlameGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF59D" /> {/* Light Yellow */}
                <stop offset="20%" stopColor="#FFEB3B" /> {/* Bright Yellow */}
                <stop offset="45%" stopColor="#FFC107" /> {/* Amber */}
                <stop offset="70%" stopColor="#FF9800" /> {/* Orange */}
                <stop offset="100%" stopColor="#FF5722" /> {/* Deep Orange */}
            </linearGradient>
            {/* Glow filter */}
            <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Outer glow */}
        <path
            d="M50 5 
               C55 20, 75 35, 78 55 
               C80 70, 70 90, 50 95 
               C30 90, 20 70, 22 55 
               C25 35, 45 20, 50 5 Z"
            fill="url(#premiumFlameGradient)"
            filter="url(#flameGlow)"
            opacity="0.5"
        />

        {/* Main Flame */}
        <path
            d="M50 5 
               C55 20, 75 35, 78 55 
               C80 70, 70 90, 50 95 
               C30 90, 20 70, 22 55 
               C25 35, 45 20, 50 5 Z"
            fill="url(#premiumFlameGradient)"
        />

        {/* Left flame lick */}
        <path
            d="M35 25 C30 35, 25 45, 28 55 C25 45, 30 30, 35 25 Z"
            fill="#FFD54F"
            opacity="0.8"
        />

        {/* Right flame lick */}
        <path
            d="M65 25 C70 35, 75 45, 72 55 C75 45, 70 30, 65 25 Z"
            fill="#FFD54F"
            opacity="0.8"
        />

        {/* Inner bright core */}
        <ellipse cx="50" cy="60" rx="10" ry="20" fill="#FFEB3B" opacity="0.5" />
        <ellipse cx="50" cy="65" rx="6" ry="12" fill="#FFF9C4" opacity="0.7" />
    </svg>
);

export const StreakFreezeIcon = ({ className = "w-6 h-6", used = false }) => (
    <svg viewBox="0 0 100 100" className={`${className} ${!used ? 'animate-pulse-glow' : ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="premiumFreezeGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#81D4FA" />
                <stop offset="30%" stopColor="#4FC3F7" />
                <stop offset="60%" stopColor="#29B6F6" />
                <stop offset="100%" stopColor="#0288D1" />
            </linearGradient>
            <filter id="crystalGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <g className={used ? 'opacity-30 grayscale' : ''} filter={!used ? "url(#crystalGlow)" : undefined}>
            {/* Gem shape - hexagonal crystal */}
            <path
                d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                fill="url(#premiumFreezeGradient)"
            />

            {/* Top facet highlight */}
            <path d="M50 10 L85 30 L50 45 L15 30 Z" fill="#E1F5FE" opacity="0.7" />

            {/* Left facet */}
            <path d="M15 30 L50 45 L50 90 L15 70 Z" fill="#4FC3F7" opacity="0.5" />

            {/* Sparkles */}
            <circle cx="32" cy="32" r="5" fill="white" opacity="0.95" />
            <circle cx="40" cy="28" r="2" fill="white" opacity="0.7" />
            <circle cx="62" cy="48" r="3" fill="white" opacity="0.6" />
            <circle cx="55" cy="35" r="2" fill="white" opacity="0.5" />
        </g>
    </svg>
);

export const InfoIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 16V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    </svg>
);

export const StarIcon = ({ className = "w-6 h-6", filled = true }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="starGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA000" />
            </linearGradient>
        </defs>
        <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={filled ? "url(#starGradient)" : "none"}
            stroke="#FFA000"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
    </svg>
);

export const HeartIcon = ({ className = "w-6 h-6", animated = false }) => (
    <svg viewBox="0 0 24 24" className={`${className} ${animated ? 'animate-heartbeat' : ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="heartGradient" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF9ECD" />
                <stop offset="50%" stopColor="#FF69B4" />
                <stop offset="100%" stopColor="#FF1493" />
            </linearGradient>
        </defs>
        <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGradient)"
        />
    </svg>
);

export const CameraIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            fill="#F5F5F5"
            stroke="#9E9E9E"
            strokeWidth="1.5"
        />
        <circle cx="12" cy="13" r="4" stroke="#9E9E9E" strokeWidth="1.5" fill="white" />
        <circle cx="12" cy="13" r="2" fill="#BDBDBD" />
    </svg>
);

export const FlowerIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="petalGradient" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFD6E0" />
                <stop offset="100%" stopColor="#FFB7C5" />
            </linearGradient>
        </defs>
        {/* Petals */}
        <circle cx="12" cy="6" r="4" fill="url(#petalGradient)" />
        <circle cx="6" cy="10" r="4" fill="url(#petalGradient)" />
        <circle cx="18" cy="10" r="4" fill="url(#petalGradient)" />
        <circle cx="8" cy="16" r="4" fill="url(#petalGradient)" />
        <circle cx="16" cy="16" r="4" fill="url(#petalGradient)" />
        {/* Center */}
        <circle cx="12" cy="11" r="3.5" fill="#FFD700" />
        <circle cx="12" cy="11" r="2" fill="#FFA000" opacity="0.5" />
    </svg>
);

export const SparkleIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" className={`${className} animate-pulse-glow`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="sparkleGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="50%" stopColor="#FFF176" />
                <stop offset="100%" stopColor="#FBC02D" />
            </linearGradient>
        </defs>
        <path
            d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
            fill="url(#sparkleGradient)"
            stroke="#FBC02D"
            strokeWidth="0.5"
        />
    </svg>
);

export const GameControllerIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="controllerGradient" x1="2" y1="6" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E1BEE7" />
                <stop offset="100%" stopColor="#CE93D8" />
            </linearGradient>
        </defs>
        <rect x="2" y="6" width="20" height="12" rx="3" fill="url(#controllerGradient)" stroke="#8E24AA" strokeWidth="1.5" />
        <path d="M6 12H10M8 10V14" stroke="#8E24AA" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="12" r="1.5" fill="#8E24AA" />
        <circle cx="18" cy="10" r="1.5" fill="#8E24AA" />
    </svg>
);

// New premium icons
export const TrophyIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="trophyGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE57F" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA000" />
            </linearGradient>
        </defs>
        <path d="M8 21h8M12 17v4M17 4H7l1 9c.4 2.8 2.4 4 4 4s3.6-1.2 4-4l1-9z" stroke="url(#trophyGradient)" strokeWidth="2" fill="url(#trophyGradient)" fillOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 4H5a2 2 0 00-2 2v1a3 3 0 003 3M17 4h2a2 2 0 012 2v1a3 3 0 01-3 3" stroke="url(#trophyGradient)" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const ConfettiIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="2" fill="#FF6B9D" />
        <circle cx="20" cy="4" r="2" fill="#6366F1" />
        <circle cx="12" cy="2" r="1.5" fill="#FFD700" />
        <rect x="2" y="10" width="3" height="3" rx="0.5" fill="#4FC3F7" transform="rotate(15 2 10)" />
        <rect x="19" y="12" width="3" height="3" rx="0.5" fill="#A855F7" transform="rotate(-20 19 12)" />
        <path d="M12 8l2 14" stroke="#FF6B9D" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 6l-2 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 6l2 12" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
