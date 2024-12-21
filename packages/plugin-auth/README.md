# gasket-plugin-auth

Add authentication to your Gasket apps in minutes using OpenAuth. Supports both modern Next.js App Router and Express applications.

## Installation

```bash
npm install gasket-plugin-auth
```

## Configuration

Add the plugin to your gasket.js:

```js
import { makeGasket } from '@gasket/core';
import pluginAuth from 'gasket-plugin-auth';
import { createSubjects } from "@openauthjs/openauth";
import { object, string } from "valibot";

const subjects = createSubjects({
  user: object({
    id: string(),
  }),
});

export default makeGasket({
  plugins: [
    pluginAuth
  ],
  auth: {
    clientID: 'your-client-id',
    issuer: 'https://your-auth-server.com',
    subjects
  }
});
```

## Usage with Next.js App Router

1. Create API routes for auth flows:

```ts
// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import gasket from '../../../../gasket';
import { loginHandler } from 'gasket-plugin-auth/api-routes';

const handler = (request: NextRequest) => loginHandler(gasket, request);
export { handler as GET };

// app/api/auth/callback/route.ts
import { NextRequest } from 'next/server';
import gasket from '../../../../gasket';
import { callbackHandler } from 'gasket-plugin-auth/api-routes';

const handler = (request: NextRequest) => callbackHandler(gasket, request);
export { handler as GET };
```

2. Use in server components:

```tsx
// app/protected/page.tsx
import gasket from '../../../gasket';
import { NextTokenStore } from 'gasket-plugin-auth/token-store/next';

export default async function ProtectedPage() {
  const store = new NextTokenStore();
  const verified = await gasket.actions.verifyAuthSession(store);
  
  if (!verified) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <pre>{JSON.stringify(verified.subject, null, 2)}</pre>
    </div>
  );
}
```

3. Add middleware for route protection:

```ts
// middleware.ts
export async function middleware(request: NextRequest) {
  if (url.pathname.includes('/protected')) {
    const res = await fetch(new URL('/api/auth/verify', url), {
      headers: {
        cookie: request.headers.get('cookie') || ''
      }
    });
    const { verified } = await res.json();
    if (!verified || verified.err) {
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
  }
  return NextResponse.next();
}
```

4. Use the AuthProvider in your app:

```tsx
// app/layout.tsx
import { AuthProvider } from 'gasket-plugin-auth/auth-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><div>{children}</div></AuthProvider>;
}
```

5. Use the useAuth hook in your components:

```tsx
// components/AuthButton.tsx
import { useAuth } from 'gasket-plugin-auth/hooks';

export function AuthButton() {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth();
  // ...
}
```

## Usage with Express

1. Use the auth middleware:

```js
import { createAuthMiddleware } from 'gasket-plugin-auth/middleware';

app.use('/protected/*', createAuthMiddleware(gasket));
```

2. Access auth in routes:

```js
import { ExpressTokenStore } from 'gasket-plugin-auth/token-store/express';

app.get('/profile', async (req, res) => {
  const store = new ExpressTokenStore(req, res);
  const verified = await gasket.actions.verifyAuthSession(store);
  
  if (!verified) {
    return res.redirect('/login');
  }
  
  res.json({ user: verified.subject });
});
```

## Available Actions

The plugin provides these Gasket actions:

- `verifyAuthSession(store)` - Verify the current session
- `setAuthTokens(store, access, refresh)` - Set auth tokens
- `getAuthTokens(store)` - Get current tokens
- `clearAuthTokens(store)` - Clear auth tokens

## Features

- 🔒 Secure authentication with OpenAuth
- 🚂 Express middleware and Next.js API routes
- 🛡️ Route protection
- 🍪 Secure cookie-based sessions
- 🔄 Automatic token refresh
- 📦 Framework-agnostic token storage

## Security

- Tokens stored in HTTP-only cookies
- CSRF protection via SameSite cookie attribute
- Automatic token refresh
- Secure cookie settings in production
