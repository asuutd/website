import payloadConfig from '@payload-config';
import {
  BoxOAuth,
  OAuthConfig,
} from 'box-typescript-sdk-gen/lib/box/oauth.generated.js';
import { TokenStorage } from 'box-typescript-sdk-gen/lib/box/tokenStorage.generated';
import { AccessToken } from 'box-typescript-sdk-gen/lib/schemas/accessToken.generated';
import { BasePayload, getPayload } from 'payload';
import { env } from '@/env/server.mjs';
import { BoxAccessToken } from '@/payload-types';

class PayloadBackedInMemoryTokenStorage implements TokenStorage {
  token: BoxAccessToken | undefined
  payload: BasePayload | null
  
  constructor() {
    this.payload = null
    this.token = undefined
  }
  
  async store(token: AccessToken) {
    if (!this.payload) this.payload = await getPayload({ config: payloadConfig })
    
    this.token = await this.payload.updateGlobal({
      slug: "box_access_token",
      data: {
        access_token: token as {[k: string]: Partial<unknown>}
      }
    })
    
    return undefined
  }
  
  async get() {
    if (this.token && this.token.access_token) {
      return this.token.access_token as AccessToken
    }
    if (!this.payload) this.payload = await getPayload({ config: payloadConfig })
    
    const global = await this.payload.findGlobal({
      slug: "box_access_token"
    })
    
    if (!global || !global.access_token) throw new Error("Missing Box access token in db.")
    
    this.token = global
    return this.token.access_token as AccessToken
  }
  
  async clear() {
    this.token = undefined
    if (!this.payload) this.payload = await getPayload({ config: payloadConfig })
    
    await this.payload.updateGlobal({
      slug: "box_access_token",
      data: {
        access_token: null
      }
    })
    
    return undefined
  }
}

export const tokenStorage = new PayloadBackedInMemoryTokenStorage()

export const boxOauthConfig = new BoxOAuth({
  config: new OAuthConfig({
    clientId: env.BOX_OAUTH_CLIENT_ID,
    clientSecret: env.BOX_OAUTH_CLIENT_SECRET,
    tokenStorage
  })
})
