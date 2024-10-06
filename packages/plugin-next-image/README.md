# gasket-plugin-next-image

gasket plugin to add next/image optimization with third party providers. currently supports cloudflare

## Usage

```ts
// gasket.ts
import pluginNextjs from '@gasket/plugin-nextjs';
import pluginNextImage from 'gasket-plugin-next-image';

export default makeGasket({
  plugins: [
    pluginNextjs,
    pluginNextImage,
  ],
  nextImage: {
    provider: 'cloudflare'
  }
});
```
