import { NextRequest, NextResponse } from 'next/server.js';
import { NextTokenStore } from './token-store/next.js';
import { verifyAuthSession } from './actions.js';
import { Gasket } from '@gasket/core';


export async function loginHandler(gasket: Gasket, request: NextRequest) {
  const config = gasket.config.auth;
  if (!config) {
    gasket.logger.error('gasket-plugin-auth: gasket.config.auth is not set');
    return NextResponse.json({ error: 'gasket.config.auth is not set' }, { status: 400 });
  }
  const client = gasket.config.authClient;
  if (!client) {
    gasket.logger.error('gasket-plugin-auth: gasket.config.authClient is not set');
    return NextResponse.json({ error: 'gasket.config.authClient is not set' }, { status: 400 });
  }

  const { url } = await client.authorize(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`,
    'code'
  );

  return NextResponse.redirect(url);
};

export async function callbackHandler(gasket: Gasket, request: NextRequest) {
  const config = gasket.config.auth;
  if (!config) {
    gasket.logger.error('gasket-plugin-auth: gasket.config.auth is not set');
    return NextResponse.json({ error: 'gasket.config.auth is not set' }, { status: 400 });
  }
  const client = gasket.config.authClient;
  if (!client) {
    gasket.logger.error('gasket-plugin-auth: gasket.config.authClient is not set');
    return NextResponse.json({ error: 'gasket.config.authClient is not set' }, { status: 400 });
  }

  const store = new NextTokenStore();
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });

  const exchanged = await client.exchange(code, `${url.origin}/api/auth/callback`);
  if (exchanged.err) {
    return NextResponse.json(exchanged.err, { status: 400 });
  }

  const { access, refresh } = exchanged.tokens;

  const response = NextResponse.redirect(`${url.origin}/`);

  store.set('access_token', access);
  store.set('refresh_token', refresh);

  return response;
};

export async function signoutHandler(gasket: Gasket, request: NextRequest) {
  const store = new NextTokenStore();
  store.delete('access_token');
  store.delete('refresh_token');
  const url = new URL(request.url);
  return NextResponse.redirect(`${url.origin}/`);
}

export async function verifyHandler(gasket: Gasket, request: NextRequest) {
  const config = gasket.config.auth;
  if (!config) {
    gasket.logger.error('gasket-plugin-auth: gasket.config.auth is not set');
    return NextResponse.json({ error: 'gasket.config.auth is not set' }, { status: 400 });
  }
  const store = new NextTokenStore();
  const verified = await verifyAuthSession(gasket, store);
  return NextResponse.json({ verified });
};
