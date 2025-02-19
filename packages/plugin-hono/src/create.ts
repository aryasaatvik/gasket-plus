import type { HookHandler } from '@gasket/core';
import { name, version } from '../package.json';

const create: HookHandler<'create'> = async (gasket, context) => {
  const {
    files,
    typescript,
    pkg,
    gasketConfig
  } = context;

  const generatorDir = `${__dirname}/../generator`;
  const fileExt = typescript ? '.ts' : '.js';

  gasketConfig.addPlugin('pluginHono', name);

  pkg.add('dependencies', {
    [name]: `^${version}`,
    'hono': '^4.6.0',
    '@hono/node-server': '^1.13.0'
  });

  if (typescript) {
    pkg.add('devDependencies', {
      '@types/node': '^22.0.0'
    });
  }

  const globIgnore = typescript ? '!(*.js)' : '!(*.ts)';
  files.add(
    `${generatorDir}/app/**/${globIgnore}`,
    `${generatorDir}/app/plugins/**/${globIgnore}`
  );

  gasketConfig.addPlugin('pluginRoutes', `./plugins/routes-plugin${fileExt}`);

  pkg.add('dependencies', {
    'zod': '^3.22.0',
    '@hono/zod-validator': '^1.0.0'
  });
};

export default create;
