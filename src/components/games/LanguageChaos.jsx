import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * LanguageChaos Game - Japanese Game Settings Meme
 * Navigate through confusing Japanese menus to find language settings
 * Shows Japanese text to make it clear this is a meme about Japanese games
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

    // Menu structure - Japanese text to make it clear this is a meme
    const menus = {
        main: {
            title: '⚙️',
            subtitle: '設定', // "Settings" in Japanese
            items: [
                { icon: '🔊', label: 'オーディオ', action: 'audio' },
                { icon: '🎮', label: 'コントロール', action: 'controls' },
                { icon: '📺', label: 'ディスプレイ', action: 'display' },
                { icon: '💾', label: 'セーブデータ', action: 'save' },
                { icon: '🔧', label: '詳細設定', action: 'advanced' },
                { icon: '❓', label: 'ヘルプ', action: 'help' },
            ]
        },
        audio: {
            title: '🔊',
            subtitle: 'オーディオ',
            items: [
                { icon: '🎵', label: 'BGM音量', action: 'dead' },
                { icon: '🔈', label: 'SE音量', action: 'dead' },
                { icon: '🎧', label: 'ボイス', action: 'dead' },
                { icon: '🔔', label: '通知音', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        controls: {
            title: '🎮',
            subtitle: 'コントロール',
            items: [
                { icon: '🕹️', label: 'ゲームパッド', action: 'dead' },
                { icon: '⌨️', label: 'キーボード', action: 'dead' },
                { icon: '🖱️', label: 'マウス', action: 'dead' },
                { icon: '📱', label: 'タッチ', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        display: {
            title: '📺',
            subtitle: 'ディスプレイ',
            items: [
                { icon: '🖥️', label: '解像度', action: 'dead' },
                { icon: '🌙', label: '明るさ', action: 'dead' },
                { icon: '☀️', label: 'コントラスト', action: 'dead' },
                { icon: '🔲', label: 'アクセシビリティ', action: 'accessibility' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        accessibility: {
            title: '🔲',
            subtitle: 'アクセシビリティ',
            items: [
                { icon: '👁️', label: '視覚支援', action: 'dead' },
                { icon: '🔤', label: '字幕', action: 'dead' },
                { icon: '🌐', label: '言語', action: 'language' }, // Hidden here!
                { icon: '🎨', label: '色調整', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        save: {
            title: '💾',
            subtitle: 'セーブデータ',
            items: [
                { icon: '📁', label: 'セーブスロット', action: 'dead' },
                { icon: '🗑️', label: 'データ削除', action: 'dead' },
                { icon: '☁️', label: 'クラウド同期', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        advanced: {
            title: '🔧',
            subtitle: '詳細設定',
            items: [
                { icon: '⚡', label: 'パフォーマンス', action: 'dead' },
                { icon: '🔋', label: '省エネモード', action: 'dead' },
                { icon: '📊', label: 'システム', action: 'system' },
                { icon: '🔒', label: 'セキュリティ', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        system: {
            title: '📊',
            subtitle: 'システム',
            items: [
                { icon: '💻', label: 'ハードウェア', action: 'dead' },
                { icon: '🔄', label: 'アップデート', action: 'dead' },
                { icon: '📋', label: 'ライセンス', action: 'dead' },
                { icon: '🗂️', label: 'リージョン', action: 'region' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        region: {
            title: '🗂️',
            subtitle: 'リージョン',
            items: [
                { icon: '🗺️', label: '地域', action: 'dead' },
                { icon: '⏰', label: 'タイムゾーン', action: 'dead' },
                { icon: '🌐', label: '言語', action: 'language' }, // Also hidden here!
                { icon: '📅', label: '日付形式', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        help: {
            title: '❓',
            subtitle: 'ヘルプ',
            items: [
                { icon: '📖', label: 'マニュアル', action: 'dead' },
                { icon: '💭', label: 'FAQ', action: 'dead' },
                { icon: '📧', label: 'お問い合わせ', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
            ]
        },
        language: {
            title: '🌐',
            subtitle: '言語選択',
            items: [
                { icon: '🇯🇵', label: '日本語', action: 'dead' },
                { icon: '🇩🇪', label: 'Deutsch', action: 'found' }, // GOAL!
                { icon: '🇬🇧', label: 'English', action: 'dead' },
                { icon: '🇫🇷', label: 'Français', action: 'dead' },
                { icon: '🇪🇸', label: 'Español', action: 'dead' },
                { icon: '⬅️', label: '戻る', action: 'back' },
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
                                    flex flex-col items-center justify-center gap-1
                                    text-2xl transition-all duration-200
                                    ${item.action === 'back'
                                        ? 'bg-gray-700 hover:bg-gray-600 col-span-3 aspect-auto py-2 flex-row gap-2'
                                        : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                                    }
                                    hover:scale-105 active:scale-95
                                `}
                            >
                                <span>{item.icon}</span>
                                {item.label && (
                                    <span className={`text-xs text-gray-300 ${item.action === 'back' ? '' : 'leading-tight'}`}>
                                        {item.label}
                                    </span>
                                )}
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
