import { useState } from 'react';
import {
    adminResetApp,
    adminForceNextCycle,
    adminSetStreak,
    getData,
    saveData,
} from '../utils/storage';
import { games } from '../data/games';
import { specials } from '../data/specials';

const AdminPanel = ({ onClose, onTestGame, currentAppData }) => {
    const [selectedGameId, setSelectedGameId] = useState('');

    const handleTestGame = () => {
        if (selectedGameId) {
            onTestGame(selectedGameId);
        }
    };

    const handleTriggerSpecial = (specialId) => {
        const data = getData();
        const updatedData = {
            ...data,
            unlockedSpecials: [...(data.unlockedSpecials || []), specialId],
        };
        saveData(updatedData);
        alert(`Special "${specialId}" aktiviert! Lade neu um es zu sehen.`);
    };

    const handleFreezeChange = (delta) => {
        const data = getData();
        const newFreezes = Math.max(0, Math.min(3, (data.streakFreezes || 0) + delta));
        saveData({ ...data, streakFreezes: newFreezes });
        window.location.reload();
    };

    const handleClearGameHistory = () => {
        if (confirm('Wirklich die gesamte Game-Historie löschen?')) {
            const data = getData();
            saveData({ ...data, playedGames: [] });
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-100 overflow-y-auto overflow-x-hidden z-50">
            <div className="min-h-full p-8">
                <div className="max-w-5xl mx-auto pb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">🛠️ Admin Dashboard</h1>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-500 text-white font-medium rounded-xl hover:bg-gray-600 transition-all"
                        >
                            ← Zurück zur App
                        </button>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Current State */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                📊 Aktueller Status
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Streak:</span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        🔥 {currentAppData.streak}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Freezes:</span>
                                    <span className="text-lg font-bold text-blue-500">
                                        ❄️ {currentAppData.streakFreezes || 0}/3
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Besuche:</span>
                                    <span className="text-lg font-semibold text-green-600">
                                        {currentAppData.totalVisits || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Games gespielt:</span>
                                    <span className="text-lg font-semibold text-purple-600">
                                        {currentAppData.playedGames?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Nächstes Game:</span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {currentAppData.nextAvailableDate || 'Heute'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600 font-medium">Verfügbare Games:</span>
                                    <span className="text-lg font-semibold text-indigo-600">
                                        🎮 {games.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Game Tester */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                🎮 Game Tester
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Wähle ein beliebiges Game aus und teste es:
                            </p>
                            <select
                                value={selectedGameId}
                                onChange={(e) => setSelectedGameId(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl mb-4 focus:border-pastel-lavender focus:outline-none"
                            >
                                <option value="">-- Game wählen --</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>
                                        {game.name} ({game.difficulty})
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleTestGame}
                                disabled={!selectedGameId}
                                className="w-full px-6 py-3 bg-pastel-lavender text-white font-medium rounded-xl hover:bg-pastel-lavender/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Game jetzt laden
                            </button>
                            <p className="text-xs text-gray-500 mt-3">
                                ℹ️ Aktuelles Game: <strong>{currentAppData.currentGameId || 'Keins'}</strong>
                            </p>
                        </div>

                        {/* Streak Controls */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                🔥 Streak & Milestone Tester
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Setze Streak auf Milestone-1, dann spiele ein Game um den Milestone zu testen:
                            </p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <button
                                    onClick={() => adminSetStreak(6)}
                                    className="px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-xl hover:bg-yellow-200 transition-all text-sm"
                                >
                                    🌟 → 7 Tage
                                </button>
                                <button
                                    onClick={() => adminSetStreak(13)}
                                    className="px-4 py-2 bg-cyan-100 text-cyan-700 font-medium rounded-xl hover:bg-cyan-200 transition-all text-sm"
                                >
                                    💎 → 14 Tage
                                </button>
                                <button
                                    onClick={() => adminSetStreak(29)}
                                    className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 transition-all text-sm"
                                >
                                    🎟️ → 30 Tage
                                </button>
                                <button
                                    onClick={() => adminSetStreak(49)}
                                    className="px-4 py-2 bg-orange-100 text-orange-700 font-medium rounded-xl hover:bg-orange-200 transition-all text-sm"
                                >
                                    🏆 → 50 Tage
                                </button>
                                <button
                                    onClick={() => adminSetStreak(99)}
                                    className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-xl hover:bg-purple-200 transition-all text-sm"
                                >
                                    👑 → 100 Tage
                                </button>
                                <button
                                    onClick={() => adminSetStreak(0)}
                                    className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-xl hover:bg-red-200 transition-all text-sm"
                                >
                                    ↩️ Reset auf 0
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleFreezeChange(-1)}
                                    className="flex-1 px-4 py-3 bg-blue-400 text-white font-medium rounded-xl hover:bg-blue-500 transition-all"
                                >
                                    Freeze -1
                                </button>
                                <button
                                    onClick={() => handleFreezeChange(1)}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all"
                                >
                                    Freeze +1
                                </button>
                            </div>
                        </div>

                        {/* Cycle & State Controls */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                ⚙️ Cycle & State
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={adminForceNextCycle}
                                    className="w-full px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-all"
                                >
                                    ⏭️ Nächsten Cycle erzwingen
                                </button>
                                <button
                                    onClick={handleClearGameHistory}
                                    className="w-full px-6 py-3 bg-yellow-500 text-white font-medium rounded-xl hover:bg-yellow-600 transition-all"
                                >
                                    🗑️ Game-Historie löschen
                                </button>
                                <button
                                    onClick={adminResetApp}
                                    className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all"
                                >
                                    ⚠️ App komplett zurücksetzen
                                </button>
                            </div>
                        </div>

                        {/* Quick Access - Meme & Insider Games */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                🎭 Quick Access - Meme & Insider Games
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button
                                    onClick={() => onTestGame('language-chaos-1')}
                                    className="px-4 py-3 bg-indigo-100 text-indigo-700 font-medium rounded-xl hover:bg-indigo-200 transition-all"
                                >
                                    🎮 Language Chaos
                                </button>
                                <button
                                    onClick={() => onTestGame('captcha-cats-1')}
                                    className="px-4 py-3 bg-blue-100 text-blue-700 font-medium rounded-xl hover:bg-blue-200 transition-all"
                                >
                                    🐱 Captcha Cats
                                </button>
                                <button
                                    onClick={() => onTestGame('megalodon-quiz-1')}
                                    className="px-4 py-3 bg-cyan-100 text-cyan-700 font-medium rounded-xl hover:bg-cyan-200 transition-all"
                                >
                                    🦈 Megalodon Quiz
                                </button>
                                <button
                                    onClick={() => onTestGame('bite-meter-1')}
                                    className="px-4 py-3 bg-pink-100 text-pink-700 font-medium rounded-xl hover:bg-pink-200 transition-all"
                                >
                                    🦷 Biss-Meter
                                </button>
                                <button
                                    onClick={() => onTestGame('fake-update-1')}
                                    className="px-4 py-3 bg-purple-100 text-purple-700 font-medium rounded-xl hover:bg-purple-200 transition-all"
                                >
                                    💕 Love Update
                                </button>
                                <button
                                    onClick={() => onTestGame('meme-quiz-1')}
                                    className="px-4 py-3 bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 transition-all"
                                >
                                    🎮 Meme Quiz
                                </button>
                                <button
                                    onClick={() => onTestGame('button-chase-1')}
                                    className="px-4 py-3 bg-orange-100 text-orange-700 font-medium rounded-xl hover:bg-orange-200 transition-all"
                                >
                                    😈 Button Chase
                                </button>
                                <button
                                    onClick={() => onTestGame('streak-guardian-1')}
                                    className="px-4 py-3 bg-red-100 text-red-700 font-medium rounded-xl hover:bg-red-200 transition-all"
                                >
                                    🔥 Streak Guardian
                                </button>
                            </div>
                        </div>

                        {/* Monthly Specials */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                ✨ Monthly Specials
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {specials.filter(s => s.type === 'unlock').map((special) => (
                                    <button
                                        key={special.id}
                                        onClick={() => handleTriggerSpecial(special.id)}
                                        className="px-4 py-3 bg-pink-100 text-pink-700 font-medium rounded-xl hover:bg-pink-200 transition-all border-2 border-pink-300"
                                    >
                                        {special.icon} {special.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Raw Data */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                💾 Raw Data (localStorage)
                            </h2>
                            <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto max-h-96 font-mono">
                                {JSON.stringify(currentAppData, null, 2)}
                            </pre>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
