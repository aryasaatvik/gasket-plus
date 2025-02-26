import type { GasketConfigDefinition } from '@gasket/core';
import { makeGasket } from '@gasket/core';
import pluginCommand from '@gasket/plugin-command';
import pluginDocs from '@gasket/plugin-docs';
import pluginDocusaurus from '@gasket/plugin-docusaurus';
// import pluginHttps from '@gasket/plugin-https';
import pluginLogger from '@gasket/plugin-logger';
import pluginMetadata from '@gasket/plugin-metadata';
import pluginWinston from '@gasket/plugin-winston';
import pluginRoutes from './plugins/routes-plugin.js';
import pluginSwagger from '@gasket/plugin-swagger';

import pluginHono from 'gasket-plugin-hono';


const config: GasketConfigDefinition = {
  plugins: [
		pluginCommand,
		pluginDocs,
		pluginDocusaurus,
		// pluginHttps,
		pluginLogger,
		pluginMetadata,
		pluginWinston,
		pluginRoutes,
		pluginSwagger,
		pluginHono
  ],
  hono: {
    logger: true,
    cors: {
      origin: '*',
    },
    port: 8080
  },
  swagger: {
    jsdoc: {
      definition: {
        info: {
          title: 'hono-api',
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
