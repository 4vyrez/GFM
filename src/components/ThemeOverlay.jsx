import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

// ============================================
// MINECRAFT THEME HUD
// Hearts, hunger, XP bar - FIXED positioning
// ============================================
const MinecraftHUD = () => {
    const [health] = useState(17); // Out of 20
    const [hunger] = useState(20);
    const [xp, setXP] = useState(67);
    const [level, setLevel] = useState(27);

    // Animate XP slowly increasing - FIXED: removed xp from dependency array
    useEffect(() => {
        const interval = setInterval(() => {
            setXP(prev => {
                if (prev >= 100) {
                    setLevel(l => l + 1);
                    return 0;
                }
                return prev + 1;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Top HUD - Health and Hunger - FIXED: moved down to not overlap header */}
            <div className="fixed top-36 left-1/2 -translate-x-1/2 z-40 flex gap-4 pointer-events-none select-none">
                {/* Health Hearts */}
                <div className="flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="text-sm" style={{
                            filter: i * 2 < health ? 'none' : 'grayscale(1) opacity(0.4)',
                            textShadow: '1px 1px 0 #000'
                        }}>
                            {i * 2 + 2 <= health ? '❤️' : i * 2 + 1 === health ? '💔' : '🖤'}
                        </div>
                    ))}
                </div>
                {/* Hunger */}
                <div className="flex gap-0.5 flex-row-reverse">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="text-sm" style={{
                            filter: i * 2 < hunger ? 'none' : 'grayscale(1) opacity(0.4)',
                            textShadow: '1px 1px 0 #000'
                        }}>
                            🍖
                        </div>
                    ))}
                </div>
            </div>

            {/* XP Bar - FIXED: adjusted bottom position */}
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none">
                <div className="relative">
                    {/* Level indicator */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-base font-bold text-[#7fff00]"
                        style={{ fontFamily: 'VT323, monospace', textShadow: '1px 1px 0 #000' }}>
                        {level}
                    </div>
                    {/* XP bar */}
                    <div className="w-48 h-2 bg-black/60 border border-[#555] rounded-none overflow-hidden">
                        <div
                            className="h-full bg-[#7fff00] transition-all duration-300"
                            style={{ width: `${xp}%`, boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.3)' }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

// ============================================
// FORTNITE THEME HUD - FIXED: z-index and sizing
// ============================================
const FortniteHUD = () => {
    const [vbucks] = useState(2450);
    const [stormTime, setStormTime] = useState(47);
    const [materials] = useState({ wood: 287, brick: 134, metal: 89 });

    useEffect(() => {
        const interval = setInterval(() => {
            setStormTime(t => t > 0 ? t - 1 : 60);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* V-Bucks Counter - FIXED: positioned to not overlap content */}
            <div className="fixed top-36 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-purple-900/80 to-blue-900/80 px-3 py-1.5 rounded-lg border border-cyan-400/40 shadow-md pointer-events-none select-none">
                <div className="text-lg">💎</div>
                <span className="text-base font-bold text-white" style={{ fontFamily: 'Trebuchet MS' }}>
                    {vbucks.toLocaleString()}
                </span>
            </div>

            {/* Materials - FIXED: smaller, better positioning */}
            <div className="fixed bottom-32 right-4 z-40 flex flex-col gap-0.5 pointer-events-none select-none">
                {[
                    { icon: '🪵', count: materials.wood, color: '#c4a76c' },
                    { icon: '🧱', count: materials.brick, color: '#cd7f32' },
                    { icon: '⚙️', count: materials.metal, color: '#a8a8a8' },
                ].map((mat, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-xs" style={{ borderLeft: `2px solid ${mat.color}` }}>
                        <span className="text-sm">{mat.icon}</span>
                        <span className="text-white font-bold">{mat.count}</span>
                    </div>
                ))}
            </div>

            {/* Storm Warning - FIXED: only shows when active, proper positioning */}
            {stormTime <= 20 && (
                <div className="fixed top-36 left-1/2 -translate-x-1/2 z-40 animate-pulse pointer-events-none select-none">
                    <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-4 py-1.5 rounded-lg border border-white/20 shadow-md">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🌀</span>
                            <div>
                                <p className="text-[10px] text-white/70 uppercase tracking-wide">Storm</p>
                                <p className="text-base font-bold text-white">{stormTime}s</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mini Map - FIXED: smaller, better z-index */}
            <div className="fixed top-36 left-4 z-40 w-16 h-16 rounded-lg overflow-hidden border border-cyan-400/40 pointer-events-none select-none"
                style={{ background: 'linear-gradient(135deg, #2d1557, #1b0a3c)' }}>
                <div className="w-full h-full flex items-center justify-center text-xl opacity-50">
                    🗺️
                </div>
                {/* Player dot */}
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
        </>
    );
};

// ============================================
// TERMINAL THEME HUD - FIXED: better styling
// ============================================
const TerminalHUD = () => {
    const [messages, setMessages] = useState([]);
    const messageQueue = [
        '> Establishing secure connection...',
        '> ACCESS GRANTED',
        '> Loading user profile...',
        '> Decrypting streak data...',
        '> Bypassing firewall... SUCCESS',
        '> Injecting love.exe...',
        '> System compromised with affection',
        '> root@heart:~# love --maximum',
    ];

    useEffect(() => {
        let msgIndex = 0;
        const addMessage = () => {
            setMessages(prev => {
                const newMessages = [...prev.slice(-3), messageQueue[msgIndex % messageQueue.length]];
                msgIndex++;
                return newMessages;
            });
        };
        const interval = setInterval(addMessage, 3000);
        addMessage();
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Hacking Console - FIXED: smaller, better position */}
            <div className="fixed bottom-32 left-4 z-40 w-56 pointer-events-none select-none">
                <div className="bg-black/80 border border-green-500/40 rounded p-2 font-mono text-[10px]">
                    {messages.map((msg, i) => (
                        <div key={i} className="text-green-400 mb-0.5 truncate" style={{ opacity: 0.5 + (i / messages.length) * 0.5 }}>
                            {msg}
                        </div>
                    ))}
                    <div className="text-green-400 flex items-center">
                        <span>{'>'} _</span>
                        <span className="animate-pulse ml-0.5">█</span>
                    </div>
                </div>
            </div>

            {/* System Status - FIXED: better positioning */}
            <div className="fixed top-36 right-4 z-40 pointer-events-none select-none">
                <div className="bg-black/70 border border-green-500/30 rounded px-3 py-1.5 font-mono">
                    <div className="text-green-400 text-[10px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        ONLINE
                    </div>
                </div>
            </div>
        </>
    );
};

// ============================================
// GEOCITIES THEME HUD - FIXED: better sizing
// ============================================
const GeocitiesHUD = () => {
    const [hits, setHits] = useState(1337);

    useEffect(() => {
        const interval = setInterval(() => {
            setHits(h => h + Math.floor(Math.random() * 3));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Visitor Counter - FIXED: smaller */}
            <div className="fixed bottom-32 left-4 z-40 pointer-events-none select-none">
                <div className="bg-black p-1.5 border border-lime-500">
                    <div className="text-lime-400 font-mono text-[8px] text-center mb-0.5">
                        👁️ VISITORS 👁️
                    </div>
                    <div className="bg-black text-lime-500 font-mono text-sm text-center px-1" style={{ fontFamily: 'Courier New' }}>
                        {String(hits).padStart(7, '0')}
                    </div>
                </div>
            </div>

            {/* Guestbook Button - FIXED: smaller, proper z-index */}
            <div className="fixed bottom-32 right-4 z-40 select-none">
                <button className="bg-gray-300 border-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500 px-2 py-1 font-bold text-[10px] active:border-t-gray-500 active:border-l-gray-500 active:border-r-white active:border-b-white hover:bg-gray-200">
                    📝 Guestbook
                </button>
            </div>

            {/* NEW! badge - FIXED: smaller */}
            <div className="fixed top-36 right-4 z-40 pointer-events-none select-none">
                <div className="animate-pulse">
                    <span className="text-xs font-bold text-red-500 bg-yellow-300 px-1.5 py-0.5 rotate-12 inline-block"
                        style={{ fontFamily: 'Comic Sans MS' }}>
                        ✨NEW!✨
                    </span>
                </div>
            </div>

            {/* Email - FIXED: smaller */}
            <div className="fixed top-36 left-4 z-40 pointer-events-none select-none">
                <div className="text-xl animate-bounce">📧</div>
                <div className="text-[8px] text-yellow-300 font-bold" style={{ fontFamily: 'Comic Sans MS' }}>
                    Email me!
                </div>
            </div>
        </>
    );
};

// ============================================
// AMAZON THEME HUD - FIXED: sizing and positioning
// ============================================
const AmazonHUD = () => {
    const fakeReviews = [
        { stars: 5, text: '"Changed my life!!" - VerifiedBuyer' },
        { stars: 5, text: '"Better than expected" - Schatz' },
        { stars: 4, text: '"Would recommend" - LiebsterUser' },
    ];
    const [reviewIndex, setReviewIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setReviewIndex(i => (i + 1) % fakeReviews.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Prime Badge - FIXED: smaller */}
            <div className="fixed bottom-32 right-4 z-40 pointer-events-none select-none">
                <div className="bg-white rounded-lg shadow-md px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[#00a8e1] font-bold text-[10px]">✓ prime</span>
                        <span className="text-[8px] text-gray-500">FREE One-Day</span>
                    </div>
                    <div className="text-[8px] text-gray-400">
                        Order within <span className="text-[#c45500] font-bold">2h 34m</span>
                    </div>
                </div>
            </div>

            {/* Rotating Review - FIXED: smaller */}
            <div className="fixed bottom-32 left-4 z-40 w-48 pointer-events-none select-none">
                <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200">
                    <div className="flex items-center gap-0.5 mb-0.5">
                        {[...Array(fakeReviews[reviewIndex].stars)].map((_, i) => (
                            <span key={i} className="text-orange-400 text-[10px]">★</span>
                        ))}
                    </div>
                    <p className="text-[9px] text-gray-600 italic truncate">
                        {fakeReviews[reviewIndex].text}
                    </p>
                </div>
            </div>

            {/* Amazon Choice Badge - FIXED: smaller */}
            <div className="fixed top-36 left-4 z-40 pointer-events-none select-none">
                <div className="bg-[#232f3e] text-white text-[9px] px-2 py-0.5 rounded-sm">
                    <span className="text-[#f90] font-bold">Amazon's</span> Choice
                </div>
            </div>
        </>
    );
};

// ============================================
// DROPSHIP THEME HUD - FIXED: less aggressive
// ============================================
const DropshipHUD = () => {
    const [viewers, setViewers] = useState(1247);
    const [countdown, setCountdown] = useState({ h: 0, m: 14, s: 32 });
    const [sold] = useState(3);

    useEffect(() => {
        const viewerInterval = setInterval(() => {
            setViewers(v => Math.max(100, v + Math.floor(Math.random() * 10) - 4));
        }, 3000);

        const countdownInterval = setInterval(() => {
            setCountdown(c => {
                let { h, m, s } = c;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 0; m = 14; s = 32; }
                return { h, m, s };
            });
        }, 1000);

        return () => {
            clearInterval(viewerInterval);
            clearInterval(countdownInterval);
        };
    }, []);

    return (
        <>
            {/* Live viewers - FIXED: smaller */}
            <div className="fixed top-36 left-4 z-40 pointer-events-none select-none">
                <div className="bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1.5 text-[10px]">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="font-bold">{viewers.toLocaleString()} watching</span>
                </div>
            </div>

            {/* Stock warning - FIXED: less bouncy, smaller */}
            <div className="fixed bottom-32 left-4 z-40 pointer-events-none select-none">
                <div className="bg-orange-100 border border-orange-400 rounded-lg p-2">
                    <div className="text-orange-600 font-bold text-[10px] flex items-center gap-1">
                        ⚠️ Only {sold} left!
                    </div>
                </div>
            </div>

            {/* Sale countdown - FIXED: smaller */}
            <div className="fixed bottom-32 right-4 z-40 pointer-events-none select-none">
                <div className="bg-black text-white p-2 rounded-lg">
                    <div className="text-[8px] text-red-400 uppercase mb-0.5">⚡ Sale Ends:</div>
                    <div className="font-mono text-sm font-bold text-red-500">
                        {String(countdown.h).padStart(2, '0')}:
                        {String(countdown.m).padStart(2, '0')}:
                        {String(countdown.s).padStart(2, '0')}
                    </div>
                </div>
            </div>
        </>
    );
};

// ============================================
// VAPORWAVE THEME HUD - FIXED: better visibility
// ============================================
const VaporwaveHUD = () => {
    return (
        <>
            {/* Japanese aesthetic text - FIXED: better positioning */}
            <div className="fixed top-36 right-4 z-40 pointer-events-none select-none">
                <div className="text-xl text-white/70" style={{
                    fontFamily: 'VT323, monospace',
                    textShadow: '2px 2px 0 #ff6ad5, -1px -1px 0 #00ffff',
                    letterSpacing: '0.2em'
                }}>
                    愛
                </div>
                <div className="text-[8px] text-white/50 text-center" style={{ letterSpacing: '0.1em' }}>
                    LOVE
                </div>
            </div>

            {/* Floating palm - FIXED: smaller */}
            <div className="fixed bottom-36 left-4 z-40 pointer-events-none select-none opacity-50">
                <div className="text-2xl animate-float" style={{ animationDuration: '4s' }}>
                    🌴
                </div>
            </div>

            {/* Aesthetic Roman bust - FIXED: smaller */}
            <div className="fixed bottom-36 right-4 z-40 pointer-events-none select-none opacity-40">
                <div className="text-3xl" style={{ filter: 'drop-shadow(0 0 5px #ff6ad5)' }}>
                    🗿
                </div>
            </div>
        </>
    );
};

// ============================================
// WINDOWS XP THEME HUD - FIXED: Clippy positioning
// ============================================
const WindowsXPHUD = () => {
    const [time, setTime] = useState(new Date());
    const [showClippy, setShowClippy] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const clippyTimer = setTimeout(() => setShowClippy(true), 5000);
        return () => {
            clearInterval(timer);
            clearTimeout(clippyTimer);
        };
    }, []);

    return (
        <>
            {/* System Tray Clock - FIXED: proper z-index for taskbar */}
            <div className="fixed bottom-0 right-2 z-[10001] pointer-events-none select-none">
                <div className="text-white text-[10px] font-normal py-1" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                    {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Clippy helper - FIXED: better positioning, smaller */}
            {showClippy && (
                <div className="fixed bottom-12 right-4 z-40 select-none">
                    <div className="relative">
                        <div className="text-3xl animate-bounce">📎</div>
                        <div className="absolute -top-16 -left-28 bg-[#ffffc6] border border-black rounded-lg p-2 w-32 text-[9px]"
                            style={{ fontFamily: 'Tahoma, sans-serif' }}>
                            <p>Es sieht so aus, als würdest du jemanden lieben!</p>
                            <p className="mt-1 text-blue-600 underline cursor-pointer" onClick={() => setShowClippy(false)}>
                                Nein danke!
                            </p>
                            <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-[#ffffc6] border-r border-b border-black transform rotate-45" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ============================================
// APPLE THEME HUD - FIXED: iOS status bar
// ============================================
const AppleHUD = () => {
    const [battery] = useState(87);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const notifTimer = setTimeout(() => setShowNotification(true), 3000);
        const hideTimer = setTimeout(() => setShowNotification(false), 8000);
        return () => {
            clearTimeout(notifTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <>
            {/* iOS Status Bar - FIXED: proper z-index, not overlapping */}
            <div className="fixed top-1 left-0 right-0 z-40 pointer-events-none select-none">
                <div className="flex justify-between items-center px-4 py-1 text-[10px] font-medium text-[#1d1d1f]">
                    <span>{new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-[8px]">📶</span>
                        <span className="text-[8px]">5G</span>
                        <span className="ml-1 text-[8px]">🔋{battery}%</span>
                    </div>
                </div>
            </div>

            {/* Dynamic Island Notification - FIXED: better animation class */}
            {showNotification && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none animate-bounce">
                    <div className="bg-black text-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-xl">
                        <span className="text-lg">💕</span>
                        <div>
                            <p className="text-[8px] text-gray-400">GFM</p>
                            <p className="text-[10px] font-medium">Du bist wunderbar! ✨</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ============================================
// PROFESSIONAL THEME HUD - FIXED: smaller widgets
// ============================================
const ProfessionalHUD = () => {
    return (
        <>
            {/* KPI Widget - FIXED: smaller */}
            <div className="fixed bottom-32 right-4 z-40 pointer-events-none select-none">
                <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200">
                    <div className="text-[8px] text-gray-500 uppercase mb-1">Q4 Love Metrics</div>
                    <div className="flex items-end gap-0.5 h-10">
                        {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                            <div key={i} className="w-2 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="text-[8px] text-green-600 mt-1">↑ 15% vs Q3</div>
                </div>
            </div>

            {/* Endorsements - FIXED: smaller */}
            <div className="fixed bottom-32 left-4 z-40 pointer-events-none select-none">
                <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200 w-32">
                    <div className="text-[8px] text-gray-500 mb-1">Top Skills</div>
                    <div className="space-y-0.5">
                        {['Being Sweet', 'Streak Master', 'Love Expert'].map((skill, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-[8px] text-gray-600 truncate">{skill}</span>
                                <span className="text-[8px] text-blue-600">99+</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

// ============================================
// DARK PRO THEME HUD - FIXED: subtle
// ============================================
const DarkProHUD = () => {
    return (
        <>
            {/* Glow indicator - FIXED: smaller, less intrusive */}
            <div className="fixed bottom-32 right-4 z-40 pointer-events-none select-none">
                <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-2 border border-purple-500/20 shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-sm shadow-purple-500/50" />
                        <span className="text-purple-200 text-[9px] font-medium">Pro Mode</span>
                    </div>
                </div>
            </div>
        </>
    );
};

// ============================================
// OVERKILL THEME HUD - FIXED: less chaos
// ============================================
const OverkillHUD = () => {
    const popups = [
        { id: 1, text: '🎉 WOW!', x: 15, y: 35 },
        { id: 2, text: '💰 COOL', x: 75, y: 45 },
    ];

    return (
        <>
            {/* Random floating popups - FIXED: fewer, smaller */}
            {popups.map((popup) => (
                <div
                    key={popup.id}
                    className="fixed z-40 pointer-events-none select-none"
                    style={{
                        left: `${popup.x}%`,
                        top: `${popup.y}%`,
                        animation: `bounce ${1 + popup.id * 0.3}s infinite`
                    }}
                >
                    <div className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold px-2 py-1 rounded-lg shadow-md transform rotate-6 border-2 border-black text-xs">
                        {popup.text}
                    </div>
                </div>
            ))}

            {/* Spinning emoji - FIXED: smaller */}
            <div className="fixed bottom-32 right-4 z-40 pointer-events-none select-none">
                <div className="text-2xl" style={{ animation: 'spin 3s linear infinite' }}>
                    🌀
                </div>
            </div>
        </>
    );
};

// ============================================
// LIGHT CLEAN THEME HUD - FIXED: minimal
// ============================================
const LightCleanHUD = () => {
    return (
        <>
            {/* Minimal zen quote - FIXED: proper z-index */}
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none">
                <div className="text-gray-300 text-[10px] font-light tracking-widest">
                    ∙ breathe ∙
                </div>
            </div>
        </>
    );
};

// ============================================
// MAIN THEME OVERLAY COMPONENT
// ============================================
const ThemeOverlay = () => {
    const { currentTheme } = useTheme();

    const overlays = {
        'minecraft': MinecraftHUD,
        'fortnite': FortniteHUD,
        'terminal': TerminalHUD,
        'geocities': GeocitiesHUD,
        'amazon': AmazonHUD,
        'dropship': DropshipHUD,
        'vaporwave': VaporwaveHUD,
        'windows-xp': WindowsXPHUD,
        'apple': AppleHUD,
        'professional': ProfessionalHUD,
        'dark-pro': DarkProHUD,
        'overkill': OverkillHUD,
        'light-clean': LightCleanHUD,
    };

    const OverlayComponent = overlays[currentTheme];

    if (!OverlayComponent) return null;

    return <OverlayComponent />;
};

export default ThemeOverlay;
