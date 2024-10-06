import type { NextConfig } from '@gasket/plugin-nextjs';
import type { Gasket, Plugin } from '@gasket/core';
import path from 'path';

type ImageProvider = 'cloudflare';

declare module '@gasket/core' {
  export interface GasketConfig {
    nextImage: {
      provider: ImageProvider;
    };
  }
}

const pluginNextImage: Plugin = {
  name: 'next-image-plugin',
  hooks: {
    nextConfig(gasket: Gasket, nextConfig: NextConfig) {
      if (!gasket.config.nextImage || !gasket.config.nextImage.provider) {
        return nextConfig;
      }

      const imageProvider = gasket.config.nextImage.provider;
      const root = gasket.config.root;
      const loaderPath = path.relative(root, new URL(`./${imageProvider}-loader`, import.meta.url).pathname);
      nextConfig.images = {
        loader: 'custom',
        loaderFile: loaderPath,
      };
      return nextConfig;
    },
  },
};

export default pluginNextImage;