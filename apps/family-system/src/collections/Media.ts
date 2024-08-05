import {Media as TMedia} from "@/payload-types"
import { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { encode } from "blurhash";
import sharp from 'sharp'

const GenerateBlurhash: CollectionBeforeChangeHook<TMedia> = async ({context, data, operation, req}) => {
  if (operation !== 'create') {
    req.payload.logger.debug("Not generating blur hash for update")
    return data
  }
  if (!req.file) {
    req.payload.logger.debug("Missing file, can't get mime type or blur hash")
    return data
  }
  const imgBuf = await sharp(req.file.data).raw().ensureAlpha().toBuffer({resolveWithObject: true})
  const blurhash = encode(new Uint8ClampedArray(imgBuf.data), imgBuf.info.width, imgBuf.info.height, 4, 4)
  return { ...data, blurhash, mimeType: req.file.mimetype }
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // restricting to these image types as next/image only supports these for optimization.
    // iirc if we use the right settings on the upload input on the frontend, apple devices should convert HEIC/HEIF to JPGs
    mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'blurhash',
      type: 'text',
      admin: {
        hidden: true,
      },
    }
  ],
  hooks: {
    beforeChange: [GenerateBlurhash]
  }
}

