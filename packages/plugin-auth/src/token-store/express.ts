import type { CookieOptions, Request, Response } from 'express';
import { TokenStore } from '../index.js';

export class ExpressTokenStore implements TokenStore {
  constructor(private req: Request, private res: Response) {}

  get(name: string) {
    return this.req.cookies[name];
  }

  set(name: string, value: string, options?: CookieOptions) {
    this.res.cookie(name, value, options || {});
  }

  delete(name: string) {
    this.res.clearCookie(name);
  }
}