import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * CaptchaCats Game - Two-phase cat finding captcha
 * Phase 1: Find all tiles with LUZI
 * Phase 2: Find all tiles with TONI
 * Uses real cat photos from /public/images/cats/
 */

// Actual filenames from the directories
const LUZI_IMAGES = [
    '/images/cats/luzi/0611F95D-263E-4029-80DC-5E53DD51C286_1_105_c.jpeg',
    '/images/cats/luzi/2273FE8B-F515-4763-8239-3CD0102804FF_1_105_c.jpeg',
    '/images/cats/luzi/46F15900-D6B8-4A26-9681-B93D54BD118A_1_105_c.jpeg',
    '/images/cats/luzi/6C12EB0C-AEA3-416C-961F-A86EB7C33F37_1_105_c.jpeg',
    '/images/cats/luzi/A89B0E90-38F9-4D25-84ED-58264B1047C2_1_105_c.jpeg',
];

const TONI_IMAGES = [
    '/images/cats/toni/15910859-76FD-4CA9-832C-A8402581C26C_1_105_c.jpeg',
    '/images/cats/toni/555888A7-9613-4D3A-B0C0-81249C5E7A70_1_105_c.jpeg',
    '/images/cats/toni/5A7711D0-8A40-4FAB-8E60-1E5CA6DD6A92_1_105_c.jpeg',
    '/images/cats/toni/611802F0-ECC7-4A60-B6B2-6C0EE0FB79B2_1_102_o.jpeg',
    '/images/cats/toni/78BDC0E5-170D-4A64-AAF2-37DD19D58CE2_1_105_c.jpeg',
    '/images/cats/toni/7D75FB55-6BC1-494A-A8DC-43B7135C83C3_1_105_c.jpeg',
    '/images/cats/toni/ADB26911-E336-4F88-9F2C-CF7031D2B8FD_1_105_c.jpeg',
];

// Distractor cat images (other cats - not Luzi or Toni)
const DISTRACTOR_IMAGES = [
    '/images/cats/distractors/672afc9bfbf27ed7b6d9cf39badf030b.jpg',
    '/images/cats/distractors/8aaf740f6c533deb84382834635ac9ec.jpg',
    '/images/cats/distractors/Download (1).jpeg',
    '/images/cats/distractors/Download (2).jpeg',
    '/images/cats/distractors/Download (3).jpeg',
    '/images/cats/distractors/Download.jpeg',
    '/images/cats/distractors/images (1).jpeg',
    '/images/cats/distractors/images.jpeg',
];

const CaptchaCats = ({ onWin }) => {
    const [phase, setPhase] = useState(1); // 1 = Find Luzi, 2 = Find Toni
    const [selected, setSelected] = useState([]);
    const [verified, setVerified] = useState(false);
    const [failed, setFailed] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [gridItems, setGridItems] = useState([]);
    const [loadedImages, setLoadedImages] = useState(new Set());

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        generateGrid();
        return () => clearTimeout(timer);
    }, [phase]);

    const generateGrid = () => {
        const targetImages = phase === 1 ? LUZI_IMAGES : TONI_IMAGES;
        const otherImages = phase === 1 ? TONI_IMAGES : LUZI_IMAGES;

        // Shuffle and pick images
        const shuffledTarget = [...targetImages].sort(() => Math.random() - 0.5);
        const shuffledOther = [...otherImages].sort(() => Math.random() - 0.5);
        const shuffledDistractors = [...DISTRACTOR_IMAGES].sort(() => Math.random() - 0.5);

        // 3-4 target cats, 1-2 other cats, rest distractors
        const targetCount = 3 + Math.floor(Math.random() * 2);
        const otherCount = 1 + Math.floor(Math.random() * 2);
        const distractorCount = 9 - targetCount - otherCount;

        let items = [];

        // Add target cats
        for (let i = 0; i < targetCount; i++) {
            items.push({
                id: items.length,
                type: 'target',
                image: shuffledTarget[i % shuffledTarget.length],
                isTarget: true,
                name: phase === 1 ? 'Luzi' : 'Toni',
            });
        }

        // Add other cats (the other specific cat - Toni in phase 1, Luzi in phase 2)
        for (let i = 0; i < otherCount; i++) {
            items.push({
                id: items.length,
                type: 'other-cat',
                image: shuffledOther[i % shuffledOther.length],
                isTarget: false,
                name: phase === 1 ? 'Toni' : 'Luzi',
            });
        }

        // Add distractor images (random other cats)
        for (let i = 0; i < distractorCount; i++) {
            items.push({
                id: items.length,
                type: 'distractor',
                image: shuffledDistractors[i % shuffledDistractors.length],
                isTarget: false,
                name: 'Andere Katze',
            });
        }

        // Shuffle all and reassign IDs
        items = items.sort(() => Math.random() - 0.5).map((item, idx) => ({ ...item, id: idx }));
        setGridItems(items);
        setSelected([]);
        setLoadedImages(new Set()); // Reset loaded images when grid regenerates
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
                    ${phase >= 2 || verified ? 'bg-green-500' : 'bg-gray-300'}
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
                                    relative aspect-square
                                    flex items-center justify-center
                                    rounded-lg transition-all duration-200
                                    overflow-hidden
                                    ${selected.includes(item.id)
                                        ? 'ring-4 ring-blue-500 scale-95'
                                        : 'hover:ring-2 hover:ring-gray-300'
                                    }
                                    ${verified && item.isTarget ? 'ring-4 ring-green-500' : ''}
                                    bg-gray-100
                                `}
                            >
                                {item.image ? (
                                    <>
                                        {/* Loading shimmer */}
                                        {!loadedImages.has(item.id) && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-loading-shimmer" />
                                        )}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'}`}
                                            loading="lazy"
                                            onLoad={() => setLoadedImages(prev => new Set(prev).add(item.id))}
                                        />
                                    </>
                                ) : (
                                    <span className="text-4xl">{item.emoji}</span>
                                )}
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

            {/* Success Animation */}
            {verified && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-500 animate-slide-up">
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
                    <p className="text-lg font-bold">Katzen-Expert*in! 🐱💕</p>
                    <SparkleIcon className="w-5 h-5" aria-hidden="true" />
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
