import { createClient } from '@openauthjs/openauth/client';
import type { AuthConfig } from './index.js';

export function setupAuthClient(config: AuthConfig) {
  return createClient({
    clientID: config.clientID,
    issuer: config.issuer
  });
}
