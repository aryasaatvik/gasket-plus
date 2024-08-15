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

export default makeGasket({
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
		pluginIntl
  ],
  intl: {
    localesDir: 'locales',
    locales: [
      'en-US',
      'fr-FR',
    ],
    nextRouting: false
  },
  filename: import.meta.filename,
});
