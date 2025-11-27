// LocalStorage key
const STORAGE_KEY = 'gfm_app_data';

// Default data structure
const defaultData = {
    lastVisit: null,
    streak: 0,
    streakFreezes: 1, // Legacy field, keeping for compatibility
    lastStreakUpdateDate: null, // New field to track daily challenge success
    dailyContent: {
        date: null,
        photoId: null,
        messageId: null,
        minigameId: null,
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
 * Mark the challenge as completed for today and update streak
 * Returns { success: boolean, newStreak: number, alreadyCompleted: boolean }
 */
export const completeChallengeForToday = () => {
    const data = getData();
    const today = getTodayDate();

    // If already completed today, don't increase streak again
    if (data.lastStreakUpdateDate === today) {
        return { success: true, newStreak: data.streak, alreadyCompleted: true };
    }

    // Increase streak
    const newStreak = data.streak + 1;

    const updatedData = {
        ...data,
        streak: newStreak,
        lastStreakUpdateDate: today,
    };

    saveData(updatedData);
    return { success: true, newStreak: newStreak, alreadyCompleted: false };
};
