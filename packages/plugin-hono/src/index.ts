import type { Plugin } from '@gasket/core';
import type { Hono, Context } from 'hono';
import { name, version, description } from '../package.json';
import startServer from './actions/start-server.js';
import type { Options } from '@hono/node-server';
import type { cors } from 'hono/cors';

type CORSOptions = Parameters<typeof cors>[0]

declare module '@gasket/core' {
  export interface GasketConfig {
    hono?: {
      /** Enable/disable built-in logger middleware */
      logger?: boolean;
      /** CORS configuration options */
      cors?: CORSOptions;
      /** Enable/disable compression middleware */
      compress?: boolean;
      /** Additional Hono configuration options */
      [key: string]: unknown;
    } & Omit<Options, 'fetch'>
  }
  
  export interface GasketActions {
    startServer?: () => Promise<void>;
  }

  export interface HookExecTypes {
    middleware(app: Hono): MaybeAsync<MaybeMultiple<(c: Context, next: () => Promise<void>) => Promise<void>>>;
    hono(app: Hono): MaybeAsync<void>;
    errorMiddleware(): MaybeAsync<MaybeMultiple<(err: Error, c: Context) => Promise<Response>>>;
  }
}

declare module 'create-gasket-app' {
  export interface CreateContext {
    apiApp?: boolean;
    addApiRoutes?: boolean;
    typescript?: boolean;
  }
}

const pluginHono: Plugin = {
  name,
  version,
  description,
  actions: {
    startServer
  },
  hooks: {
    metadata(gasket, meta) {
      return {
        ...meta,
        guides: [{
          name: 'Hono Setup Guide',
          description: 'Adding middleware and routes for Hono',
          link: 'docs/setup.md'
        }],
        lifecycles: [{
          name: 'middleware',
          method: 'exec',
          description: 'Add Express-style or Hono middleware',
          link: 'README.md#middleware',
          parent: 'createServers'
        }, {
          name: 'hono',
          method: 'exec',
          description: 'Modify the Hono instance for adding routes and middleware',
          link: 'README.md#hono',
          parent: 'createServers',
          after: 'middleware'
        }, {
          name: 'errorMiddleware',
          method: 'exec',
          description: 'Add error handling middleware',
          link: 'README.md#errorMiddleware',
          parent: 'createServers',
          after: 'hono'
        }],
        configurations: [{
          name: 'hono',
          link: 'README.md#configuration',
          description: 'Hono plugin configuration',
          type: 'object'
        }]
      };
    }
  }
};

export default pluginHono;
