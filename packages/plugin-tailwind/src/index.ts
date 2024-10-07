import type { Plugin } from '@gasket/core';
import { name, version, description, devDependencies } from '../package.json';
import 'create-gasket-app';

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
      handler: async function create(gasket, context) {
        const { files, pkg } = context;
        pkg.add('devDependencies', {
          tailwindcss: devDependencies.tailwindcss,
          postcss: devDependencies.postcss
        });

        const generatorDir = `${__dirname}/../generator`;

        files.add(
          `${generatorDir}/*`,
          `${generatorDir}/**/*`
        );

      }
    }
  }
}

export default pluginTailwind;