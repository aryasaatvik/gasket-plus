import type { Plugin } from '@gasket/core';
import { setupAuthClient } from './auth.js';
import { verifyAuthSession, setAuthTokens, clearAuthTokens, getAuthTokens, CookieOptions } from './actions.js';
import { createAuthMiddleware } from './middleware.js';
import { createClient } from '@openauthjs/openauth/client';

export interface AuthConfig {
  clientID: string;
  issuer: string;
  subjects: Record<string, any>;
  cookies?: {
    accessToken?: string;
    refreshToken?: string;
    maxAge?: number;
    sameSite?: 'strict' | 'lax' | 'none';
    secure?: boolean;
  }
}

export interface TokenStore {
  get(name: string): string | undefined;
  set(name: string, value: string, options?: CookieOptions): void;
  delete(name: string): void;
}

type AuthClient = ReturnType<typeof createClient>;

declare module '@gasket/core' {
  export interface GasketConfig {
    auth?: AuthConfig;
    authClient?: AuthClient;
  }

  export interface GasketActions {
    getAuthTokens: (store: TokenStore) => Promise<{ access?: string; refresh?: string; }>;
    setAuthTokens: (store: TokenStore, access: string, refresh: string) => Promise<void>;
    verifyAuthSession: (store: TokenStore) => Promise<false | { subject: any; tokens: any; }>;
    clearAuthTokens: (store: TokenStore) => Promise<void>;
  }
}

const plugin: Plugin = {
  name: 'gasket-plugin-auth',
  // dependencies: ['@gasket/plugin-express', '@gasket/plugin-nextjs'],

  actions: {
    getAuthTokens,
    setAuthTokens,
    verifyAuthSession,
    clearAuthTokens,
  },

  hooks: {
    async create(gasket, { pkg }) {
      // Add dependencies during app creation
      pkg.add('dependencies', {
        '@openauthjs/openauth': 'latest'
      });
    },

    configure(gasket, config) {
      const authConfig = config.auth;
      if (!authConfig) {
        gasket.logger.error('gasket.config.auth is required for gasket-plugin-auth');
        throw new Error('gasket.config.auth is required for gasket-plugin-auth');
      }

      const client = setupAuthClient(authConfig);
      return {
        ...config,
        authClient: client
      };
    },

    async middleware(gasket, app) {
      // should be safe to assume auth config is set from configure hook
      const config = gasket.config.auth!;

      const client = gasket.config.authClient;

      return createAuthMiddleware(gasket);
    },

    async express(gasket, app) {
      const config = gasket.config.auth;
      if (!config) return;

      // Add callback route for OAuth flow
      app.get('/auth/callback', async (req, res) => {
        try {
          const client = app.get('authClient');
          const code = req.query.code as string;
          const origin = `${req.protocol}://${req.get('host')}`;

          const exchanged = await client.exchange(code, `${origin}/auth/callback`);
          if (exchanged.err) {
            return res.status(400).json(exchanged.err);
          }

          const { access, refresh } = exchanged.tokens;

          // Set auth cookies
          res.cookie('access_token', access, {
            httpOnly: true,
            secure: config.cookies?.secure ?? req.secure,
            sameSite: config.cookies?.sameSite ?? 'lax',
            maxAge: config.cookies?.maxAge ?? 34560000
          });

          res.cookie('refresh_token', refresh, {
            httpOnly: true,
            secure: config.cookies?.secure ?? req.secure,
            sameSite: config.cookies?.sameSite ?? 'lax',
            maxAge: config.cookies?.maxAge ?? 34560000
          });

          // Redirect to home or configured success path
          res.redirect('/');
        } catch (error) {
          console.error('Auth callback error:', error);
          res.status(500).json({ error: 'Authentication failed' });
        }
      });
    },

    nextConfig(gasket, config) {
      const authConfig = gasket.config.auth;
      if (!authConfig) return config;

      return {
        ...config,
        async rewrites() {
          const existing = await config.rewrites?.() || [];
          return {
            beforeFiles: [
              {
                source: '/auth/callback',
                destination: '/api/auth/callback'
              },
              ...(Array.isArray(existing) ? existing : existing.beforeFiles || [])
            ],
            afterFiles: [],
            fallback: []
          };
        }
      };
    },
  }
};

export default plugin;