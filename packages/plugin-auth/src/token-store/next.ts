import { cookies } from 'next/headers.js';
import { TokenStore } from '../index.js';
import { CookieOptions } from '../actions.js';

export class NextTokenStore implements TokenStore {
  get(name: string) {
    return cookies().get(name)?.value;
  }

  set(name: string, value: string, options?: CookieOptions) {
    cookies().set(name, value, options);
  }

  delete(name: string) {
    cookies().delete(name);
  }
}