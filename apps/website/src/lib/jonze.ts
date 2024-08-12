import { JonzeClient } from '@asu/jonze';
import {JONZE_API_KEY, USE_JONZE_DEV} from '$env/static/private';

export const jonzeClient = new JonzeClient(JONZE_API_KEY, USE_JONZE_DEV == 'true');