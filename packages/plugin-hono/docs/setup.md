# Hono Setup Guide

This guide will help you set up and use the Hono plugin in your Gasket application.

## Basic Setup

1. Install the plugin:
```bash
pnpm add gasket-plugin-hono
```

2. Add it to your Gasket configuration:
```js
// gasket.ts
import pluginHono from 'gasket-plugin-hono';
import { makeGasket } from '@gasket/core';

const config: GasketConfigDefinition = {
  plugins: [
    pluginHono,
  ]
};

export default makeGasket(config);
```

## Adding Routes

The plugin provides multiple ways to add routes to your application:

### 1. Using the `hono` Lifecycle

```js
// plugins/my-routes.js
export default {
  name: 'my-routes',
  hooks: {
    hono(gasket, app) {
      app.get('/api/hello', (c) => c.json({ message: 'Hello!' }));
      
      // Route groups
      app.route('/api/v1')
        .get('/users', (c) => c.json([]))
        .post('/users', async (c) => {
          const body = await c.req.json();
          return c.json(body, 201);
        });
    }
  }
};
```

### 2. Using Middleware

```js
// plugins/my-middleware.js
import { cors } from 'hono/cors';

export default {
  name: 'my-middleware',
  hooks: {
    middleware(gasket) {
      // Return Hono middleware directly
      return cors();
      
      // Or return Express-style middleware (will be adapted)
      return (req, res, next) => {
        res.setHeader('X-Custom', 'value');
        next();
      };
    }
  }
};
```

## Error Handling

Add error handling middleware using the `errorMiddleware` lifecycle:

```js
// plugins/error-handler.js
export default {
  name: 'error-handler',
  hooks: {
    errorMiddleware(gasket) {
      return async (err, c) => {
        console.error(err);
        return c.json({ 
          error: err.message,
          status: 'error' 
        }, err.status || 500);
      };
    }
  }
};
```

## Best Practices

1. **Middleware Organization**
   - Use the `middleware` hook for request processing
   - Keep middleware focused and composable
   - Consider using Hono's built-in middleware when possible

2. **Route Organization**
   - Group related routes using `app.route()`
   - Use descriptive route paths
   - Leverage URL parameters for dynamic routes

3. **Error Handling**
   - Always include error handling middleware
   - Log errors appropriately
   - Return consistent error responses

4. **TypeScript Support**
   - Leverage Hono's built-in TypeScript support
   - Use type definitions for request/response bodies
   - Define route parameter types

## Migration from Express

If you're migrating from Express, here are some key differences:

1. **Context Object**
   ```js
   // Express
   app.get('/api', (req, res) => {
     res.json({ message: 'Hello' });
   });

   // Hono
   app.get('/api', (c) => {
     return c.json({ message: 'Hello' });
   });
   ```

2. **Middleware**
   ```js
   // Express
   app.use((req, res, next) => {
     res.locals.user = { id: 1 };
     next();
   });

   // Hono
   app.use('*', async (c, next) => {
     c.set('user', { id: 1 });
     await next();
   });
   ```

3. **Error Handling**
   ```js
   // Express
   app.use((err, req, res, next) => {
     res.status(500).json({ error: err.message });
   });

   // Hono
   app.onError((err, c) => {
     return c.json({ error: err.message }, 500);
   });
   ```

## Advanced Usage

### Custom Middleware with TypeScript

```ts
import { MiddlewareHandler } from 'hono';

const customMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  console.log(`Request took ${end - start}ms`);
};

export default {
  name: 'timing-middleware',
  hooks: {
    middleware() {
      return customMiddleware;
    }
  }
};
```

### Validation with Zod

```ts
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email()
});

export default {
  name: 'user-routes',
  hooks: {
    hono(gasket, app) {
      app.post('/api/users', 
        zValidator('json', userSchema),
        async (c) => {
          const data = c.req.valid('json');
          return c.json(data, 201);
        }
      );
    }
  }
};
``` 