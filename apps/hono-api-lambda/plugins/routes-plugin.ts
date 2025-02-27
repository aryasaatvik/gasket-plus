import type { Plugin } from '@gasket/core';

const routesPlugin: Plugin = {
  name: 'routes-plugin',
  hooks: {
    /**
     * Add routes to the Hono app
     *
     * @param {object} gasket - The Gasket instance
     * @param {Hono} app - The Hono app instance
     */
    async hono(gasket, app) {
      /**
      * @swagger
      *
      * /api/status:
      *   get:
      *     summary: "Get API status"
      *     produces:
      *       - "application/json"
      *     responses:
      *       "200":
      *         description: "Returns API status."
      *         content:
      *           application/json
      */
      app.get('/api/status', (c) => {
        return c.json({
          status: 'ok',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        });
      });

      /**
      * @swagger
      *
      * /api/hello:
      *   get:
      *     summary: "Get hello message"
      *     produces:
      *       - "application/json"
      *     responses:
      *       "200":
      *         description: "Returns hello message."
      *         content:
      *           application/json
      */
      app.get('/api/hello', (c) => {
        return c.json({
          message: 'Hello from Lambda!',
          timestamp: new Date().toISOString()
        });
      });

      /**
      * @swagger
      *
      * /api/users:
      *   get:
      *     summary: "Get users"
      *     produces:
      *       - "application/json"
      *     responses:
      *       "200":
      *         description: "Returns list of users."
      *         content:
      *           application/json
      */
      app.get('/api/users', (c) => {
        // Example user data
        const users = [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ];

        return c.json({ users });
      });

      /**
      * @swagger
      *
      * /api/users:
      *   post:
      *     summary: "Create user"
      *     produces:
      *       - "application/json"
      *     responses:
      *       "201":
      *         description: "Creates a new user."
      *         content:
      *           application/json
      */
      app.post('/api/users', async (c) => {
        try {
          const body = await c.req.json();

          // Validate user data (in a real app, use a validation library)
          if (!body.name || !body.email) {
            return c.json({ error: 'Name and email are required' }, 400);
          }

          // In a real app, you would save to a database
          return c.json({
            message: 'User created successfully',
            user: {
              id: Date.now(),
              ...body
            }
          }, 201);
        } catch (error) {
          return c.json({ error: 'Invalid request body' }, 400);
        }
      });
    }
  }
};

export default routesPlugin;