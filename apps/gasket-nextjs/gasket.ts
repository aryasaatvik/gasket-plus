import type { GasketConfigDefinition } from '@gasket/core';
import { makeGasket } from '@gasket/core';
import pluginHttps from '@gasket/plugin-https';
import pluginNextjs from '@gasket/plugin-nextjs';
import pluginWebpack from '@gasket/plugin-webpack';
import pluginWinston from '@gasket/plugin-winston';
import pluginLogger from '@gasket/plugin-logger';
// import pluginMetadata from '@gasket/plugin-metadata';
import pluginCommand from '@gasket/plugin-command';
import pluginDocs from '@gasket/plugin-docs';
// import pluginDocusaurus from '@gasket/plugin-docusaurus';
import pluginIntl from '@gasket/plugin-intl';
import pluginNextImages from 'gasket-plugin-next-image';
import pluginTailwind from 'gasket-plugin-tailwind';
import pluginAuth, { AuthConfig } from 'gasket-plugin-auth';
import * as v from "valibot"
import { createSubjects } from "@openauthjs/openauth"

export const subjects = createSubjects({
  user: v.object({
    id: v.string(),
    email: v.pipe(v.string(), v.trim(), v.email()),
    username: v.optional(v.string()),
    firstName: v.optional(v.nullable(v.string())),
    lastName: v.optional(v.nullable(v.string())),
    avatar: v.optional(v.nullable(v.string())),
  }),
})

export const authConfig: AuthConfig = {
  clientID: 'gasket-nextjs',
  issuer: 'https://auth.arya.sh',
  subjects
};

const config: GasketConfigDefinition = {
  plugins: [
    pluginHttps,
    pluginNextjs,
    pluginAuth,
    pluginWebpack,
    pluginWinston,
    pluginLogger,
    // pluginMetadata,
    pluginCommand,
    pluginDocs,
    // pluginDocusaurus,
    pluginIntl,
    pluginNextImages,
    pluginTailwind,
  ],
  auth: authConfig,
  nextImage: {
    provider: 'cloudflare'
  },
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