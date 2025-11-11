import { uploadImage } from '@/utils/r2';
import Transaction from '@/lib/emails/transaction';
import { env } from '../env/server.mjs';
import { Resend } from 'resend';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(env.RESEND_API_KEY);

export type TierPurchase = {
	tierName: string;
	tierId: string;
	tierPrice: number;
	quantity: number;
};
export type TicketDisplayData = {
	codeImg: string;
	googleWalletLink: string;
	appleWalletLink: string;
};

export async function getQRCodesAndWalletLinksForTickets(
	ticketIds: string[],
	eventId: string
): Promise<TicketDisplayData[]> {
	const qrCodeUploads = ticketIds.map(async (ticketId) => {
		uploadImage({
			bucket: env.QRCODE_BUCKET,
			key: ticketId,
			body: await QRCode.toBuffer(
				`${env.NEXT_PUBLIC_URL}/tickets/validate?id=${ticketId}&eventId=${eventId}`,
				{
					width: 400,
					margin: 1
				}
			),
			contentType: 'image/png'
		});
	});
	await Promise.all(qrCodeUploads);
	return ticketIds.map((ticketId) => ({
		codeImg: `https://${env.QRCODE_BUCKET}.kazala.co/${ticketId}`,
		googleWalletLink: `https://${env.NEXT_PUBLIC_URL}/api/ticket/${ticketId}/google_wallet`,
		appleWalletLink: `https://${env.NEXT_PUBLIC_URL}/api/ticket/${ticketId}/apple_wallet`
	}));
}

export async function generateAndSendTicketEmail(
	ticketIds: string[],
	eventId: string,
	eventName: string,
	eventPhoto: string,
	userEmail: string,
	userName: string,
	orderDate: Date,
	tiers: TierPurchase[]
) {
	const qr_code_links = await getQRCodesAndWalletLinksForTickets(ticketIds, eventId);

	await resend.sendEmail({
		from: 'Kazala Tickets <ticket@mails.kazala.co>',
		to: userEmail,
		subject: `Your Tickets for ${eventName} are in!`,
		react: Transaction({
			user_name: userName,
			event_name: eventName,
			event_photo: eventPhoto,
			order_date: orderDate.toLocaleDateString(),
			tiers,
			tickets: qr_code_links,
			baseUrl: env.NEXT_PUBLIC_URL,
			googleWalletEnabled: true
		}),
		headers: {
			'X-Entity-Ref-ID': uuidv4()
		}
	});
}
