import { basicAuth } from 'hono/basic-auth';

export default {
  name: 'example-routes-plugin',
  hooks: {
    // Add middleware
    middleware(gasket) {
      // Example of using Hono's built-in basic auth middleware
      return basicAuth({
        username: 'admin',
        password: 'secret'
      });
    },

    // Add routes
    hono(gasket, app) {
      // Protected routes (will use basic auth from middleware)
      app.get('/api/protected', (c) => {
        return c.json({
          message: 'This is a protected endpoint',
          user: c.get('user')
        });
      });

      // Example of route groups
      app.route('/api/v1')
        .get('/users', (c) => c.json([{ id: 1, name: 'User 1' }]))
        .post('/users', async (c) => {
          const body = await c.req.json();
          return c.json(body, 201);
        });

      // Example of using URL parameters
      app.get('/api/users/:id', (c) => {
        const id = c.req.param('id');
        return c.json({ id, name: `User ${id}` });
      });
    },

    // Add error handling
    errorMiddleware(gasket) {
      return async (err, c) => {
        // Log the error
        console.error('[Custom Error Handler]', err);

        // Return appropriate error response
        if (err.status === 401) {
          return c.json({ error: 'Unauthorized' }, 401);
        }

        return c.json({ 
          error: err.message,
          status: 'error'
        }, err.status || 500);
      };
    }
  }
}; 