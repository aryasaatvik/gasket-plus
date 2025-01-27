import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { timing } from 'hono/timing';

export default {
  name: 'example-routes',
  hooks: {
    // Add common middleware
    middleware(gasket) {
      return [
        logger(),
        timing(),
        cors({
          origin: '*',
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        })
      ];
    },

    // Add routes to the Hono app
    hono(gasket, app) {
      // Health check endpoint
      app.get('/health', (c) => c.json({ status: 'ok' }));

      // Example API endpoints
      app.get('/api/hello', (c) => {
        const name = c.req.query('name') || 'World';
        return c.json({ message: `Hello ${name}!` });
      });

      app.post('/api/echo', async (c) => {
        const body = await c.req.json();
        return c.json(body);
      });

      // Example of route groups
      const api = app.route('/api/v1');
      
      api.get('/status', (c) => c.json({
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }));
    },

    // Add error handling
    errorMiddleware(gasket) {
      return [
        // Generic error handler
        async (err, c) => {
          console.error(`[ERROR] ${err.message}`);
          return c.json({ 
            error: err.message,
            status: 'error' 
          }, err.status || 500);
        },
        // 404 handler
        async (err, c) => {
          if (err.status === 404) {
            return c.json({ 
              error: 'Not Found',
              status: 'error' 
            }, 404);
          }
          throw err; // Pass to next error handler
        }
      ];
    }
  }
}; 