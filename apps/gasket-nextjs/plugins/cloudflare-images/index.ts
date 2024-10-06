import { type Plugin } from '@gasket/core';

const pluginCloudflareImages: Plugin = {
  name: 'cloudflare-images-plugin',
  hooks: {
    async nextConfig(gasket, nextConfig) {
      // const { images } = await gasket.config.get('cloudflare');
      nextConfig.images = {
        loader: 'custom',
        loaderFile: './plugins/cloudflare-images/loader.ts',
      };
      return nextConfig;
    },
  },
};

export default pluginCloudflareImages;
