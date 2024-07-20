import type { Ticket, Event, Tier, Organizer, User, EventLocation } from '@prisma/client';
import { Template, constants } from '@walletpass/pass-js';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile, mkdir, readFile } from 'fs/promises';
import sharp from 'sharp';
import { env } from '@/env/server.mjs';
import type { BarcodeDescriptor } from '@walletpass/pass-js/dist/interfaces';

export const createApplePass = async (
	ticket: Ticket & {
		user: User;
	},
	event: Event & {
		organizer:
			| (Organizer & {
					user: User;
			  })
			| null;
		location: EventLocation | null;
	},
	tier: Tier | null
) => {
	const template = await Template.load(join(process.cwd(), 'src/lib/ticket.pass'));

	const cert = Buffer.from(env.APPLE_PASS_CERTIFICATE, 'base64').toString('ascii');
	const key = Buffer.from(env.APPLE_PASS_PRIVATE_KEY, 'base64').toString('ascii');

	template.setPrivateKey(key, env.APPLE_PASS_PRIVATE_KEY_PASSPHRASE);
	template.setCertificate(cert, env.APPLE_PASS_CERTIFICATE_PASSWORD);

	const barcode: BarcodeDescriptor = {
		message: `${env.NEXT_PUBLIC_URL}/tickets/validate?id=${ticket.id}&eventId=${ticket.eventId}`,
		format: constants.barcodeFormat.QR,
		messageEncoding: 'iso-8859-1'
	};

	const pass = template.createPass({
		serialNumber: `event-${event.id}-ticket-${ticket.id}`,
		description:
			`${"'" + tier?.name + "' t" ?? 'T'}icket, ` +
			`${event.name}` +
			(event?.organizer?.user.name ? ` - ${event?.organizer?.user.name}` : ''),
		relevantDate: event.start,
		expirationDate: event.end,
		sharingProhibited: true,
		barcode,
		barcodes: [barcode],
		appLaunchURL: `${env.NEXT_PUBLIC_URL}/tickets`,
		// more than 15 chars leads to overlapping text
		logoText: event?.organizer?.user.name?.slice(0, 15).trim() || 'Kazala',
		teamIdentifier: env.APPLE_TEAM_ID,
		passTypeIdentifier: env.APPLE_TICKET_PASS_TYPE_IDENTIFIER
	});

	pass.primaryFields.add({
		key: 'event',
		label: 'Event',
		value: event.name
	});

	if (ticket.user.name) {
		pass.secondaryFields.add({
			key: 'name',
			label: 'Ticket Holder',
			value: ticket.user.name
		});
	}

	pass.secondaryFields.add({
		key: 'time',
		label: 'Time',
		value: event.start,
		dateStyle: constants.dateTimeFormat.SHORT,
		timeStyle: constants.dateTimeFormat.SHORT
	});

	if (tier) {
		pass.headerFields.add({
			key: 'tier',
			label: 'Tier',
			value: tier.name
		});
	}

	pass.backFields.add({
		key: 'ticket_id',
		label: 'Ticket ID',
		value: ticket.id
	});

	pass.backFields.add({
		key: 'event_id',
		label: 'Event ID',
		value: event.id
	});

	pass.backFields.add({
		key: 'event_page',
		label: 'Event Page',
		value: `${env.NEXT_PUBLIC_URL}/events/${event.id}`,
		dataDetectorTypes: [constants.dataDetector.LINK]
	});

	if (event.location) {
		pass.addLocation({
			latitude: event.location.lat,
			longitude: event.location.long
		});

		if (event.location.name) {
			pass.auxiliaryFields.add({
				key: 'location',
				label: 'Location',
				value: event.location.name,
				dataDetectorTypes: [constants.dataDetector.ADDRESS]
			});

			pass.backFields.add({
				key: 'location',
				label: 'Location',
				value: event.location.name,
				dataDetectorTypes: [constants.dataDetector.ADDRESS]
			});
		}

		if (event.description) {
			pass.backFields.add({
				key: 'description',
				label: 'Description',
				value: event.description
			});
		}
	}

	if (event.ticketImage) {
		const eventImage = await getImageAsPngBuffer(event.ticketImage, `event-${event.id}`, {
			w: 90,
			h: 90
		});
		pass.images.add('thumbnail', eventImage);
	}

	if (event.organizer?.user.image) {
		const organizerImage = await getImageAsPngBuffer(
			event.organizer.user.image,
			`user-${event.organizer.user.id}`,
			{ w: 100, h: 100 }
		);
		pass.images.add('logo', organizerImage);
		pass.images.add('icon', organizerImage);
	}

	const tierDisplayText = tier ? `| ${tier.name} | ` : '';

	return {
		pass: await pass.asBuffer(),
		filename: `${event.name} ${tierDisplayText}ID${ticket.id}.pkpass`
	};
};

const getImageAsPngBuffer = async (url: string, key: string, resize?: { w: number; h: number }) => {
	const dir = join(tmpdir(), 'asu-events');
	const path = join(dir, `${key}-${resize?.w || 'orig'}-${resize?.h || 'orig'}.png`);
	try {
		const file = await readFile(path);
		return file;
	} catch (e) {
		console.log(e);
	}

	const res = await fetch(url);
	const data = await res.arrayBuffer();
	const buf = Buffer.from(data);
	let img = sharp(buf);

	if (resize) {
		img = img.resize(resize.w, resize.h);
	}

	const png = await img.toFormat('png').toBuffer();

	try {
		await mkdir(dir);
	} catch (e) {
		console.log(e);
	}
	await writeFile(path, png);

	return png;
};
