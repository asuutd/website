import type { Ticket, Event, Tier, Organizer, User, EventLocation } from '@/server/db/generated';
import { Template, constants } from '@walletpass/pass-js';
import { tmpdir } from 'node:os';
import { join } from 'path';
import { writeFile, mkdir, readFile } from 'fs/promises';
import sharp from 'sharp';
import { env } from '@/env/server.mjs';
import type { BarcodeDescriptor } from '@walletpass/pass-js/dist/interfaces';
import { GoogleAuth } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const ticketQRContent = (ticket: Ticket) => `${env.NEXT_PUBLIC_URL}/tickets/validate?id=${ticket.id}&eventId=${ticket.eventId}`
const eventPage = (event: Event) => `${env.NEXT_PUBLIC_URL}/events/${event.id}`
export const googlePassClass = (event: Event) => `${env.GOOGLE_WALLET_ISSUER}.${event.id}`

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
		message: ticketQRContent(ticket),
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

const googleCredentialString = Buffer.from(env.GOOGLE_WALLET_SERVICE_ACCOUNT_CREDENTIALS_BASE64, 'base64').toString("utf8");
const googleCredentials = JSON.parse(googleCredentialString)
const googleHttpClient = new GoogleAuth({
  credentials: googleCredentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

export async function createOrUpdateGooglePassClass(event: Event & {
		organizer:
			| (Organizer & {
					user: User;
			  })
			| null;
		location: EventLocation | null;
	}, update = false) {
  const id = googlePassClass(event)
  const issuerName = event?.organizer?.user.name?.trim() || 'Kazala'
  
  const classObject: Record<string, any> = {
    id,
    issuerName,
    cardTitle: issuerName,
    allowMultipleUsersPerObject: false,
    eventId: event.id,
    eventName: {
      defaultValue: {
        language: "en-US",
        value: event.name
      }
    },
    dateTime: {
      start: event.start.toISOString(),
      end: event.end.toISOString()
    },
    heroImage: {
      sourceUri: {
        uri: event.ticketImage
      },
    },
    multipleDevicesAndHoldersAllowedStatus: "ONE_USER_ALL_DEVICES",
    reviewStatus: "UNDER_REVIEW",
    homepageUri: {
      uri: 'https://kazala.co'
    },
    linksModuleData: {
      uris: [
        {
          uri: eventPage(event),
          description: 'Event page'
        }
      ]
    }
  }
  
  if (event.organizer) {
    classObject["logo"] =  {
      sourceUri: {
        uri: event.organizer.user.image
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: `${event.organizer.user.name} logo`
        }
      }
    }
  }
  
  
  if (event.location) {
    classObject['venue'] = {
      name: {
        defaultValue: {
          language: "en-US",
          value: event.location.name
        }
      },
      address: {
        defaultValue: {
          language: "en-US",
          value: event.location.name
        }
      }
    }
    classObject['locations'] = [
      {
        longitude: event.location.long,
        latitude: event.location.lat
      }
    ]
  }

  
  const response = await googleHttpClient.request({
    url: 'https://walletobjects.googleapis.com/walletobjects/v1/eventTicketClass' + (update ? `/${id}` : ''),
    method: update ? 'PUT' : 'POST',
    data: classObject
  });
  
  return id
}

export function createGooglePassObject(ticket: Ticket & { user: User }, classId: string, tier: Tier | null) {
  const passObject: Record<string, any> = {
    id: `${env.GOOGLE_WALLET_ISSUER}.${ticket.id}`,
    classId,
    state: "ACTIVE",
    header: {
      defaultValue: {
        language: 'en-US',
        value: ticket.user.name
      }
    },
    cardTitle: ticket.user.name,
    passConstraints: {
      screenshotEligibility: "INELIGIBLE"
    },
    ticketHolderName: ticket.user.name,
    ticketNumber: ticket.id,
    barcode: {
      type: 'QR_CODE',
      value: ticketQRContent(ticket)
    },
  };

  if (tier) {
    passObject['textModulesData'] = [
      {
        header: 'Tier',
        body: tier.name,
        id: 'tier'
      }
    ]    
  }
  
  const claims = {
    iss: googleCredentials.client_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      eventTicketObjects: [
        passObject
      ]
    }
  };

  const token = jwt.sign(claims, googleCredentials.private_key, { algorithm: 'RS256' });
  return token
}

export const googlePassJwtToSaveUrl = (token: string) => `https://pay.google.com/gp/v/save/${token}`