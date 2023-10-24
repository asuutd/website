import { env } from '@/env/server.mjs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY
	}
});

export default S3;

export const uploadImage = async ({
	bucket,
	key,
	body,
	contentType,
	metadata
}: {
	bucket: string;
	key: string;
	body: Buffer;
	contentType: string;
	metadata?: Record<string, string>;
}) => {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key,
		Body: body,
		ContentType: contentType,
		Metadata: metadata
	});

	const response = await S3.send(command);

	return response;
};
