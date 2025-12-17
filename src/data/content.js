// Photo pool - dynamically generated from public/photos folder
// Each photo shows every 3 days = need 122 photos for a full year (365/3)
// Currently have 89 photos - need 33 more for complete year coverage

const photoFilenames = [
    '067A99D2-FCF7-4389-B225-F0416FD8F832_1_105_c.jpeg',
    '07FD296D-7145-40C0-98B7-D69319D4E8EF_1_105_c.jpeg',
    '123E238E-51AE-4301-AF96-6DCCD9A27828_1_105_c.jpeg',
    '135E3210-8028-4F5B-B7EC-BF5C770BD1FD_1_105_c.jpeg',
    '139FCD7B-BCE4-4992-BB7D-93679F100A4C_1_105_c.jpeg',
    '1736C48F-BAFF-4321-A1E7-9B21832E7872.jpeg',
    '1D111586-3BF0-4A03-AF7D-167C01910DB7_1_105_c.jpeg',
    '1FE4DA0F-568A-4026-9F7A-1290F379F5AC_1_105_c.jpeg',
    '24FCC11F-8BE5-4E7E-AE6C-84BF49C9135E_1_105_c.jpeg',
    '25CA4BC4-59DF-430C-8664-064DFE89EBF0_1_105_c.jpeg',
    '27BB1E5B-E5DA-4786-8C64-6B480072A7D2_1_105_c.jpeg',
    '2ACBD532-D42D-4BC0-A99D-06004384039A_1_105_c.jpeg',
    '2B11D00E-EC96-4B27-A2EB-39C3740ACA13_1_105_c.jpeg',
    '2BB30201-E18E-4998-A64B-4BF0E9385885_1_105_c.jpeg',
    '2C1DBE1E-0334-44C8-95BD-EBC6A91622A8_1_105_c.jpeg',
    '2E38F250-DDCD-4F6A-8FD4-1B3BF9889ABE_1_105_c.jpeg',
    '357ACB33-1D68-4640-9ADB-07B53336D794_1_105_c.jpeg',
    '3AE775AB-DCA4-469E-9986-BB0354785B5C_1_105_c.jpeg',
    '41F4639D-EB9B-4CB3-BADE-774681C5DC93_1_105_c.jpeg',
    '4242B2DA-C1E0-4745-BA56-3C746869FE02_1_105_c.jpeg',
    '44AF6861-66D5-4E33-8B7B-09ACD28F6CA8_1_105_c.jpeg',
    '46A5EC83-CD69-44EB-9A54-49C1E1AF9297_1_105_c.jpeg',
    '4A1EA5AC-80B3-4964-B40C-CC1F9FF7F778_1_105_c.jpeg',
    '4D5748E7-CD25-42AE-8E69-AD36CAB49616_1_105_c.jpeg',
    '4E2451B7-9DC7-4874-B260-A518061663F1_1_105_c.jpeg',
    '4d7f9262-a3e5-4ac0-80dc-56a9564607b5.jpeg',
    '53DFD440-B3EB-4C12-B23E-2C9D82A51FDC_1_105_c.jpeg',
    '5424509A-33C4-414C-A7B8-5899D3EB5F54_1_105_c.jpeg',
    '56442AF0-5C49-49D8-B692-53EC1F2826EA_1_105_c.jpeg',
    '5C6C52EC-411A-40BE-A43B-0EA83DB4C862_1_105_c.jpeg',
    '61E03B29-6B35-4E97-B346-134562E2324A_1_105_c.jpeg',
    '656234F4-EADF-4BAB-97B6-4F51E8FE0478_1_105_c.jpeg',
    '6CCB42B3-1764-4940-AD7E-B26F368F531C_1_105_c.jpeg',
    '7BA148AE-F38E-4CC8-BA52-02D1EAC875FF_1_105_c.jpeg',
    '7ED812BD-D66E-4C62-89F7-BB6FE93A8617_1_105_c.jpeg',
    '804F7EDF-298C-4BE9-A337-7AC196BAC9DB_1_105_c.jpeg',
    '817B63E2-3627-4D7C-B727-E8B9D3ABBE2D_1_105_c.jpeg',
    '81C3383E-29E2-44F1-9B40-71984DDCC8F0_1_105_c.jpeg',
    '83B084E7-A764-4F43-B948-47E6BE853993_1_105_c.jpeg',
    '86ABF1BC-0DDF-4E2C-970F-16808F627C72_1_105_c.jpeg',
    '86B78ED1-84D1-444A-9FB9-4C18BCB76127_1_105_c.jpeg',
    '8939E8EC-19BB-41D4-B507-4DA0878FE231_1_105_c.jpeg',
    '899F60A3-D1CB-4E1D-8D66-5D2440C17BAA_1_105_c.jpeg',
    '8C0DD7C6-7BFF-42C7-9513-BC93A72D1809_1_105_c.jpeg',
    '8C5FA37C-BDBB-4E28-BB31-77280C49D399_1_105_c.jpeg',
    '8D9E1854-62A1-4A41-9D8B-E543BEE3350F_1_105_c.jpeg',
    '8F9190BC-6F18-477B-8EED-17C73DEC3BE1_1_105_c.jpeg',
    '92EAB42D-B9ED-4F0F-A724-C08B2508D07D_1_105_c.jpeg',
    '95609207-9D88-443F-8197-0089F2981123.jpeg',
    '95A2A350-461C-423C-A065-3FF6E3EE7990_1_105_c.jpeg',
    '95F8C50D-E977-40A4-80C5-7BC2AEFB3784_1_105_c.jpeg',
    '99BE151E-CC1E-4556-BA1C-EEA27112E759_1_105_c.jpeg',
    'A2EC4FAD-D8E8-446D-ACE8-E259FEDF044C_1_105_c.jpeg',
    'A6A8F879-2651-4DF5-998E-7304D9609206_1_105_c.jpeg',
    'A75EA696-EE21-4E7E-AB0B-B108E7B0CF96_1_105_c.jpeg',
    'A84129D6-31F1-4829-B48D-D9F2112CD305_1_105_c.jpeg',
    'AB0675E8-D57C-4DD8-AC9E-2ECB93389A8E_1_105_c.jpeg',
    'AC2FAEBD-72DB-423B-A956-36AF48FB60CF_1_105_c.jpeg',
    'AE0FD103-54F6-4CEA-9425-E21799234045_1_105_c.jpeg',
    'B0430F78-794F-4F92-B3A0-6521DE3D856E_1_105_c.jpeg',
    'B1A22A1F-A4BA-4774-BE46-546D7900F5C1.jpeg',
    'B4BD961C-57A9-4D0E-9F66-C5BE81F6A487_1_105_c.jpeg',
    'B618C431-F621-4615-8A3B-1C44C05B6947_1_105_c.jpeg',
    'B81A6524-056F-4B97-AA5D-EC3DC80BA113_1_105_c.jpeg',
    'BBF535ED-E5BC-4345-BF8A-8968A3ADFEDE_1_105_c.jpeg',
    'BC344D36-2BD8-4EBD-A672-963280904302_1_105_c.jpeg',
    'C0D8DF64-B24D-46C2-BA2A-1B79C8DCCFD9_1_105_c.jpeg',
    'C347339B-9921-4593-BC1C-5F3E7E3E0972_1_105_c.jpeg',
    'C5F511C6-4302-4046-A353-0B49CDAB731A_1_105_c.jpeg',
    'D11E0277-2646-4B0F-9E97-7D1FFB68D135_1_105_c.jpeg',
    'D3ED683A-A93F-4738-A0FC-428D0925DC93_1_105_c.jpeg',
    'DC66A303-65FD-4B13-BD23-9F56038A6687_1_105_c.jpeg',
    'DCCEA850-B2B2-4B9C-A7A3-DE042532F322_1_105_c.jpeg',
    'E5F8431D-2A21-4740-9E38-900E5213569D_1_105_c.jpeg',
    'EA2EC970-17D9-40CC-9BDB-90AF6B1703E2_1_105_c.jpeg',
    'EF5297DB-EAFD-469A-817D-98453A74EDC3_1_105_c.jpeg',
    'F285838F-E5CE-4EE3-A103-5F8BF3026F3C_1_105_c.jpeg',
    'F3A753E5-4974-4EDC-9AA7-C90BEF89C3AC 2.jpeg',
    'F9584B00-5729-41BC-852C-71F5003F502E_1_105_c.jpeg',
    'IMG_0698.jpeg',
    'IMG_1421 2.jpeg',
    'IMG_2118 2.jpeg',
    'IMG_6605.jpeg',
    'd1a8c1e8-937e-43ef-8e66-15d72f1e9d71.jpeg',
];

// Generate photo objects from filenames (89 photos total, need 33 more for full year)
export const photos = photoFilenames.map((filename, index) => ({
    id: index + 1,
    filename: filename,
    alt: 'Schöne Erinnerung'
}));

// Loving messages, compliments, and insider jokes
export const messages = [
    { id: 1, text: 'Du bist das Schönste in meinem Leben ❤️' },
    { id: 2, text: 'Dein Lächeln macht mich so glücklich und du steckst mich immer wieder damit an' },
    { id: 3, text: 'Danke, dass es dich gibt 💕' },
    { id: 4, text: 'Mit dir ist alles besser 🌸' },
    { id: 5, text: 'Du bist wundervoll, genau so wie du bist 🌺' },
    { id: 6, text: 'Ich bin so stolz auf dich! 🌟' },
    { id: 7, text: 'Du bist mein Lieblingsmensch auf der ganzen Welt 🌍💖' },
    { id: 8, text: 'Jeder Moment mit dir ist ein Geschenk 🎁' },
    { id: 9, text: 'Du bist mit Abstand mein bester Supporter... selbst wenn du mich bereits 1 Mio. mal geflashed hast HAHA' },
    { id: 10, text: 'Bitte Schatz, höre niemals auf mich glücklich zu machen 🍀' },
    { id: 11, text: 'Du machst mich zum glücklichsten Menschen 😊' },
    { id: 12, text: 'Ich liebe es, wenn ich dich zum lachen bringen kann 💕' },
    { id: 13, text: 'Du bist mein Zuhause 🏠❤️' },
    { id: 14, text: 'Lass mal bitte Toni zusammen eine auf die Fresse hauen :3' },
    { id: 15, text: 'Irgendwann wenn Toni älter ist fragen wir deine Mama ob sie uns ihn schön vorbereiten kann, davor müssen wir ihn aber mesten.' },
    { id: 16, text: 'Ich freue mich auf die Zukunft, vielleicht kommt ja bald tatsächlich der lang erwartete dritte Weltkrieg. Das werden wir zusammen schaffen! ' }
    // Add more personalized messages here!
];

/**
 * VOICE LINES - Audio messages that can be played in the app
 * 
 * HOW TO ADD VOICE LINES:
 * 1. Record your voice messages (keep them short and sweet, 3-10 seconds)
 * 2. Save as MP3 or WAV files
 * 3. Put them in the public/voices/ folder
 * 4. Add entries below with the filename
 * 
 * Example recording ideas:
 * - "Guten Morgen, Schatz!"
 * - "Ich liebe dich!"
 * - "Du schaffst das!"
 * - "Denk an dich!"
 * - Personal insider jokes
 */
export const voiceLines = [
    {
        id: 1,
        filename: 'guten-morgen.mp3', // Put file in public/voices/
        label: 'Guten Morgen',
        emoji: '☀️',
        category: 'greeting'
    },
    {
        id: 2,
        filename: 'ich-liebe-dich.mp3',
        label: 'Ich liebe dich',
        emoji: '❤️',
        category: 'love'
    },
    {
        id: 3,
        filename: 'du-schaffst-das.mp3',
        label: 'Du schaffst das!',
        emoji: '💪',
        category: 'motivation'
    },
    {
        id: 4,
        filename: 'gute-nacht.mp3',
        label: 'Gute Nacht',
        emoji: '🌙',
        category: 'greeting'
    },
    {
        id: 5,
        filename: 'denk-an-dich.mp3',
        label: 'Denke an dich',
        emoji: '💭',
        category: 'love'
    },
    // Add more voice lines here!
];

// Get a random voice line, optionally filtered by category
export const getRandomVoiceLine = (category = null) => {
    const filtered = category
        ? voiceLines.filter(v => v.category === category)
        : voiceLines;
    return filtered[Math.floor(Math.random() * filtered.length)];
};

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

// Helper function to get random item from array (simple random)
export const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

// Get next photo without repeating until all shown
// Uses shownPhotoIds from storage to track which have been displayed
export const getNextPhoto = (shownPhotoIds = []) => {
    // Filter out already shown photos
    const availablePhotos = photos.filter(p => !shownPhotoIds.includes(p.id));

    // If all photos shown, reset and start fresh
    if (availablePhotos.length === 0) {
        return photos[Math.floor(Math.random() * photos.length)];
    }

    // Return random from remaining
    return availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
};

// Get next message without repeating until all shown
// Uses shownMessageIds from storage to track which have been displayed
export const getNextMessage = (shownMessageIds = []) => {
    // Filter out already shown messages
    const availableMessages = messages.filter(m => !shownMessageIds.includes(m.id));

    // If all messages shown, reset and start fresh
    if (availableMessages.length === 0) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Return random from remaining
    return availableMessages[Math.floor(Math.random() * availableMessages.length)];
};

// Helper function to determine if a minigame should appear today
export const shouldShowMinigame = (dayNumber) => {
    // Show minigame every 3rd day
    return dayNumber % 3 === 0;
};

