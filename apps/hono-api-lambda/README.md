# Hono API Lambda

A Gasket application that combines Hono with AWS Lambda for serverless API deployment.

## Features

- **Hono Framework**: Fast, lightweight web framework for building APIs
- **AWS Lambda**: Serverless compute service using Hono's AWS Lambda adapter
- **Swagger Documentation**: API documentation with OpenAPI
- **TypeScript**: Type-safe development with full type support
- **ESM Modules**: Modern JavaScript module system
- **Plugin Architecture**: Extensible with Gasket plugins

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm
- AWS account (for deployment)
- AWS CLI configured locally (for deployment)

### Installation

```bash
# Install dependencies
pnpm install
```

### Local Development

```bash
# Start the development server
pnpm start
```

This will start a local development server that simulates the Lambda environment.

### Building for Production

```bash
# Build the application
pnpm build
```

This compiles TypeScript files to JavaScript in the `dist` directory.

## API Endpoints

### GET /api/status

Returns the API status with version and timestamp.

Response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2023-02-27T12:34:56.789Z"
}
```

### GET /api/hello

Returns a hello message with timestamp.

Response:
```json
{
  "message": "Hello from Lambda!",
  "timestamp": "2023-02-27T12:34:56.789Z"
}
```

### GET /api/users

Returns a list of example users.

Response:
```json
{
  "users": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
  ]
}
```

### POST /api/users

Creates a new user.

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Response:
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1677506096789,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Architecture

This application uses a modular architecture with Gasket plugins:

1. **Lambda Handler**: The entry point for AWS Lambda, created by the Lambda plugin
2. **Hono Integration**: A plugin that connects Hono to the Lambda handler
3. **Routes Plugin**: Defines API endpoints using Hono's routing system
4. **Swagger Integration**: Automatically generates API documentation

### How It Works

1. The Lambda handler is created by the `createHandler` action from the Lambda plugin
2. The Lambda handler plugin creates a Hono app and registers it with the Lambda handler
3. The routes plugin adds routes to the Hono app through the `hono` hook
4. When deployed, API Gateway sends requests to the Lambda function
5. The Lambda function processes requests using Hono's routing and middleware

## Project Structure

```
.
├── plugins/                  # Custom plugins
│   ├── lambda-handler.ts     # Connects Hono to Lambda
│   └── routes-plugin.ts      # API routes definition
├── gasket.ts                 # Gasket configuration
├── lambda.ts                 # AWS Lambda handler
├── package.json              # Project dependencies
├── swagger.json              # API documentation
└── tsconfig.json             # TypeScript configuration
```

## Adding New Routes

To add new routes, modify the `routes-plugin.ts` file:

```typescript
// plugins/routes-plugin.ts
app.get('/api/new-endpoint', (c) => {
  return c.json({
    message: 'This is a new endpoint',
    timestamp: new Date().toISOString()
  });
});
```

## Adding Middleware

You can add middleware to all routes or specific routes:

```typescript
// Global middleware
app.use('*', async (c, next) => {
  console.log(`Request to ${c.req.path}`);
  await next();
});

// Route-specific middleware
app.get('/api/protected', 
  async (c, next) => {
    // Auth middleware
    const token = c.req.header('Authorization');
    if (!token) return c.json({ error: 'Unauthorized' }, 401);
    await next();
  },
  (c) => {
    return c.json({ message: 'Protected data' });
  }
);
```

## Environment Variables

The application supports environment variables for configuration:

- `NODE_ENV`: Set to `production` for production deployments
- `LOG_LEVEL`: Controls logging verbosity (debug, info, warn, error)
- `CORS_ORIGIN`: Sets the CORS allowed origin

## License

MIT
