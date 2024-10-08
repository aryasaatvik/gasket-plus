import type { Plugin } from '@gasket/core';
import type { CreateContext } from 'create-gasket-app';
import type { Gasket, GasketConfig } from '@gasket/core';
import type { Config as TailwindConfig } from "tailwindcss";
import path from 'node:path';
import pkg from '../package.json' assert { type: 'json' };
const { name, version, description, devDependencies } = pkg;

declare module '@gasket/core' {
  interface GasketConfig {
    tailwindConfig?: Partial<TailwindConfig>;
  }

  interface GasketActions {
    getTailwindConfig: () => TailwindConfig;
  }
}

const defaultTailwindConfig: TailwindConfig = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

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
        const { files, pkg, typescript } = context;
        pkg.add('dependencies', {
          [name]: `^${version}`,
        })
        pkg.add('devDependencies', {
          tailwindcss: devDependencies.tailwindcss,
          postcss: devDependencies.postcss
        });

        const generatorDir = path.join(__dirname, '..', '..', 'generator');

        files.add(
          `${generatorDir}/**/*`,
        );

        context.gasketConfig.addPlugin('pluginTailwind', 'gasket-plugin-tailwind');
      }
    },
    configure(gasket: Gasket, baseConfig: GasketConfig) {
      const tailwindConfig = baseConfig.tailwindConfig || defaultTailwindConfig;

      return {
        ...baseConfig,
        tailwindConfig
      };
    }
  },
  actions: {
    getTailwindConfig(gasket: Gasket) {
      const config = gasket.config.tailwindConfig || defaultTailwindConfig;
      return config as TailwindConfig;
    }
  }
}

export default pluginTailwind;