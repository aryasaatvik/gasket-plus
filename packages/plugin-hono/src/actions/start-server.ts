import { Gasket } from '@gasket/core';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { logger } from 'hono/logger';
import { Hono } from 'hono';

export default async function startServer(gasket: Gasket) {
  await gasket.isReady;
  const app = new Hono();
  const config = gasket.config.hono || {};

  if (config.logger !== false) {
    app.use('*', logger());
  }

  if (config.cors) {
    app.use('*', cors(config.cors));
  }

  if (config.compress !== false) {
    app.use('*', compress());
  }

  await gasket.exec('hono', app);

  const errorMiddlewares = await gasket.exec('errorMiddleware');
  errorMiddlewares
    .filter(Boolean)
    .forEach(errorMiddleware => {
      if (typeof errorMiddleware === 'function') {
        app.onError(errorMiddleware);
      }
    });
  
  console.log(`starting server on port ${config.port || 3000}`);
  serve({
    fetch: app.fetch,
    overrideGlobalObjects: config.overrideGlobalObjects,
    port: config.port,
    hostname: config.hostname,
    serverOptions: config.serverOptions,
  });
}
