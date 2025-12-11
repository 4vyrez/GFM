/**
 * Games Registry
 * Centralized configuration for all mini-games in the app
 */

export const games = [
    // === QUICK GAMES (30-60 seconds) ===
    {
        id: "reaction-race-1",
        type: "reaction",
        name: "Reaction Race",
        description: "Klick genau im richtigen Moment!",
        difficulty: "easy",
        estimatedDuration: "30 Sek",
        component: "ReactionRace",
        tags: ["reflex", "quick", "skill"],
        dummyPartnerScore: { metric: "milliseconds", value: 310 },
    },
    {
        id: "find-the-heart-1",
        type: "find-heart",
        name: "Herz Suchen",
        description: "Finde das versteckte Herz!",
        difficulty: "easy",
        estimatedDuration: "45 Sek",
        component: "FindTheHeart",
        tags: ["puzzle", "cute", "quick"],
        dummyPartnerScore: { metric: "attempts", value: 4 },
    },
    {
        id: "color-match-1",
        type: "color-match",
        name: "Farben Merken",
        description: "Merke dir die Farbreihenfolge!",
        difficulty: "medium",
        estimatedDuration: "60 Sek",
        component: "ColorMatch",
        tags: ["memory", "colors", "quick"],
        dummyPartnerScore: { metric: "level", value: 5 },
    },
    {
        id: "number-guess-1",
        type: "number-guess",
        name: "Zahlen Raten",
        description: "Errate meine Zahl!",
        difficulty: "easy",
        estimatedDuration: "60 Sek",
        component: "NumberGuess",
        tags: ["logic", "guessing", "fun"],
        dummyPartnerScore: { metric: "attempts", value: 13 },
    },

    // === MEDIUM GAMES (2-3 minutes) ===
    {
        id: "tictactoe-1",
        type: "tictactoe",
        name: "Tic-Tac-Toe",
        description: "Klassisches Strategiespiel gegen mich!",
        difficulty: "medium",
        estimatedDuration: "2-3 Min",
        component: "TicTacToe",
        tags: ["strategy", "classic", "pvp"],
        dummyPartnerScore: { metric: "moves", value: 4 },
    },
    {
        id: "memory-cards-1",
        type: "memory",
        name: "Memory",
        description: "Finde alle Paare!",
        difficulty: "medium",
        estimatedDuration: "2-3 Min",
        component: "MemoryCards",
        tags: ["memory", "classic", "matching"],
        dummyPartnerScore: { metric: "flips", value: 24 },
    },

    // === LONGER GAMES (3-5 minutes) ===
    {
        id: "word-puzzle-1",
        type: "word-puzzle",
        name: "Wort Suche",
        description: "Finde versteckte Wörter!",
        difficulty: "medium",
        estimatedDuration: "3-4 Min",
        component: "WordPuzzle",
        tags: ["words", "puzzle", "search"],
        dummyPartnerScore: { metric: "seconds", value: 26.3 },
    },
    {
        id: "emoji-story-1",
        type: "emoji-story",
        name: "Emoji Geschichte",
        description: "Erstelle eine süße Geschichte!",
        difficulty: "easy",
        estimatedDuration: "2-3 Min",
        component: "EmojiStory",
        tags: ["creative", "emoji", "story"],
        dummyPartnerScore: { metric: "seconds", value: 98 },
    },
    {
        id: "quiz-1",
        type: "quiz",
        name: "Unser Quiz",
        description: "Wie gut kennst du uns?",
        difficulty: "hard",
        estimatedDuration: "3-5 Min",
        component: "QuizGame",
        tags: ["personal", "quiz", "relationship"],
        dummyPartnerScore: { metric: "correct", value: 7 },
    },
];

/**
 * Get a random game from the pool
 * (Basic random selection - will be enhanced with scheduling logic)
 */
export const getRandomGame = () => {
    return games[Math.floor(Math.random() * games.length)];
};

/**
 * Get game by ID
 */
export const getGameById = (id) => {
    return games.find(game => game.id === id);
};

/**
 * Get games by difficulty
 */
export const getGamesByDifficulty = (difficulty) => {
    return games.filter(game => game.difficulty === difficulty);
};

/**
 * Get games by tag
 */
export const getGamesByTag = (tag) => {
    return games.filter(game => game.tags.includes(tag));
};
