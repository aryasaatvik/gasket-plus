# gasket-plus

## plugins

### gasket-plugin-auth

plugin to add authentication to gasket apps. powered by [OpenAuth](https://openauth.js.org/) client which supports any oauth provider. plugin supports both nextjs app router and express.

### gasket-plugin-next-image

plugin to add next/image support to gasket apps. currently only supports cloudflare from image transformations.

### gasket-plugin-tailwind

plugin to add tailwind support to gasket nextjs apps.

### gasket-plugin-hono

plugin to add [Hono](https://hono.dev) support to gasket apps. provides a modern, lightweight, and type-safe web framework with built-in middleware support for:
- Logging
- CORS
- Compression
- HTTP/HTTPS/HTTP2 servers

## apps

### gasket-nextjs

an example gasket app to showcase the plugins above.

### hono-api

an example gasket app demonstrating the Hono plugin with:
- Type-safe API routes
- Middleware integration
- HTTP/HTTPS support