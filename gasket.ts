import type { GasketConfigDefinition } from '@gasket/core';
import { makeGasket } from '@gasket/core';
import pluginHttps from '@gasket/plugin-https';
import pluginNextjs from '@gasket/plugin-nextjs';
import pluginWebpack from '@gasket/plugin-webpack';
import pluginWinston from '@gasket/plugin-winston';
import pluginLogger from '@gasket/plugin-logger';
import pluginMetadata from '@gasket/plugin-metadata';
import pluginCommand from '@gasket/plugin-command';
import pluginDocs from '@gasket/plugin-docs';
import pluginDocusaurus from '@gasket/plugin-docusaurus';
import pluginIntl from '@gasket/plugin-intl';
import pluginCloudflareImages from './plugins/cloudflare-images';

const config: GasketConfigDefinition = {
  plugins: [
    pluginHttps,
    pluginNextjs,
    pluginWebpack,
    pluginWinston,
    pluginLogger,
    pluginMetadata,
    pluginCommand,
    pluginDocs,
    pluginDocusaurus,
    pluginIntl,
    pluginCloudflareImages
  ],
  intl: {
    localesDir: 'locales',
    defaultLocale: 'en-US',
    locales: [
      'en-US',
      'fr-FR',
    ],
    managerFilename: 'intl.ts',
    nextRouting: false
  },
};

export default makeGasket(config);