import { ActionHandler } from '@gasket/core';

export const clearAuthTokens: ActionHandler<'clearAuthTokens'> = async (gasket, store) => {
  store.delete('access_token');
  store.delete('refresh_token');
}

export const getAuthTokens: ActionHandler<'getAuthTokens'> = async (gasket, store) => {
  return {
    access: store.get('access_token'),
    refresh: store.get('refresh_token')
  };
}

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  maxAge?: number;
}

export const verifyAuthSession: ActionHandler<'verifyAuthSession'> = async (gasket, store) => {
  const config = gasket.config.auth;
  if (!config) return false;

  const client = gasket.config.authClient;

  if (!client) {
    gasket.logger.error('gasket.config.authClient is undefined');
    throw new Error('gasket.config.authClient is undefined');
  }

  const accessToken = store.get('access_token');
  const refreshToken = store.get('refresh_token');

  if (!accessToken) return false;

  const verified = await client.verify(config.subjects, accessToken, {
    refresh: refreshToken
  });

  if (verified.err) return false;
  if (verified.tokens) {
    await setAuthTokens(gasket, store, verified.tokens.access, verified.tokens.refresh);
  }

  return {
    subject: verified.subject,
    tokens: verified.tokens
  }
}

export const setAuthTokens: ActionHandler<'setAuthTokens'> = async (gasket, store, access, refresh) => {
  const config = gasket.config.auth;
  if (!config) return;

  const options = {
    httpOnly: true,
    secure: config.cookies?.secure,
    sameSite: config.cookies?.sameSite ?? 'lax',
    path: '/',
    maxAge: config.cookies?.maxAge ?? 34560000
  };

  store.set('access_token', access, options);
  store.set('refresh_token', refresh, options);
}
