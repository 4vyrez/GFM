import { games, getGameById } from '../data/games';
import { getNextPhoto } from '../data/content';

// LocalStorage key
const STORAGE_KEY = 'gfm_app_data';

// Special Message for Streak 18
const SPECIAL_MESSAGE_ID = 'special_18';
const SPECIAL_MESSAGE_TEXT = "Heute wirst du deine 18te Flamme bekommen, daran ist etwas sehr besonders, da es mich an einen meiner Aufregensten und Schönsten Tage erinnert. Den 07.11. An dem Zeitpunkt als du das erste Mal aus der Bahn gestiegen bist und zu mir gelaufen bist und ich mir direkt sicher war das du das bist was ich mir vorstelle.";

// Default data structure
const defaultData = {
    lastVisit: null,
    streak: 0,
    longestStreak: 0, // Track best streak achieved
    streakFreezes: 0, // Start with 0
    freezesUsed: 0, // Track total freezes consumed
    lastStreakUpdateDate: null,
    nextAvailableDate: null, // When the next challenge/content is available
    totalVisits: 0, // Track total visits for specials
    playedGames: [], // History of played games: [{ gameId, date, won, attempts }]
    gameResults: [], // Performance metrics: [{ gameId, metric, value, date, player }]
    unlockedSpecials: [], // IDs of unlocked specials
    currentGameId: null, // Current game available to play
    shownPhotoIds: [], // Track shown photos to prevent repeats
    shownMessageIds: [], // Track shown messages to prevent repeats
    moodReactions: {}, // Track mood reactions by date: { '2025-12-15': '❤️' }
    // Inventory system
    collectedBadges: [], // Badge IDs earned: ['milestone-7', 'milestone-14', ...]
    collectedTickets: [], // Ticket objects: [{ id, name, icon, description, used: false }]
    dailyContent: {
        date: null,
        cycleStartDate: null, // Track which cycle this content belongs to
        photoId: null,
        messageId: null,
        minigameId: null,
        isSpecial: false,
    },
};

/**
 * Get cached data from localStorage (for fast initial load)
 */
const getCachedData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? { ...defaultData, ...JSON.parse(data) } : defaultData;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultData;
    }
};

/**
 * Save data to localStorage cache
 */
const saveCachedData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
};

/**
 * Fetch data from server API (async)
 * Falls back to localStorage cache if API fails
 */
export const fetchData = async () => {
    const cached = getCachedData();
    try {
        const res = await fetch('/api/state', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
            console.warn('API fetch failed, using cached data');
            return cached;
        }
        const serverData = await res.json();
        // Merge server data with defaults and cache locally
        const mergedData = { ...defaultData, ...serverData };
        saveCachedData(mergedData);
        return mergedData;
    } catch (error) {
        console.error('Error fetching from API:', error);
        return cached; // Offline fallback
    }
};

/**
 * Sync data to server API (async)
 * Also saves to localStorage for immediate local access
 */
export const syncData = async (data) => {
    // Always save locally first for immediate access
    saveCachedData(data);
    try {
        await fetch('/api/state', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Sync failed, data cached locally:', error);
    }
};

/**
 * Get data synchronously from cache (legacy compatibility)
 * @deprecated Use fetchData() for async cloud-synced data
 */
export const getData = () => {
    return getCachedData();
};

/**
 * Save data synchronously to cache and async to server
 * This maintains backwards compatibility while adding cloud sync
 */
export const saveData = (data) => {
    saveCachedData(data);
    // Fire-and-forget sync to server
    syncData(data).catch(err => console.error('Background sync failed:', err));
};



/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if user visited yesterday (for streak calculation)
 */
export const visitedYesterday = (lastVisit) => {
    if (!lastVisit) return false;
    const today = getTodayDate();
    const daysDiff = daysBetween(lastVisit, today);
    return daysDiff === 1;
};

/**
 * Check for streak loss due to missed cycles
 * Returns updated data object
 */
export const checkStreakLoss = (data) => {
    if (!data.lastStreakUpdateDate) return data;

    const today = getTodayDate();
    const daysSinceUpdate = daysBetween(data.lastStreakUpdateDate, today);

    // Cycle is 3 days. 
    // Day 0: Update.
    // Day 1, 2: Wait.
    // Day 3: Available.
    // Day 4: Missed (1 day late).

    // If daysSinceUpdate > 3, we missed the window.
    // We allow 1 day grace? The user said "If you don't play, it's deleted".
    // Let's assume strict 24h window on Day 3.
    // So if daysSinceUpdate >= 4, we have a problem.

    if (daysSinceUpdate >= 4) {
        const missedCycles = Math.floor((daysSinceUpdate - 1) / 3); // Rough estimate of missed opportunities
        // Actually, simpler: If we are late, we consume freezes.
        // For every day late? Or just one freeze per missed cycle?
        // Let's say 1 freeze saves the streak.

        if (data.streakFreezes > 0) {
            // Consume freeze
            return {
                ...data,
                streakFreezes: data.streakFreezes - 1,
                lastStreakUpdateDate: today, // Pretend we updated today to save it? 
                // No, that would give free points. 
                // We just update the "lastStreakUpdateDate" to "3 days ago" so they can play NOW?
                // Or we just decrement freeze and keep waiting?

                // Better: If they missed it, they use a freeze to KEEP the streak number, 
                // but they still need to play to increase it.
                // We don't reset streak.
                // But we need to update 'lastStreakUpdateDate' to avoid checking this again immediately?
                // Actually, if they login today (Day 5), and we use a freeze.
                // They can play today.
                // So we just decrement freeze.
                streakFreezes: data.streakFreezes - 1,
                // We don't change dates, so they can play immediately.
            };
        } else {
            // No freezes left -> Reset streak
            return {
                ...data,
                streak: 0,
            };
        }
    }

    return data;
};

/**
 * Check if user visited today already
 */
export const visitedToday = (lastVisit) => {
    if (!lastVisit) return false;
    return lastVisit === getTodayDate();
};

/**
 * Add days to a date
 */
export const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

/**
 * Check if content should be refreshed (3-day cycle)
 */
export const isContentRefreshDue = (data) => {
    if (!data.nextAvailableDate) return true; // First time
    const today = getTodayDate();
    return today >= data.nextAvailableDate;
};

/**
 * Get the next game for the current cycle
 * Uses weighted scheduling: unplayed games get higher probability
 * - Never played: 3x weight
 * - Played once: 2x weight  
 * - Played 2+ times: 1x weight
 */
export const getNextGameForCycle = (data) => {
    const { playedGames = [], streak = 0 } = data;
    const today = getTodayDate();

    // Count how many times each game was played
    const playCount = {};
    playedGames.forEach(pg => {
        playCount[pg.gameId] = (playCount[pg.gameId] || 0) + 1;
    });

    // Determine difficulty tier based on streak
    // 0-9: easy, 10-29: medium, 30+: mix of all
    let preferredDifficulty;
    if (streak < 10) {
        preferredDifficulty = 'easy';
    } else if (streak < 30) {
        preferredDifficulty = 'medium';
    } else {
        preferredDifficulty = null;
    }

    // Filter by preferred difficulty if set
    let filteredPool = games;
    if (preferredDifficulty) {
        const difficultyGames = games.filter(g => g.difficulty === preferredDifficulty);
        if (difficultyGames.length > 0) {
            filteredPool = difficultyGames;
        }
    }

    // Build weighted pool
    // Games never played: add 3 times
    // Games played once: add 2 times
    // Games played 2+ times: add 1 time
    const weightedPool = [];
    filteredPool.forEach(game => {
        const count = playCount[game.id] || 0;
        let weight;
        if (count === 0) {
            weight = 3; // Never played - highest chance
        } else if (count === 1) {
            weight = 2; // Played once
        } else {
            weight = 1; // Played multiple times
        }

        for (let i = 0; i < weight; i++) {
            weightedPool.push(game);
        }
    });

    // Select random from weighted pool
    return weightedPool[Math.floor(Math.random() * weightedPool.length)];
};

/**
 * Check if user has already completed the challenge today
 */
export const hasCompletedChallengeToday = (data) => {
    const today = getTodayDate();
    return data.lastStreakUpdateDate === today;
};

/**
 * Mark the challenge as completed
 * Returns { success: boolean, newStreak: number, alreadyCompleted: boolean, freezeEarned: boolean }
 */
export const completeChallengeForToday = (gameData = {}) => {
    const data = getData();
    const today = getTodayDate();

    if (data.nextAvailableDate && data.nextAvailableDate > today && data.lastStreakUpdateDate === today) {
        return { success: false, newStreak: data.streak, alreadyCompleted: true, freezeEarned: false };
    }

    if (data.lastStreakUpdateDate === today) {
        return { success: true, newStreak: data.streak, alreadyCompleted: true, freezeEarned: false };
    }

    // Increase streak
    const newStreak = data.streak + 1;
    const nextDate = addDays(today, 3);

    // Freeze Drop Logic: 33% chance, max 3
    let newFreezes = data.streakFreezes;
    let freezeEarned = false;

    if (newFreezes < 3) {
        const roll = Math.random();
        if (roll < 0.33) {
            newFreezes += 1;
            freezeEarned = true;
        }
    }

    // Add game to history
    const playedGames = data.playedGames || [];
    playedGames.push({
        gameId: gameData.gameId || data.currentGameId || 'unknown',
        date: today,
        won: true,
        attempts: gameData.attempts || 1,
        completionTime: gameData.time || null,
    });

    const updatedData = {
        ...data,
        streak: newStreak,
        streakFreezes: newFreezes,
        lastStreakUpdateDate: today,
        nextAvailableDate: nextDate,
        playedGames,
    };

    saveData(updatedData);
    return { success: true, newStreak: newStreak, alreadyCompleted: false, freezeEarned: freezeEarned };
};

/**
 * Admin: Reset everything
 */
export const adminResetApp = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
};

/**
 * Admin: Force next cycle immediately
 */
export const adminForceNextCycle = () => {
    const data = getData();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const updatedData = {
        ...data,
        nextAvailableDate: getTodayDate(), // Available now
        lastStreakUpdateDate: yesterday.toISOString().split('T')[0], // Allow update
        currentGameId: null, // Clear current game to force refresh
        dailyContent: { ...defaultData.dailyContent } // Clear daily content to force refresh
    };
    saveData(updatedData);
    window.location.reload();
};

/**
 * Admin: Set specific streak
 */
export const adminSetStreak = (streak) => {
    const data = getData();
    const updatedData = { ...data, streak: streak };
    saveData(updatedData);
    window.location.reload();
};

export const SPECIAL_MESSAGE = {
    id: SPECIAL_MESSAGE_ID,
    text: SPECIAL_MESSAGE_TEXT
};

/**
 * Save a game result for comparison
 * @param {string} gameId - The game identifier
 * @param {string} metric - The metric type (e.g., 'moves', 'milliseconds', 'attempts')
 * @param {number} value - The performance value
 */
export const saveGameResult = (gameId, metric, value) => {
    const data = getData();
    const today = getTodayDate();

    const gameResults = data.gameResults || [];
    gameResults.push({
        gameId,
        metric,
        value,
        date: today,
        player: 'user'
    });

    const updatedData = {
        ...data,
        gameResults
    };

    saveData(updatedData);
};

/**
 * Get comparison data for a game
 * Returns { user: { metric, value }, partner: { metric, value } }
 * Partner data is dummy until real data is available
 */
export const getGameComparison = (gameId) => {
    const data = getData();
    const game = getGameById(gameId);

    if (!game) return null;

    // Get user's most recent result for this game
    const gameResults = data.gameResults || [];
    const userResults = gameResults.filter(r => r.gameId === gameId && r.player === 'user');
    const userResult = userResults.length > 0 ? userResults[userResults.length - 1] : null;

    // Get partner data (dummy for now)
    const partnerResult = game.dummyPartnerScore || { metric: 'unknown', value: 0 };

    return {
        user: userResult ? { metric: userResult.metric, value: userResult.value } : null,
        partner: partnerResult
    };
};

/**
 * Get metric label in German
 */
export const getMetricLabel = (metric) => {
    const labels = {
        'moves': 'Züge',
        'milliseconds': 'Millisekunden',
        'attempts': 'Versuche',
        'level': 'Level',
        'flips': 'Züge',
        'seconds': 'Sekunden',
        'correct': 'Richtige Antworten'
    };
    return labels[metric] || metric;
};

/**
 * Format metric value for display
 */
export const formatMetricValue = (metric, value) => {
    switch (metric) {
        case 'milliseconds':
            return `${value}ms`;
        case 'seconds':
            return `${value}s`;
        default:
            return value.toString();
    }
};

