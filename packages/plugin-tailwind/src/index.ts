import type { Plugin } from '@gasket/core';
import pkg from '../package.json' assert { type: 'json' };
import type { CreateContext } from 'create-gasket-app';
import type { Gasket } from '@gasket/core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const { name, version, description, devDependencies } = pkg;

const pluginTailwind: Plugin = {
  name,
  version,
  description,
  hooks: {
    create: {
      timing: {
        last: true,
        after: ['@gasket/plugin-nextjs']
      },
      handler: async function create(gasket: Gasket, context: CreateContext) {
        const { files, pkg } = context;
        pkg.add('devDependencies', {
          tailwindcss: devDependencies.tailwindcss,
          postcss: devDependencies.postcss
        });

        const __dirname = fileURLToPath(import.meta.url);
        const generatorDir = path.join(__dirname, '..', '..', 'generator');

        files.add(
          `${generatorDir}/*`,
          `${generatorDir}/**/*`
        );

      }
    }
  }
}

export default pluginTailwind;