# @gasket/plugin-hono

A Gasket plugin that adds [Hono] support to your application. Hono is a small, simple, and ultrafast web framework for the Edge.
This plugin provides an alternative to @gasket/plugin-express and @gasket/plugin-fastify with full compatibility for Express-style middleware.

## Installation

```bash
npm install @gasket/plugin-hono
```

## Configuration

The plugin can be added to your Gasket application by adding it to the `plugins` array in your `gasket.config.js`:

```js
module.exports = {
  plugins: {
    add: ['@gasket/plugin-hono']
  }
};
```

### Options

The plugin accepts the following options in your Gasket config:

```js
module.exports = {
  hono: {
    // Additional Hono configuration options
  }
};
```

## Lifecycles

### middleware

The middleware lifecycle allows you to add middleware to your Hono application. It supports both Hono-native middleware and Express-style middleware through an adapter.

```js
// plugins/my-middleware.js
module.exports = {
  hooks: {
    middleware(gasket) {
      // Express-style middleware (automatically adapted)
      return (req, res, next) => {
        // Do something with req/res
        next();
      };

      // Or Hono-native middleware
      return async (c, next) => {
        // Do something with the Hono context
        await next();
      };
    }
  }
};
```

### hono

The hono lifecycle provides direct access to configure the Hono application instance.

```js
// plugins/my-routes.js
module.exports = {
  hooks: {
    hono(gasket, app) {
      app.get('/api/hello', (c) => c.json({ message: 'Hello World!' }));
    }
  }
};
```

### errorMiddleware

The errorMiddleware lifecycle allows you to add error handling middleware. Like regular middleware, it supports both Hono and Express-style error handlers.

```js
// plugins/my-error-handler.js
module.exports = {
  hooks: {
    errorMiddleware(gasket) {
      // Express-style error middleware (automatically adapted)
      return (err, req, res, next) => {
        res.status(500).json({ error: err.message });
      };

      // Or Hono-native error handler
      return async (err, c) => {
        return c.json({ error: err.message }, 500);
      };
    }
  }
};
```

## Migration from Express

This plugin is designed to make migration from Express as smooth as possible:

1. Replace `@gasket/plugin-express` with `@gasket/plugin-hono` in your dependencies
2. Update your `gasket.config.js` to use the Hono plugin
3. Your existing Express middleware will work through the adapter
4. Gradually migrate to Hono-native middleware for better performance

### Key Differences

- Hono uses a context object (`c`) instead of separate `req`/`res` objects
- Middleware in Hono is async/await based
- Hono provides built-in TypeScript support
- Better performance and smaller bundle size

## License

[MIT](./LICENSE.md)

[Hono]: https://hono.dev 