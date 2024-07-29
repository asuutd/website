import type {
    Adapter,
    PluginOptions as CloudStoragePluginOptions,
    CollectionOptions,
    GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { Config, Field, Plugin } from 'payload'

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

export type BoxStorageOptions = {
    /**
     * Collection options to apply the adapter to.
     */
    collections: Record<string, Omit<CollectionOptions, 'adapter'> | true>
  
    /**
     * Whether or not to enable the plugin
     *
     * Default: true
     */
    enabled?: boolean
  }
  
type BoxPlugin = (boxStorageOptions: BoxStorageOptions) => Plugin

export const boxStoragePlugin: BoxPlugin = (boxStorageOptions) => (incomingConfig: Config): Config => {
    return incomingConfig
}