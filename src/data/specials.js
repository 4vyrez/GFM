/**
 * Monthly Specials Configuration
 * Special events and rewards that appear throughout the year
 */

export const specials = [
    {
        id: "growing-flower",
        name: "Wachsende Blume",
        type: "persistent", // Grows over time
        description: "Eine Blume wächst mit jedem Besuch",
        triggerType: "always", // Always active
        icon: "🌱",
        stages: [
            { name: "Samen", emoji: "🌱", visitsRequired: 0 },
            { name: "Keim", emoji: "🌿", visitsRequired: 5 },
            { name: "Stängel", emoji: "🪴", visitsRequired: 10 },
            { name: "Knospe", emoji: "🥀", visitsRequired: 20 },
            { name: "Blume", emoji: "🌸", visitsRequired: 30 },
            { name: "Volle Blüte", emoji: "🌺", visitsRequired: 50 },
        ],
    },
    {
        id: "date-ticket-30",
        name: "Date Ticket",
        type: "unlock", // One-time unlock
        description: "Ein besonderes Date erwartet dich!",
        triggerType: "streak", // Triggered by streak milestone
        triggerValue: 30,
        icon: "🎟️",
        dateIdea: {
            title: "Romantischer Abend",
            description: "Ein gemütlicher Abend zu zweit mit Kerzen, gutem Essen und deiner Lieblingsmusik 🕯️❤️",
            emoji: "🌹",
        },
    },
    {
        id: "date-ticket-60",
        name: "Date Ticket",
        type: "unlock",
        description: "Noch ein besonderes Date!",
        triggerType: "streak",
        triggerValue: 60,
        icon: "🎟️",
        dateIdea: {
            title: "Überraschungs-Ausflug",
            description: "Ein spontaner Ausflug zu einem Ort, den du schon immer besuchen wolltest 🗺️✨",
            emoji: "🚗",
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
            title: "Picknick unter Sternen",
            description: "Ein romantisches Picknick unter dem Sternenhimmel, nur wir zwei 🌌🧺",
            emoji: "⭐",
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
