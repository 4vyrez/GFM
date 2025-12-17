/**
 * Games Registry
 * Centralized configuration for all mini-games in the app
 * Total: 25 games across multiple categories
 */

export const games = [
    // ============================================
    // === ORIGINAL GAMES ===
    // ============================================

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
        dummyPartnerScore: { metric: "seconds", value: 19 },
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

    // ============================================
    // === NEW GAMES: REFLEX / TIMING ===
    // ============================================
    {
        id: "charge-bar-1",
        type: "timing",
        name: "Charge Bar",
        description: "Halte und lass bei 100% los!",
        difficulty: "easy",
        estimatedDuration: "30 Sek",
        component: "ChargeBar",
        tags: ["reflex", "timing", "skill"],
        dummyPartnerScore: { metric: "attempts", value: 1 },
    },
    {
        id: "stop-the-bar-1",
        type: "timing",
        name: "Stop The Bar",
        description: "Stoppe in der grünen Zone!",
        difficulty: "medium",
        estimatedDuration: "30 Sek",
        component: "StopTheBar",
        tags: ["reflex", "timing", "precision"],
        dummyPartnerScore: { metric: "attempts", value: 1 },
    },
    {
        id: "simon-colors-1",
        type: "memory",
        name: "Simon Colors",
        description: "Merk dir die Farbreihenfolge!",
        difficulty: "medium",
        estimatedDuration: "60 Sek",
        component: "SimonColors",
        tags: ["memory", "colors", "sequence"],
        dummyPartnerScore: { metric: "attempts", value: 2 },
    },

    // ============================================
    // === NEW GAMES: UI / MEME ===
    // ============================================
    {
        id: "language-chaos-1",
        type: "meme",
        name: "Language Chaos",
        description: "Finde die Spracheinstellungen! 🎮",
        difficulty: "easy",
        estimatedDuration: "45 Sek",
        component: "LanguageChaos",
        tags: ["meme", "internet", "japanese-game"],
        dummyPartnerScore: { metric: "attempts", value: 3 },
    },
    {
        id: "captcha-cats-1",
        type: "meme",
        name: "Captcha Cats",
        description: "Wähle alle Katzen aus! 🐱",
        difficulty: "easy",
        estimatedDuration: "30 Sek",
        component: "CaptchaCats",
        tags: ["meme", "captcha", "cute"],
        dummyPartnerScore: { metric: "attempts", value: 1 },
    },
    {
        id: "button-chase-1",
        type: "meme",
        name: "Button Chase",
        description: "Fang den frechen Button! 😈",
        difficulty: "easy",
        estimatedDuration: "30 Sek",
        component: "ButtonChase",
        tags: ["meme", "reflex", "fun"],
        dummyPartnerScore: { metric: "seconds", value: 4.2 },
    },
    {
        id: "fake-update-1",
        type: "meme",
        name: "Love Update",
        description: "Installiere das Love-Update! 💕",
        difficulty: "easy",
        estimatedDuration: "20 Sek",
        component: "FakeUpdate",
        tags: ["meme", "cute", "fun", "auto-win"],
        dummyPartnerScore: { metric: "seconds", value: 15 },
    },

    // ============================================
    // === NEW GAMES: MEMORY / PUZZLE ===
    // ============================================
    {
        id: "sequence-memory-1",
        type: "memory",
        name: "Emoji Sequenz",
        description: "Merk dir die Emoji-Reihenfolge!",
        difficulty: "medium",
        estimatedDuration: "60 Sek",
        component: "SequenceMemory",
        tags: ["memory", "emoji", "sequence"],
        dummyPartnerScore: { metric: "attempts", value: 2 },
    },
    {
        id: "path-finder-1",
        type: "puzzle",
        name: "Pfadfinder",
        description: "Finde den Weg durch das Labyrinth!",
        difficulty: "easy",
        estimatedDuration: "45 Sek",
        component: "PathFinder",
        tags: ["puzzle", "maze", "logic"],
        dummyPartnerScore: { metric: "steps", value: 11 },
    },

    // ============================================
    // === NEW GAMES: WORD / INSIDER / QUIZ ===
    // ============================================
    {
        id: "love-code-1",
        type: "word",
        name: "Love Code",
        description: "Sortiere die Wörter richtig!",
        difficulty: "easy",
        estimatedDuration: "45 Sek",
        component: "LoveCode",
        tags: ["words", "puzzle", "love"],
        dummyPartnerScore: { metric: "attempts", value: 1 },
    },
    {
        id: "megalodon-quiz-1",
        type: "insider",
        name: "Megalodon Quiz",
        description: "Wo liegt die Betonung? 🦈",
        difficulty: "easy",
        estimatedDuration: "30 Sek",
        component: "MegalodonQuiz",
        tags: ["insider", "quiz", "fun"],
        dummyPartnerScore: { metric: "correct", value: 1 },
    },
    {
        id: "meme-quiz-1",
        type: "quiz",
        name: "Meme Quiz",
        description: "Kennst du deine Memes? 🎮",
        difficulty: "medium",
        estimatedDuration: "2 Min",
        component: "MemeQuiz",
        tags: ["meme", "quiz", "gaming"],
        dummyPartnerScore: { metric: "correct", value: 4 },
    },

    // ============================================
    // === NEW GAMES: EMOTIONAL / EASY ===
    // ============================================
    {
        id: "bubble-pop-1",
        type: "relaxing",
        name: "Bubble Pop",
        description: "Pop die Bubbles! Anti-Stress 🫧",
        difficulty: "easy",
        estimatedDuration: "30 Sek",
        component: "BubblePop",
        tags: ["relaxing", "cute", "easy"],
        dummyPartnerScore: { metric: "bubbles", value: 5 },
    },
    {
        id: "compliment-reveal-1",
        type: "emotional",
        name: "Komplimente",
        description: "Entdecke Komplimente! 💝",
        difficulty: "easy",
        estimatedDuration: "30 Sek",
        component: "ComplimentReveal",
        tags: ["emotional", "cute", "love"],
        dummyPartnerScore: { metric: "reveals", value: 3 },
    },
    {
        id: "bite-meter-1",
        type: "insider",
        name: "Biss-Meter",
        description: "Wie hoch ist dein Biss-Level heute bei mir? 🦷",
        difficulty: "easy",
        estimatedDuration: "20 Sek",
        component: "BiteMeter",
        tags: ["insider", "fun", "auto-win"],
        dummyPartnerScore: { metric: "level", value: 75 },
    },

    // ============================================
    // === NEW GAMES: META / STREAK ===
    // ============================================
    {
        id: "streak-guardian-1",
        type: "action",
        name: "Streak Guardian",
        description: "Beschütze die Flamme! 🔥",
        difficulty: "medium",
        estimatedDuration: "20 Sek",
        component: "StreakGuardian",
        tags: ["action", "streak", "meta"],
        dummyPartnerScore: { metric: "health", value: 85 },
    },

    // ============================================
    // === NEW GAMES: CREATIVE ADDITIONS ===
    // ============================================
    {
        id: "emoji-scramble-1",
        type: "puzzle",
        name: "Emoji Scramble",
        description: "Sortiere die Emojis richtig!",
        difficulty: "easy",
        estimatedDuration: "45 Sek",
        component: "EmojiScramble",
        tags: ["puzzle", "emoji", "word"],
        dummyPartnerScore: { metric: "attempts", value: 2 },
    },
    {
        id: "lucky-spin-1",
        type: "luck",
        name: "Glücksrad",
        description: "Dreh das Liebes-Glücksrad! 🎡",
        difficulty: "easy",
        estimatedDuration: "20 Sek",
        component: "LuckySpin",
        tags: ["luck", "fun", "prize"],
        dummyPartnerScore: { metric: "spins", value: 1 },
    },
    {
        id: "tap-rhythm-1",
        type: "rhythm",
        name: "Tap Rhythm",
        description: "Tippe im perfekten Takt! 🎵",
        difficulty: "medium",
        estimatedDuration: "45 Sek",
        component: "TapRhythm",
        tags: ["rhythm", "timing", "skill"],
        dummyPartnerScore: { metric: "score", value: 5 },
    },
    {
        id: "mirror-match-1",
        type: "memory",
        name: "Emoji Memory",
        description: "Finde alle Paare! 🔮",
        difficulty: "easy",
        estimatedDuration: "60 Sek",
        component: "MirrorMatch",
        tags: ["memory", "matching", "emoji"],
        dummyPartnerScore: { metric: "moves", value: 8 },
    },
    {
        id: "love-meter-1",
        type: "precision",
        name: "Love Meter",
        description: "Fülle das Herz auf 100%! 💕",
        difficulty: "medium",
        estimatedDuration: "30 Sek",
        component: "LoveMeter",
        tags: ["precision", "timing", "love"],
        dummyPartnerScore: { metric: "accuracy", value: 100 },
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
