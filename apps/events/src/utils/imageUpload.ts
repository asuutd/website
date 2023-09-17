import { env } from '@/env/client.mjs';

/**
 * @summary This function returns the response of the upload
 * @param file File
 * @returns
 */
export const imageUpload = async (
	file: File,
	metadata: Record<string, string>
): Promise<Response> => {
	const formData = new FormData();
	formData.append('UPLOADCARE_PUB_KEY', env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY);
	formData.append('UPLOADCARE_STORE', 'auto');
	formData.append('metadata[user]', metadata.user ?? '');
	formData.append(file.name, file);

	const response = await fetch('https://upload.uploadcare.com/base/', {
		method: 'POST',
		body: formData
	});
	return response;
};
