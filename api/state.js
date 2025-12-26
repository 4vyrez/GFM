import prisma from './_lib/prisma.js';
import { parse } from 'cookie';

/**
 * User State API for GFM App
 * 
 * GET /api/state - Get current user state
 * POST /api/state - Update user state
 * Headers: Cookie with gfm_auth
 */
export default async function handler(req, res) {
    // Enable CORS - use specific origin for credentials support
    const origin = req.headers.origin || 'https://gfm-indol.vercel.app';
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Get auth from cookie
    const cookies = parse(req.headers.cookie || '');
    const accessCode = cookies.gfm_auth;

    if (!accessCode) {
        return res.status(401).json({ error: 'Nicht eingeloggt' });
    }

    try {
        if (req.method === 'GET') {
            // Get or create user state
            let state = await prisma.userState.findUnique({
                where: { accessCode }
            });

            if (!state) {
                // Create new state for this user
                state = await prisma.userState.create({
                    data: { accessCode }
                });
            }

            // Transform to frontend format
            const frontendState = {
                streak: state.streak,
                longestStreak: state.longestStreak,
                streakFreezes: state.streakFreezes,
                freezesUsed: state.freezesUsed,
                lastStreakUpdateDate: state.lastStreakUpdateDate,
                nextAvailableDate: state.nextAvailableDate,
                totalVisits: state.totalVisits,
                currentGameId: state.currentGameId,
                shownPhotoIds: state.shownPhotoIds,
                shownMessageIds: state.shownMessageIds,
                collectedBadges: state.collectedBadges,
                collectedTickets: state.collectedTickets,
                moodReactions: state.moodReactions,
                dailyContent: {
                    date: state.dailyContentDate,
                    cycleStartDate: state.dailyContentCycleStart,
                    photoId: state.dailyContentPhotoId,
                    messageId: state.dailyContentMessageId,
                    minigameId: state.dailyContentGameId,
                    isSpecial: state.dailyContentIsSpecial,
                }
            };

            return res.status(200).json(frontendState);

        } else if (req.method === 'POST') {
            const updates = req.body;

            // Prepare database update object
            const dbUpdates = {
                streak: updates.streak,
                longestStreak: updates.longestStreak,
                streakFreezes: updates.streakFreezes,
                freezesUsed: updates.freezesUsed,
                lastStreakUpdateDate: updates.lastStreakUpdateDate,
                nextAvailableDate: updates.nextAvailableDate,
                totalVisits: updates.totalVisits,
                currentGameId: updates.currentGameId,
                shownPhotoIds: updates.shownPhotoIds,
                shownMessageIds: updates.shownMessageIds,
                collectedBadges: updates.collectedBadges,
                collectedTickets: updates.collectedTickets,
                moodReactions: updates.moodReactions,
            };

            // Handle dailyContent nested object
            if (updates.dailyContent) {
                dbUpdates.dailyContentDate = updates.dailyContent.date;
                dbUpdates.dailyContentCycleStart = updates.dailyContent.cycleStartDate;
                dbUpdates.dailyContentPhotoId = updates.dailyContent.photoId;
                dbUpdates.dailyContentMessageId = updates.dailyContent.messageId;
                dbUpdates.dailyContentGameId = updates.dailyContent.minigameId;
                dbUpdates.dailyContentIsSpecial = updates.dailyContent.isSpecial;
            }

            // Remove undefined values
            Object.keys(dbUpdates).forEach(key =>
                dbUpdates[key] === undefined && delete dbUpdates[key]
            );

            const state = await prisma.userState.upsert({
                where: { accessCode },
                update: dbUpdates,
                create: { accessCode, ...dbUpdates }
            });

            return res.status(200).json({ success: true });

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('State API error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
