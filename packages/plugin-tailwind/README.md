# gasket-plugin-tailwind

This plugin adds Tailwind CSS support to your Gasket application.

## Installation

```
npm i gasket-plugin-tailwind
```

Update your `gasket` file plugin configuration:

```diff
// gasket.js

+ import pluginTailwind from 'gasket-plugin-tailwind';

export default makeGasket({
  plugins: [
+   pluginTailwind
  ]
});
```

## Configuration

You can configure Tailwind CSS options in your `gasket.js` file:

```js
export default makeGasket({
  plugins: [
    pluginTailwindcss
  ],
  tailwindConfig: {
    // Your Tailwind CSS config options here
  }
});
```

## Lifecycles

### tailwindConfig

Executed before the Tailwind CSS configuration is finalized. It receives the initial Tailwind config and allows you to modify it.

```js
export default {
  name: 'my-plugin',
  hooks: {
    tailwindConfig(gasket, config) {
      // Modify the Tailwind config
      return {
        ...config,
        // Your modifications here
      };
    }
  }
};
```

## License

[MIT](./LICENSE.md)