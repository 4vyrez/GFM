/**
 * Monthly Specials Configuration
 * Special events and rewards that appear throughout the year
 * 
 * STREAK MILESTONES:
 * - 7 days: Erster Woche geschafft!
 * - 14 days: Zwei Wochen durchgehalten!
 * - 30 days: Ein ganzer Monat!
 * - 50 days: Mega-Streak!
 * - 100 days: Legendärer Streak!
 */

export const specials = [
    // === STREAK MILESTONE SPECIALS ===
    {
        id: "milestone-7",
        name: "Erste Woche!",
        type: "milestone",
        description: "Du hast eine ganze Woche durchgehalten! 💪",
        triggerType: "streak",
        triggerValue: 7,
        icon: "🌟",
        reward: {
            title: "7-Tage Champion",
            message: "Eine Woche lang jeden dritten Tag da gewesen - das zeigt echte Liebe! 💕",
            emoji: "⭐",
            animation: "sparkle",
        },
    },
    {
        id: "milestone-14",
        name: "Zwei Wochen!",
        type: "milestone",
        description: "Zwei Wochen Streak - unglaublich!",
        triggerType: "streak",
        triggerValue: 14,
        icon: "💎",
        reward: {
            title: "2-Wochen Diamant",
            message: "Zwei Wochen lang an mich gedacht - du bist die Beste! 💎",
            emoji: "💎",
            animation: "shine",
        },
    },
    {
        id: "milestone-30",
        name: "Ein Monat!",
        type: "milestone",
        description: "Ein ganzer Monat Streak!",
        triggerType: "streak",
        triggerValue: 30,
        icon: "🎟️",
        reward: {
            title: "Date Ticket",
            message: "Du hast dir ein besonderes Date verdient!",
            emoji: "🎟️",
            animation: "confetti",
        },
        dateIdea: {
            title: "Romantischer Abend",
            description: "Ein gemütlicher Zeitpunkt für uns beide, für ein Date deiner Wahl ❤️",
            emoji: "🌹",
        },
    },
    {
        id: "milestone-50",
        name: "50 Tage!",
        type: "milestone",
        description: "50 Tage Streak - Mega!",
        triggerType: "streak",
        triggerValue: 50,
        icon: "🏆",
        reward: {
            title: "Goldpokal",
            message: "50 Tage! Du bist unschlagbar! Hier ist dein Gold-Award! 🏆",
            emoji: "�",
            animation: "trophy",
        },
        dateIdea: {
            title: "Überraschungs-Ausflug",
            description: "Ein spontaner Ausflug zum Turmberg, oder einen Ort den du schon immer besuchen wolltest mit mir? 🗺️✨",
            emoji: "🚗",
        },
    },
    {
        id: "milestone-100",
        name: "100 Tage!",
        type: "milestone",
        description: "LEGENDÄR! 100 Tage Streak!",
        triggerType: "streak",
        triggerValue: 100,
        icon: "👑",
        reward: {
            title: "Legendärer Status",
            message: "100 TAGE! Du bist eine lebende Legende der Liebe! 👑✨",
            emoji: "👑",
            animation: "legendary",
        },
        dateIdea: {
            title: "Großes Abenteuer",
            description: "Ein unvergessliches Abenteuer deiner Wahl mit mir 🌍💫",
            emoji: "🎢",
        },
    },

    // === DATE TICKET SPECIALS (Additional) ===
    {
        id: "date-ticket-60",
        name: "Date Ticket",
        type: "unlock",
        description: "Noch ein besonderes Date!",
        triggerType: "streak",
        triggerValue: 60,
        icon: "🎟️",
        dateIdea: {
            title: "Date am Schloss",
            description: "Ein romantisches Nachtdate am Schloss, nur wir zwei 🌌🧺",
            emoji: "⭐",
        },
    },
    {
        id: "date-ticket-90",
        name: "Date Ticket",
        type: "unlock",
        description: "Das dritte besondere Date!",
        triggerType: "streak",
        triggerValue: 90,
        icon: "🎟️",
        dateIdea: {
            title: "Date am Turmberg",
            description: "Ein entspannender Tag nur für uns am Turmberg 🏔️",
            emoji: "🏔️",
        },
    },
];

/**
 * Get special by ID
 */
export const getSpecialById = (id) => {
    return specials.find(special => special.id === id);
};

/**
 * Get specials by type
 */
export const getSpecialsByType = (type) => {
    return specials.filter(special => special.type === type);
};

/**
 * Check if a special should be triggered
 */
export const checkSpecialTrigger = (streak, totalVisits, unlockedSpecials = []) => {
    const triggeredSpecials = [];

    specials.forEach(special => {
        // Skip if already unlocked
        if (unlockedSpecials.includes(special.id)) return;

        if (special.triggerType === "always") {
            // Persistent specials like growing flower
            triggeredSpecials.push(special);
        } else if (special.triggerType === "streak" && streak >= special.triggerValue) {
            // Unlock-based specials triggered by streak
            triggeredSpecials.push(special);
        }
    });

    return triggeredSpecials;
};

/**
 * Get flower stage based on total visits
 */
export const getFlowerStage = (totalVisits) => {
    const flower = specials.find(s => s.id === "growing-flower");
    if (!flower) return null;

    // Find the highest stage reached
    const stages = [...flower.stages].reverse();
    const currentStage = stages.find(stage => totalVisits >= stage.visitsRequired);

    return currentStage || flower.stages[0];
};
