/**
 * Extract '_file_id' value from the doc safely
 */
export const getFileIdFromFilename = (doc: unknown, filename: string) => {
    if (
      doc &&
      typeof doc === 'object' &&
      'filename' in doc &&
      doc.filename === filename &&
      '_file_id' in doc
    ) {
      return doc._file_id as string
    }
    if (doc && typeof doc === 'object' && 'sizes' in doc) {
      const sizes = doc.sizes
      if (typeof sizes === 'object' && sizes !== null) {
        for (const size of Object.values(sizes)) {
          if (size?.filename === filename && '_file_id' in size) {
            return size._file_id as string
          }
        }
      }
    }
  }
  