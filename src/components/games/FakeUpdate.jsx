import { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * FakeUpdate Game - Steam-style update simulation
 * Features funny time/speed bugs like real Steam downloads
 * Duration: 60 seconds auto-success
 */
const FakeUpdate = ({ onWin }) => {
    const [progress, setProgress] = useState(0);
    const [timeEstimate, setTimeEstimate] = useState('30 Sekunden');
    const [downloadSpeed, setDownloadSpeed] = useState('127.4 MB/s');
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [currentAction, setCurrentAction] = useState('Verbinde mit Steam-Servern...');
    const [started, setStarted] = useState(false);
    const [filesProgress, setFilesProgress] = useState({ current: 0, total: 2847 });

    const elapsedRef = useRef(0);
    const progressRef = useRef(0);

    const funnyTimeEstimates = [
        '30 Sekunden',
        '28 Sekunden',
        '25 Sekunden',
        '3 Tage, 7 Stunden',
        '2 Wochen',
        '∞',
        '47 Sekunden',
        '3 Monate',
        'Wird berechnet...',
        '12 Sekunden',
        '6 Jahre',
        '-2 Minuten',
        '1 Sekunde',
        '847 Stunden',
        '5 Sekunden',
        'Fast fertig!',
    ];

    const funnySpeeds = [
        '127.4 MB/s',
        '89.2 MB/s',
        '0.3 KB/s',
        '∞ GB/s',
        '0 B/s',
        '-45.2 MB/s',
        '2.1 MB/s',
        '999.9 TB/s',
        '0.001 B/s',
        '42.0 MB/s',
        'Pause...',
        '1 Byte/Woche',
        '156.8 MB/s',
        '0.0 MB/s',
    ];

    const actions = [
        'Verbinde mit Steam-Servern...',
        'Überprüfe Dateien...',
        'Love.exe wird heruntergeladen...',
        'Entpacke Kuscheleinheiten...',
        'Installiere neue Umarmungen...',
        'Optimiere Schmetterlinge im Bauch...',
        'Patche Herzklopfen-Module...',
        'Aktualisiere Liebes-Algorithmus...',
        'Synchronisiere Gefühle...',
        'Lade Premium-Zuneigung...',
        'Removing bugs from Theos Gehirn...',
        'Installiere Romantik-DLC...',
        'Verifiziere Herzschlagdaten...',
        'Finale Konfiguration...',
        'Lösche Ex-Dateien... ✓',
        'Installiere GamerGirl.dll...',
        'Patche Anti-Cheat für Herzen...',
        'Lade Season Pass: Ewige Liebe...',
        'Unlocking achievement: Seelenverwandte...',
        'Kalibriere Kuschel-Sensoren...',
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const startUpdate = () => {
        setStarted(true);

        // Main game loop
        const gameInterval = setInterval(() => {
            elapsedRef.current += 1;

            // Progress with funny bugs
            setProgress(prev => {
                let newProgress = prev;

                // Normal progression with occasional bugs
                if (elapsedRef.current < 55) {
                    // Sometimes jump weirdly
                    if (Math.random() < 0.15) {
                        // Funny progress bugs
                        const bugType = Math.random();
                        if (bugType < 0.3 && prev > 20) {
                            newProgress = prev - Math.random() * 15; // Go backwards!
                        } else if (bugType < 0.5) {
                            newProgress = prev + Math.random() * 5 + 2; // Normal
                        } else if (bugType < 0.7) {
                            newProgress = prev + 0.1; // Super slow
                        } else {
                            newProgress = prev + Math.random() * 10; // Sometimes fast
                        }
                    } else {
                        newProgress = prev + 1.2 + Math.random() * 0.8;
                    }

                    // Stuck at 99% for a bit
                    if (newProgress >= 99 && elapsedRef.current < 50) {
                        newProgress = 99;
                    }

                    // Cap at 99 until final
                    newProgress = Math.min(99, Math.max(0, newProgress));
                }

                progressRef.current = newProgress;
                return newProgress;
            });

            // Funny time estimates
            if (Math.random() < 0.25 || elapsedRef.current % 5 === 0) {
                setTimeEstimate(funnyTimeEstimates[Math.floor(Math.random() * funnyTimeEstimates.length)]);
            }

            // Funny download speeds
            if (Math.random() < 0.3 || elapsedRef.current % 4 === 0) {
                setDownloadSpeed(funnySpeeds[Math.floor(Math.random() * funnySpeeds.length)]);
            }

            // Update action
            if (Math.random() < 0.15) {
                const actionIndex = Math.min(
                    Math.floor(progressRef.current / 100 * actions.length),
                    actions.length - 1
                );
                setCurrentAction(actions[actionIndex]);
            }

            // Update files
            setFilesProgress(prev => ({
                ...prev,
                current: Math.min(prev.total, Math.floor(progressRef.current / 100 * prev.total))
            }));

            // Complete at 60 seconds
            if (elapsedRef.current >= 60) {
                clearInterval(gameInterval);
                setProgress(100);
                setTimeEstimate('Fertig!');
                setDownloadSpeed('---');
                setCurrentAction('Installation abgeschlossen!');
                setFilesProgress(prev => ({ ...prev, current: prev.total }));
                setIsComplete(true);

                setTimeout(() => {
                    if (onWin) {
                        onWin({
                            gameId: 'fake-update-1',
                            metric: 'seconds',
                            value: 60,
                        });
                    }
                }, 2000);
            }
        }, 1000);

        return () => clearInterval(gameInterval);
    };

    if (!started) {
        return (
            <div
                className={`
                    flex flex-col items-center w-full
                    transform transition-all duration-700 ease-apple
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
            >
                {/* Steam-style start screen */}
                <div className="w-full max-w-sm bg-gradient-to-b from-[#1b2838] to-[#171a21] rounded-lg overflow-hidden shadow-xl border border-[#2a475e]">
                    <div className="bg-gradient-to-r from-[#1a9fff] to-[#0066cc] px-4 py-2">
                        <span className="text-white font-bold text-sm">💕 STEAM - Love Update</span>
                    </div>

                    <div className="p-6 text-center">
                        <div className="text-6xl mb-4">💕</div>
                        <h2 className="text-white text-xl font-bold mb-2">Love Update 2.0</h2>
                        <p className="text-[#8f98a0] text-sm mb-4">
                            Ein wichtiges Update ist verfügbar!
                        </p>
                        <p className="text-[#67c1f5] text-xs mb-6">
                            Größe: 847.3 GB • 2.847 Dateien
                        </p>

                        <button
                            onClick={startUpdate}
                            className="
                                bg-gradient-to-r from-[#47bfff] to-[#1a9fff]
                                hover:from-[#66ccff] hover:to-[#47bfff]
                                text-white font-bold px-8 py-3 rounded
                                transition-all duration-200
                                hover:scale-105 active:scale-95
                                shadow-lg
                            "
                        >
                            ▶ Update starten
                        </button>
                    </div>
                </div>
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
            {/* Steam-style update screen */}
            <div className="w-full max-w-sm bg-gradient-to-b from-[#1b2838] to-[#171a21] rounded-lg overflow-hidden shadow-xl border border-[#2a475e]">
                {/* Title bar */}
                <div className="bg-gradient-to-r from-[#1a9fff] to-[#0066cc] px-4 py-2 flex items-center justify-between">
                    <span className="text-white font-bold text-sm">💕 Updating...</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-white/20 hover:bg-white/40 cursor-pointer" />
                        <div className="w-3 h-3 rounded-sm bg-white/20 hover:bg-white/40 cursor-pointer" />
                        <div className="w-3 h-3 rounded-sm bg-red-500/80 hover:bg-red-500 cursor-pointer" />
                    </div>
                </div>

                <div className="p-4">
                    {/* Game title */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl">💕</div>
                        <div>
                            <h3 className="text-white font-bold">Love Update 2.0</h3>
                            <p className="text-[#8f98a0] text-xs">Downloading update...</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                        <div className="relative h-5 bg-[#0e1621] rounded overflow-hidden border border-[#2a475e]">
                            <div
                                className={`
                                    absolute inset-y-0 left-0 rounded
                                    transition-all duration-300
                                    ${isComplete
                                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                                        : 'bg-gradient-to-r from-[#1a9fff] to-[#47bfff]'
                                    }
                                `}
                                style={{ width: `${progress}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xs font-bold drop-shadow">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="bg-[#0e1621] rounded p-2 border border-[#2a475e]">
                            <span className="text-[#8f98a0]">Download:</span>
                            <span className={`
                                ml-2 font-mono font-bold
                                ${downloadSpeed.includes('-') || downloadSpeed === '0 B/s'
                                    ? 'text-red-400'
                                    : downloadSpeed.includes('∞') || downloadSpeed.includes('TB')
                                        ? 'text-yellow-400'
                                        : 'text-[#66c0f4]'
                                }
                            `}>
                                {downloadSpeed}
                            </span>
                        </div>
                        <div className="bg-[#0e1621] rounded p-2 border border-[#2a475e]">
                            <span className="text-[#8f98a0]">ETA:</span>
                            <span className={`
                                ml-2 font-mono font-bold
                                ${timeEstimate.includes('Jahre') || timeEstimate.includes('Monat') || timeEstimate.includes('Woche') || timeEstimate.includes('Tage')
                                    ? 'text-red-400'
                                    : timeEstimate === '∞' || timeEstimate.includes('-')
                                        ? 'text-yellow-400'
                                        : 'text-[#66c0f4]'
                                }
                            `}>
                                {timeEstimate}
                            </span>
                        </div>
                    </div>

                    {/* Files progress */}
                    <div className="bg-[#0e1621] rounded p-2 border border-[#2a475e] mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#8f98a0]">Dateien:</span>
                            <span className="text-[#66c0f4] font-mono">
                                {filesProgress.current.toLocaleString()} / {filesProgress.total.toLocaleString()}
                            </span>
                        </div>
                        <div className="h-1 bg-[#1b2838] rounded overflow-hidden">
                            <div
                                className="h-full bg-[#5ba32b] transition-all duration-300"
                                style={{ width: `${(filesProgress.current / filesProgress.total) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Current action */}
                    <div className="bg-[#0e1621] rounded p-3 border border-[#2a475e]">
                        <p className="text-[#8f98a0] text-xs flex items-center gap-2">
                            {!isComplete && <span className="animate-spin">⚙️</span>}
                            {isComplete && <span>✅</span>}
                            {currentAction}
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Animation */}
            {isComplete && (
                <div className="mt-6 text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                        <SparkleIcon className="w-5 h-5" />
                        <p className="text-lg font-bold">Update installiert! 💕</p>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Love.exe läuft jetzt mit maximaler Zuneigung!
                    </p>
                </div>
            )}
        </div>
    );
};

export default FakeUpdate;
