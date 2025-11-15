import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';

/**
 * Cron job endpoint to delete expired records
 * Cleans up expired sessions, verification tokens, and admin invites
 * 
 * This endpoint should be called by Vercel Cron Jobs
 * Authorization is done via checking the Authorization header against CRON_SECRET
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Only allow POST requests
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	// Verify the request is from Vercel Cron
	const authHeader = req.headers.authorization;
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		console.error('CRON_SECRET is not configured');
		return res.status(500).json({ error: 'Server configuration error' });
	}

	if (authHeader !== `Bearer ${cronSecret}`) {
		console.error('Unauthorized cron request');
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const now = new Date();

		// Delete expired sessions
		const deletedSessions = await prisma.session.deleteMany({
			where: {
				expires: {
					lt: now
				}
			}
		});

		// Delete expired verification tokens
		const deletedVerificationTokens = await prisma.verificationToken.deleteMany({
			where: {
				expires: {
					lt: now
				}
			}
		});

		// Delete expired admin invites
		const deletedAdminInvites = await prisma.adminInvite.deleteMany({
			where: {
				expiresAt: {
					lt: now
				}
			}
		});

		console.log('Cleanup completed:', {
			sessions: deletedSessions.count,
			verificationTokens: deletedVerificationTokens.count,
			adminInvites: deletedAdminInvites.count,
			timestamp: now.toISOString()
		});

		return res.status(200).json({
			success: true,
			deleted: {
				sessions: deletedSessions.count,
				verificationTokens: deletedVerificationTokens.count,
				adminInvites: deletedAdminInvites.count
			},
			timestamp: now.toISOString()
		});
	} catch (error) {
		console.error('Error during cleanup:', error);
		return res.status(500).json({ 
			error: 'Cleanup failed',
			message: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}
