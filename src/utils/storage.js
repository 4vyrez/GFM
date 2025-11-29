// LocalStorage key
const STORAGE_KEY = 'gfm_app_data';

// Special Message for Streak 18
const SPECIAL_MESSAGE_ID = 'special_18';
const SPECIAL_MESSAGE_TEXT = "Heute wirst du deine 18te Flamme bekommen, daran ist etwas sehr besonders, da es mich an einen meiner Aufregensten und Schönsten Tage erinnert. Den 07.11. An dem Zeitpunkt als du das erste Mal aus der Bahn gestiegen bist und zu mir gelaufen bist und ich mir direkt sicher war das du das bist was ich mir vorstelle.";

// Default data structure
const defaultData = {
    lastVisit: null,
    streak: 0,
    streakFreezes: 0, // Start with 0
    lastStreakUpdateDate: null,
    nextAvailableDate: null, // When the next challenge/content is available
    dailyContent: {
        date: null,
        photoId: null,
        messageId: null,
        minigameId: null,
        isSpecial: false,
    },
};

/**
 * Get data from localStorage
 */
export const getData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? { ...defaultData, ...JSON.parse(data) } : defaultData;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultData;
    }
};

/**
 * Save data to localStorage
 */
export const saveData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
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
 * Mark the challenge as completed
 * Returns { success: boolean, newStreak: number, alreadyCompleted: boolean, freezeEarned: boolean }
 */
export const completeChallengeForToday = () => {
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

    const updatedData = {
        ...data,
        streak: newStreak,
        streakFreezes: newFreezes,
        lastStreakUpdateDate: today,
        nextAvailableDate: nextDate,
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
