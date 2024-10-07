/// <reference types="@gasket/core" />
/// <reference types="create-gasket-app" />
/// <reference types="@gasket/plugin-metadata" />

const {
  name,
  version,
  description,
  devDependencies
} = require('../package.json');

/** @type {import('@gasket/core').Plugin} */
const plugin = {
  name,
  version,
  description,
  hooks: {
    create: {
      timing: {
        before: ['@gasket/plugin-webpack']
      },
      handler: async function create(gasket, context) {
        const { pkg } = context;

        pkg.add('devDependencies', {
          tailwindcss: devDependencies.tailwindcss,
          autoprefixer: devDependencies.autoprefixer,
          postcss: devDependencies.postcss
        });

        pkg.add('dependencies', {
          [name]: `^${version}`
        });

        // Add Tailwind CSS configuration file
        context.files.add(
          `${__dirname}/../generator/tailwind.config.js`,
          'tailwind.config.js'
        );

        // Add PostCSS configuration file
        context.files.add(
          `${__dirname}/../generator/postcss.config.js`,
          'postcss.config.js'
        );
      }
    },
    webpackConfig: async function (gasket, webpackConfig, context) {
      const { webpack } = context;

      // Add PostCSS loader to handle Tailwind CSS
      const cssRule = webpackConfig.module.rules.find(rule => rule.test && rule.test.test('.css'));
      if (cssRule && cssRule.use) {
        cssRule.use.push({
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'tailwindcss',
                'autoprefixer',
              ],
            },
          },
        });
      }

      return webpackConfig;
    },
    metadata(gasket, meta) {
      return {
        ...meta,
        lifecycles: [{
          name: 'tailwindConfig',
          method: 'execWaterfall',
          description: 'Modify the Tailwind CSS configuration',
          link: 'README.md#tailwindConfig'
        }]
      };
    }
  }
};

module.exports = plugin;