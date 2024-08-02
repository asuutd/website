import { Readable } from 'node:stream';
import type {
	Adapter,
	PluginOptions as CloudStoragePluginOptions,
	CollectionOptions,
	GeneratedAdapter
} from '@payloadcms/plugin-cloud-storage/types';
import { APIError, type Config, type Field, type Plugin, type Where } from 'payload';
import { BoxClient } from 'box-typescript-sdk-gen';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { getFileIdFromFilename } from './utilities.js';

export type BoxStorageOptions = {
	/**
	 * Collection options to apply the adapter to.
	 */
	collections: Record<string, Omit<CollectionOptions, 'adapter'> | true>;

	/**
	 * Whether or not to enable the plugin
	 *
	 * Default: true
	 */
	enabled?: boolean;
	options: {
		auth: BoxClient['auth'];
		folderId: string;
	};
};

type BoxPlugin = (boxStorageOptions: BoxStorageOptions) => Plugin;

export const boxStoragePlugin: BoxPlugin =
	(boxStorageOptions) =>
	(incomingConfig: Config): Config => {
		if (boxStorageOptions.enabled === false) {
			return incomingConfig;
		}

		const adapter = boxInternal(boxStorageOptions, incomingConfig);

		// Add adapter to each collection option object
		const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
			boxStorageOptions.collections
		).reduce(
			(acc, [slug, collOptions]) => ({
				...acc,
				[slug]: {
					...(collOptions === true ? {} : collOptions),

					adapter
				}
			}),
			{} as Record<string, CollectionOptions>
		);

		// Set disableLocalStorage: true for collections specified in the plugin options
		const config = {
			...incomingConfig,
			collections: (incomingConfig.collections || []).map((collection) => {
				if (!collectionsWithAdapter[collection.slug]) {
					return collection;
				}

				return {
					...collection,
					upload: {
						...(typeof collection.upload === 'object' ? collection.upload : {}),
						disableLocalStorage: true
					}
				};
			})
		};

		return cloudStoragePlugin({
			collections: collectionsWithAdapter
		})(config);
	};

function boxInternal(options: BoxStorageOptions, incomingConfig: Config): Adapter {
	const fields: Field[] = [
		{
			name: '_file_id',
			type: 'text',
			admin: {
				hidden: true
			}
		}
	];

	return (): GeneratedAdapter => {
		const { auth } = options.options;
		let client = new BoxClient({ auth });

		return {
			name: 'box',
			fields,
			staticHandler: async (req, { doc, params: { collection, filename } }) => {
				try {
					const collectionConfig = req.payload.collections[collection]?.config;
					if (!collectionConfig)
						return new Response(null, { status: 500, statusText: 'Internal Server Error' });

					let retrievedDoc = doc;

					if (!retrievedDoc) {
						const or: Where[] = [
							{
								filename: {
									equals: filename
								}
							}
						];

						if (collectionConfig.upload.imageSizes) {
							collectionConfig.upload.imageSizes.forEach(({ name }) => {
								or.push({
									[`sizes.${name}.filename`]: {
										equals: filename
									}
								});
							});
						}

						const result = await req.payload.db.findOne({
							collection,
							req,
							where: { or }
						});

						if (result) retrievedDoc = result;
					}

					if (!retrievedDoc) {
						return new Response(null, { status: 404, statusText: 'Not Found' });
					}

					const fileId = getFileIdFromFilename(retrievedDoc, filename);
					if (!fileId) {
						return new Response(null, { status: 404, statusText: 'Not Found' });
					}

					await client.auth.refreshToken()
					
					const [fileMetadata, fileStream] = await Promise.all([
						client.files.getFileById(fileId),
						client.downloads.downloadFile(fileId)
					]);
					const stream = Readable.toWeb(fileStream) as ReadableStream;
					return new Response(stream, {
						headers: new Headers({
							'Content-Length': String(fileMetadata.size),
							'Content-Type': (retrievedDoc as any).mimeType
						}),
						status: 200
					});
				} catch (err) {
					req.payload.logger.error({ err, msg: 'Unexpected error in staticHandler' });
					return new Response('Internal Server Error', { status: 500 });
				}
			},
			handleDelete: async ({ doc, filename, req }) => {
				const fileId = getFileIdFromFilename(doc, filename);

				if (!fileId) {
					req.payload.logger.error({
						msg: `Error deleting file: ${filename} - unable to extract file id from doc`
					});
					throw new APIError(`Error deleting file: ${filename}`);
				}
				
				await client.auth.refreshToken()
				
				try {
					if (fileId) {
						await client.files.deleteFileById(fileId);
					}
				} catch (err) {
					req.payload.logger.error({
						err,
						msg: `Error deleting file: ${filename} - file id: ${fileId}`
					});
					throw new APIError(`Error deleting file: ${filename}`);
				}
			},
			handleUpload: async ({ data, file }) => {
				try {
					const { buffer, filename, mimeType } = file;
					const readableStream = new Readable();
					readableStream._read = () => {}; // _read is required but you can noop it
					readableStream.push(buffer);
					readableStream.push(null);

					await client.auth.refreshToken()
					
					const res = await client.uploads.uploadFile({
						file: readableStream,
						fileContentType: mimeType,
						attributes: {
							parent: { id: options.options.folderId },
							name: filename
						}
					});

					if (!res.entries) throw new APIError(`Error uploading file`);
					const entry = res.entries[0];
					if (!entry) throw new APIError(`Error uploading file`);

					// Find matching data.sizes entry
					const foundSize = Object.keys(data.sizes || {}).find(
						(key) => data.sizes?.[key]?.filename === filename
					);

					if (foundSize) {
						data.sizes[foundSize]._file_id = entry.id;
					} else {
						data._file_id = entry.id;
						data.filename = entry.name;
					}

					return data;
				} catch (error: unknown) {
					if (error instanceof Error) {
						if ('toJSON' in error && typeof error.toJSON === 'function') {
							const json = error.toJSON() as {
								cause?: { defect?: { _id?: string; data?: { error?: string }; error?: string } };
							};
							if (json.cause?.defect?.error && json.cause.defect.data?.error) {
								throw new APIError(
									`Error uploading file with Box: ${json.cause.defect.error} - ${json.cause.defect.data.error}`
								);
							}
						} else {
							throw new APIError(`Error uploading file with Box: ${error.message}`);
						}
					}
				}
			}
		};
	};
}
