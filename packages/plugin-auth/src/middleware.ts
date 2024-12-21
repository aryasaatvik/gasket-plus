import { Request, Response, NextFunction } from 'express';
import { verifyAuthSession } from './actions.js';
import { ExpressTokenStore } from './token-store/express.js';
import { Gasket } from '@gasket/core';

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export function createAuthMiddleware(gasket: Gasket) {
  return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const config = gasket.config.auth;
    const client = gasket.config.authClient;

    if (!config) {
      gasket.logger.error('gasket-plugin-auth: gasket.config.auth is not set');
      return next();
    }

    if (!client) {
      gasket.logger.error('gasket-plugin-auth: gasket.config.authClient is not set');
      return next();
    }

    const store = new ExpressTokenStore(req, res);

    const verified = await verifyAuthSession(gasket, store);

    if (!verified) {
      // Clear invalid tokens
      store.delete('access_token');
      store.delete('refresh_token');

      // Start new auth flow
      const { url } = await client.authorize(
        `${req.protocol}://${req.get('host')}/auth/callback`,
        'code'
      );

      return res.redirect(url);
    }

    // Make auth data available to routes
    req.user = verified.subject;
    next();
  };
}

// Helper to protect routes
export function requireAuth(redirectUrl = '/login') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.redirect(redirectUrl);
    }
    next();
  };
}