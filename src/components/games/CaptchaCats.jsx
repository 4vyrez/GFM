import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * CaptchaCats Game - Two-phase cat finding captcha
 * Phase 1: Find all tiles with LUZI
 * Phase 2: Find all tiles with TONI
 * Uses real cat photos when available, emoji fallback otherwise
 */
const CaptchaCats = ({ onWin }) => {
    const [phase, setPhase] = useState(1); // 1 = Find Luzi, 2 = Find Toni
    const [selected, setSelected] = useState([]);
    const [verified, setVerified] = useState(false);
    const [failed, setFailed] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [gridItems, setGridItems] = useState([]);
    const [useRealPhotos, setUseRealPhotos] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Emoji fallback animals
    const emojiAnimals = [
        { emoji: '🐕', name: 'Hund' },
        { emoji: '🐰', name: 'Hase' },
        { emoji: '🐹', name: 'Hamster' },
        { emoji: '🦊', name: 'Fuchs' },
        { emoji: '🐻', name: 'Bär' },
        { emoji: '🐸', name: 'Frosch' },
        { emoji: '🦆', name: 'Ente' },
        { emoji: '🐧', name: 'Pinguin' },
    ];

    // Check if real photos are available
    useEffect(() => {
        const checkPhotos = async () => {
            try {
                // Try to load one Luzi and one Toni image
                const luziCheck = await fetch('/images/cats/luzi/luzi_1.jpg', { method: 'HEAD' });
                const toniCheck = await fetch('/images/cats/toni/toni_1.jpg', { method: 'HEAD' });

                if (luziCheck.ok && toniCheck.ok) {
                    setUseRealPhotos(true);
                }
            } catch (e) {
                // Fallback to emoji mode
                setUseRealPhotos(false);
            }
            setIsLoading(false);
        };
        checkPhotos();
    }, []);

    // Generate grid when phase changes or on mount
    useEffect(() => {
        if (isLoading) return;
        generateGrid();
        setTimeout(() => setIsVisible(true), 100);
    }, [phase, isLoading, useRealPhotos]);

    const generateGrid = () => {
        const targetCat = phase === 1 ? 'luzi' : 'toni';
        const otherCat = phase === 1 ? 'toni' : 'luzi';

        // How many of each type
        const targetCount = 3 + Math.floor(Math.random() * 2); // 3-4 targets
        const otherCatCount = 1 + Math.floor(Math.random() * 2); // 1-2 of the other cat
        const distractorCount = 9 - targetCount - otherCatCount;

        let items = [];

        if (useRealPhotos) {
            // Use real photos
            for (let i = 0; i < targetCount; i++) {
                items.push({
                    id: items.length,
                    type: 'target',
                    image: `/images/cats/${targetCat}/${targetCat}_${(i % 3) + 1}.jpg`,
                    isTarget: true,
                    name: targetCat.charAt(0).toUpperCase() + targetCat.slice(1),
                });
            }
            for (let i = 0; i < otherCatCount; i++) {
                items.push({
                    id: items.length,
                    type: 'other-cat',
                    image: `/images/cats/${otherCat}/${otherCat}_${(i % 3) + 1}.jpg`,
                    isTarget: false,
                    name: otherCat.charAt(0).toUpperCase() + otherCat.slice(1),
                });
            }
        } else {
            // Use emoji fallback
            const targetEmoji = phase === 1 ? '🐱' : '😺';
            const otherEmoji = phase === 1 ? '😺' : '🐱';

            for (let i = 0; i < targetCount; i++) {
                items.push({
                    id: items.length,
                    type: 'target',
                    emoji: targetEmoji,
                    isTarget: true,
                    name: targetCat.charAt(0).toUpperCase() + targetCat.slice(1),
                });
            }
            for (let i = 0; i < otherCatCount; i++) {
                items.push({
                    id: items.length,
                    type: 'other-cat',
                    emoji: otherEmoji,
                    isTarget: false,
                    name: otherCat.charAt(0).toUpperCase() + otherCat.slice(1),
                });
            }
        }

        // Add distractor animals
        const shuffledAnimals = [...emojiAnimals].sort(() => Math.random() - 0.5);
        for (let i = 0; i < distractorCount; i++) {
            items.push({
                id: items.length,
                type: 'distractor',
                emoji: shuffledAnimals[i % shuffledAnimals.length].emoji,
                isTarget: false,
                name: shuffledAnimals[i % shuffledAnimals.length].name,
            });
        }

        // Shuffle all items
        items = items.sort(() => Math.random() - 0.5).map((item, idx) => ({ ...item, id: idx }));
        setGridItems(items);
    };

    const targetCount = gridItems.filter(item => item.isTarget).length;

    const toggleSelection = (id) => {
        if (verified) return;
        setFailed(false);

        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleVerify = () => {
        const selectedItems = gridItems.filter(item => selected.includes(item.id));
        const allTargetsSelected = selectedItems.every(item => item.isTarget);
        const allTargetsFound = selectedItems.filter(item => item.isTarget).length === targetCount;
        const nothingExtra = selectedItems.length === targetCount;

        if (allTargetsSelected && allTargetsFound && nothingExtra) {
            if (phase === 1) {
                // Move to phase 2
                setPhase(2);
                setSelected([]);
                setFailed(false);
            } else {
                // Both phases complete!
                setVerified(true);
                setTimeout(() => {
                    if (onWin) {
                        onWin({
                            gameId: 'captcha-cats-1',
                            metric: 'attempts',
                            value: attempts,
                        });
                    }
                }, 1500);
            }
        } else {
            setFailed(true);
            setSelected([]);
            setAttempts(prev => prev + 1);
        }
    };

    const getCurrentCatName = () => phase === 1 ? 'LUZI' : 'TONI';
    const getCurrentCatEmoji = () => phase === 1 ? '🐱' : '😺';

    const getMessage = () => {
        if (verified) return 'Verifiziert! Du kennst die Katzen! 😍';
        if (failed) return 'Nope! Das sind nicht alle... 🔄';
        if (selected.length === 0) return `Wähle alle Bilder mit ${getCurrentCatName()} ${getCurrentCatEmoji()}`;
        return `${selected.length} ausgewählt`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-4xl animate-bounce">🐱</div>
                <p className="text-gray-500 mt-4">Lade Katzenbilder...</p>
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
            {/* Phase Indicator */}
            <div className="flex justify-center gap-2 mb-4">
                <div className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${phase >= 1 ? 'bg-green-500' : 'bg-gray-300'}
                `} />
                <div className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${phase >= 2 ? 'bg-green-500' : 'bg-gray-300'}
                `} />
            </div>

            {/* Captcha Header */}
            <div className="w-full max-w-xs mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-t-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🔒</span>
                        <span className="font-bold text-sm">reCATCHA</span>
                        <span className="ml-auto text-xs opacity-70">Phase {phase}/2</span>
                    </div>
                    <p className="text-sm">
                        Wähle alle Bilder mit <strong>{getCurrentCatName()}</strong> {getCurrentCatEmoji()}
                    </p>
                </div>

                {/* Grid */}
                <div className="bg-white border-2 border-gray-300 p-2">
                    <div className="grid grid-cols-3 gap-1">
                        {gridItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleSelection(item.id)}
                                disabled={verified}
                                className={`
                                    aspect-square
                                    flex items-center justify-center
                                    rounded-lg transition-all duration-200
                                    overflow-hidden
                                    ${selected.includes(item.id)
                                        ? 'border-3 border-blue-500 scale-95 ring-2 ring-blue-300'
                                        : 'border-2 border-transparent hover:border-gray-300'
                                    }
                                    ${verified && item.isTarget ? 'bg-green-100 border-green-500' : 'bg-gray-100'}
                                `}
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to emoji on error
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <span
                                    className={`text-4xl ${item.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                                >
                                    {item.emoji}
                                </span>
                                {selected.includes(item.id) && (
                                    <span className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                                        ✓
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Verify Button */}
                <div className="bg-gray-100 border-2 border-t-0 border-gray-300 rounded-b-xl p-3">
                    {!verified ? (
                        <button
                            onClick={handleVerify}
                            disabled={selected.length === 0}
                            className={`
                                w-full py-2 rounded-lg font-bold text-white
                                transition-all duration-200
                                ${selected.length > 0
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            ÜBERPRÜFEN
                        </button>
                    ) : (
                        <div className="text-center text-green-600 font-bold py-2">
                            ✅ Erfolgreich verifiziert
                        </div>
                    )}
                </div>
            </div>

            {/* Status Message */}
            <p className={`
                text-center font-medium transition-all duration-300
                ${verified ? 'text-green-600' : ''}
                ${failed ? 'text-red-500' : 'text-gray-500'}
            `}>
                {getMessage()}
            </p>

            {/* Hint for real photos */}
            {!useRealPhotos && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                    💡 Füge echte Fotos in /public/images/cats/ hinzu!
                </p>
            )}

            {/* Success Animation */}
            {verified && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-500 animate-slide-up">
                    <SparkleIcon className="w-5 h-5" />
                    <p className="text-lg font-bold">Katzen-Expert*in! 🐱💕</p>
                    <SparkleIcon className="w-5 h-5" />
                </div>
            )}

            {/* Attempt Counter */}
            <div className="mt-4 text-xs text-gray-400">
                Versuch #{attempts}
            </div>
        </div>
    );
};

export default CaptchaCats;
