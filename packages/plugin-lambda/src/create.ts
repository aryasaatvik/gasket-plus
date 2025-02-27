import type { HookHandler } from '@gasket/core';
import { name, version } from '../package.json';
import type { CreateContext } from 'create-gasket-app';

const create: HookHandler<'create'> = async (gasket, context: CreateContext) => {
  const {
    files,
    typescript,
    pkg,
    gasketConfig
  } = context;

  const generatorDir = new URL('../generator', import.meta.url).pathname;
  const fileExt = typescript ? '.ts' : '.js';

  gasketConfig.addPlugin('pluginLambda', name);

  pkg.add('dependencies', {
    [name]: `^${version}`,
  });

  if (typescript) {
    pkg.add('devDependencies', {
      '@types/aws-lambda': '^8.10.136'
    });
  }

  const globIgnore = typescript ? '!(*.js)' : '!(*.ts)';
  files.add(
    `${generatorDir}/app/**/${globIgnore}`,
    `${generatorDir}/app/lambda/**/${globIgnore}`
  );

  gasketConfig.addPlugin('pluginLambdaRoutes', `./lambda/routes-plugin${fileExt}`);
};

export default create; 