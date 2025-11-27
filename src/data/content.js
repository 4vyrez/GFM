// Photo pool - Add your actual photo filenames here
export const photos = [
    { id: 1, filename: 'photo1.jpg', alt: 'Uns zwei zusammen' },
    { id: 2, filename: 'photo2.jpg', alt: 'Schöne Erinnerung' },
    { id: 3, filename: 'photo3.jpg', alt: 'Gemeinsame Zeit' },
    // TODO: Add more photos
];

// Loving messages, compliments, and insider jokes
export const messages = [
    { id: 1, text: 'Du bist das Schönste in meinem Leben ❤️' },
    { id: 2, text: 'Dein Lächeln macht jeden Tag perfekt ✨' },
    { id: 3, text: 'Danke, dass es dich gibt 💕' },
    { id: 4, text: 'Mit dir ist alles besser 🌸' },
    { id: 5, text: 'Du bist wundervoll, genau so wie du bist 🌺' },
    // TODO: Add more personalized messages
];

// Minigame configuration
export const minigames = [
    {
        id: 'tictactoe',
        name: 'Tic-Tac-Toe',
        frequency: 3, // Appears every 3 days
        component: 'TicTacToe'
    },
    // Future games can be added here
];

// Helper function to get random item from array
export const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

// Helper function to determine if a minigame should appear today
export const shouldShowMinigame = (dayNumber) => {
    // Show minigame every 3rd day
    return dayNumber % 3 === 0;
};
