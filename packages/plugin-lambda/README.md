# gasket-plugin-lambda

A Gasket plugin that adds AWS Lambda support to your application. This plugin allows you to create serverless applications using the Gasket framework by providing a Lambda handler that works with AWS Lambda API Gateway events.

## Installation

```bash
pnpm add gasket-plugin-lambda
```

## Configuration

Add the plugin to your Gasket application:

```typescript
// gasket.ts
import { makeGasket } from '@gasket/core';
import pluginLambda from 'gasket-plugin-lambda';

export default makeGasket({
  plugins: [
    pluginLambda,
    // other plugins...
  ],
  lambda: {
    // Enable/disable request logging
    logger: true,
    // CORS configuration
    cors: {
      allowOrigin: '*',
      allowMethods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowHeaders: 'Content-Type,Authorization'
    }
  }
});
```

## Usage

Create a Lambda handler file that imports your Gasket instance and uses the `createHandler` action:

```typescript
// lambda.ts
import gasket from './gasket.js';

export const handler = await gasket.actions.createHandler();
```

## Lifecycles

### lambdaMiddleware

Add middleware to the Lambda handler:

```typescript
// plugins/my-middleware.ts
import type { Plugin } from '@gasket/core';

const myMiddleware: Plugin = {
  name: 'my-middleware',
  hooks: {
    lambdaMiddleware(gasket, handler) {
      return async (event, context, next) => {
        console.log('Request received:', event.path);
        await next();
      };
    }
  }
};

export default myMiddleware;
```

### lambda

The `lambda` lifecycle allows you to transform or replace the Lambda handler. This is particularly useful for integrating web frameworks like Hono:

```typescript
// plugins/lambda-handler-plugin.ts
import { Plugin } from "@gasket/core";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const pluginLambdaHandler: Plugin = {
  name: 'lambda-handler',
  hooks: {
    lambda: async (gasket, handler) => {
      const hono = new Hono();
      await gasket.exec('hono', hono);
      return handle(hono);
    }
  }
};

export default pluginLambdaHandler;
```

### lambdaErrorMiddleware

Add error handling middleware:

```typescript
// plugins/error-handler.ts
import type { Plugin } from '@gasket/core';

const errorHandler: Plugin = {
  name: 'error-handler',
  hooks: {
    lambdaErrorMiddleware(gasket) {
      return async (err, event, context) => {
        console.error('Error in Lambda handler:', err);
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: 'Internal Server Error',
            message: err.message
          })
        };
      };
    }
  }
};

export default errorHandler;
```

## Framework Integration

### Hono

The plugin works seamlessly with Hono's AWS Lambda adapter. Create a plugin that implements the `lambda` hook to integrate Hono:

```typescript
// plugins/lambda-handler-plugin.ts
import { Plugin } from "@gasket/core";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const pluginLambdaHandler: Plugin = {
  name: 'lambda-handler',
  hooks: {
    lambda: async (gasket, handler) => {
      const hono = new Hono();
      await gasket.exec('hono', hono);
      return handle(hono);
    }
  }
};

export default pluginLambdaHandler;
```

Then create a routes plugin to add endpoints to your Hono app:

```typescript
// plugins/routes-plugin.ts
import type { Plugin } from '@gasket/core';

const routesPlugin: Plugin = {
  name: 'routes-plugin',
  hooks: {
    async hono(gasket, app) {
      app.get('/api/hello', (c) => {
        return c.json({
          message: 'Hello from Lambda!',
          timestamp: new Date().toISOString()
        });
      });
      
      // Add more routes...
    }
  }
};

export default routesPlugin;
```

## Type Definitions

To properly support both standard Lambda handlers and Hono's handler, you may need to update your type definitions:

```typescript
// In your plugin's index.ts
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, Context } from 'aws-lambda';

// Define a flexible handler type
export type LambdaEvent = APIGatewayProxyEvent | APIGatewayProxyEventV2;
type LambdaHandler = (event: any, context?: any) => Promise<APIGatewayProxyResult>;

// Then use this type in your hook definitions
```

## Example Project

For a complete example of using this plugin with Hono, see the [hono-api-lambda](https://github.com/aryasaatvik/gasket-plus/tree/main/apps/hono-api-lambda) project.

## License

[MIT](./LICENSE.md)