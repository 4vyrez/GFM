import prisma from '../../lib/prisma.js';

/**
 * Admin Setup Route - Creates the initial access code
 * This should be called once to set up the app
 * 
 * POST /api/setup
 * Body: { code: string, adminSecret: string }
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, adminSecret } = req.body;

    // Simple admin protection - change this secret!
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!code || typeof code !== 'string' || code.length < 4) {
        return res.status(400).json({ error: 'Code muss mindestens 4 Zeichen haben' });
    }

    try {
        const access = await prisma.appAccess.create({
            data: { accessCode: code.toLowerCase().trim() }
        });

        return res.status(200).json({
            success: true,
            message: `Code "${code}" wurde erstellt! 🎉`
        });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Dieser Code existiert bereits' });
        }
        console.error('Setup error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
