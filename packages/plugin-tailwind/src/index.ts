import type { Plugin } from '@gasket/core';
import pkg from '../package.json' assert { type: 'json' };
import type { CreateContext } from 'create-gasket-app';
import type { Gasket, GasketConfig } from '@gasket/core';
import type { Config as TailwindConfig } from "tailwindcss";
import { fileURLToPath } from 'node:url';
import path from 'node:path';

declare module '@gasket/core' {
  interface GasketConfig {
    tailwindConfig: TailwindConfig;
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
        const { files, pkg, typescript } = context;
        pkg.add('devDependencies', {
          tailwindcss: devDependencies.tailwindcss,
          postcss: devDependencies.postcss
        });

        const __dirname = fileURLToPath(import.meta.url);
        const generatorDir = path.join(__dirname, '..', '..', 'generator');

        if (typescript) {
          files.add(
            `${generatorDir}/*`,
            '!tailwind.config.js'
          );
        } else {
          files.add(
            `${generatorDir}/**/*`,
            '!tailwind.config.js'
          );
        }
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
      return gasket.config.tailwindConfig;
    }
  }
}

export default pluginTailwind;