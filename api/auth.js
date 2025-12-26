import prisma from './_lib/prisma.js';

/**
 * Simple Code-based Authentication for GFM App
 * 
 * POST /api/auth - Verify access code
 * Body: { code: string }
 * Response: { success: boolean, message?: string }
 */
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.body;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ success: false, message: 'Code erforderlich' });
    }

    try {
        // Check if code exists in database
        const access = await prisma.appAccess.findUnique({
            where: { accessCode: code.toLowerCase().trim() }
        });

        if (!access) {
            return res.status(401).json({
                success: false,
                message: 'Ungültiger Code 🔒'
            });
        }

        // Update last access time
        await prisma.appAccess.update({
            where: { id: access.id },
            data: { lastAccess: new Date() }
        });

        // Set auth cookie (httpOnly for security)
        res.setHeader('Set-Cookie', [
            `gfm_auth=${code.toLowerCase().trim()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 365}` // 1 year
        ]);

        return res.status(200).json({
            success: true,
            message: 'Willkommen zurück! 💕'
        });

    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Serverfehler'
        });
    }
}
