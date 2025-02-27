import type { GasketConfigDefinition } from '@gasket/core';
import { makeGasket } from '@gasket/core';
import pluginCommand from '@gasket/plugin-command';
// import pluginDocs from '@gasket/plugin-docs';
// import pluginDocusaurus from '@gasket/plugin-docusaurus';
import pluginLogger from '@gasket/plugin-logger';
// import pluginMetadata from '@gasket/plugin-metadata';
import pluginWinston from '@gasket/plugin-winston';
import pluginSwagger from '@gasket/plugin-swagger';
import pluginLambda from 'gasket-plugin-lambda';

import pluginRoutes from './plugins/routes-plugin.js';
import pluginLambdaHandler from './plugins/lambda-handler-plugin.js';
const config: GasketConfigDefinition = {
  plugins: [
    pluginCommand,
    // pluginDocs,
    // pluginDocusaurus,
    pluginLogger,
    // pluginMetadata,
    pluginWinston,
    pluginSwagger,
    pluginLambda,
    pluginRoutes,
    pluginLambdaHandler
  ],
  // TODO: how can a framework support multiple deployment targets? should lambda be nested under hono?
  hono: {
    logger: true,
    cors: {
      origin: '*',
    }
  },
  lambda: {
    logger: true,
    cors: {
      allowOrigin: '*',
      allowMethods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowHeaders: 'Content-Type,Authorization'
    }
  },
  // TODO: use hono-openapi in the hono plugin. maybe a seperate plugin
  swagger: {
    jsdoc: {
      definition: {
        info: {
          title: 'hono-api-lambda',
          version: '0.0.0',
        },
      },
      apis: [
        './routes/*',
      ],
    },
  },
};

export default makeGasket(config); 