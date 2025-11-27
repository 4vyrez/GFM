// LocalStorage key
const STORAGE_KEY = 'gfm_app_data';

// Special Message for Streak 18
const SPECIAL_MESSAGE_ID = 'special_18';
const SPECIAL_MESSAGE_TEXT = "Heute wirst du deine 18te Flamme bekommen, daran ist etwas sehr besonders, da es mich an einen meiner Aufregensten und Schönsten Tage erinnert. Den 07.11. An dem Zeitpunkt als du das erste Mal aus der Bahn gestiegen bist und zu mir gelaufen bist und ich mir direkt sicher war das du das bist was ich mir vorstelle.";

// Default data structure
const defaultData = {
    lastVisit: null,
    streak: 0,
    streakFreezes: 1, // Legacy
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
 * Returns { success: boolean, newStreak: number, alreadyCompleted: boolean }
 */
export const completeChallengeForToday = () => {
    const data = getData();
    const today = getTodayDate();

    // Check if we are in a valid cycle to complete
    // If nextAvailableDate is in the future, we can't complete it again
    if (data.nextAvailableDate && data.nextAvailableDate > today && data.lastStreakUpdateDate === today) {
        return { success: false, newStreak: data.streak, alreadyCompleted: true };
    }

    // Double check: if we already updated streak today? 
    // Actually, with 3-day cycle, we update streak, then set nextAvailableDate to +3 days.
    // So if today < nextAvailableDate, it's locked.

    // Wait, if I complete it today, nextAvailableDate becomes today + 3.
    // So subsequent calls today will fail because today < today+3.

    // But we need to allow the FIRST completion.
    // Logic: If lastStreakUpdateDate == today, it's done.

    if (data.lastStreakUpdateDate === today) {
        return { success: true, newStreak: data.streak, alreadyCompleted: true };
    }

    // Increase streak
    const newStreak = data.streak + 1;
    const nextDate = addDays(today, 3);

    const updatedData = {
        ...data,
        streak: newStreak,
        lastStreakUpdateDate: today,
        nextAvailableDate: nextDate,
    };

    saveData(updatedData);
    return { success: true, newStreak: newStreak, alreadyCompleted: false };
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
