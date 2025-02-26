

export default {
  name: 'routes-plugin',
  hooks: {
    hono(gasket, app) {
      /**
      * @swagger
      *
      * /default:
      *   get:
      *     summary: "Get default route"
      *     produces:
      *       - "application/json"
      *     responses:
      *       "200":
      *         description: "Returns welcome message."
      *         content:
      *           application/json
      */
      app.get('/', (c) => {
        console.log('hello');
        return c.json({
          message: 'Welcome to your default route...'
        });
      });
    }
  }
}
