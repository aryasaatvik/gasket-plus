import { NextResponse, type NextRequest } from 'next/server'
// TODO: gasket doesn't work in edge runtime because commander uses nodejs modules
// import gasket from './gasket'

export async function middleware(request: NextRequest) {
  const locale = request.headers.get('accept-language').split(',')[0]
  const url = new URL(request.url)
  if (url.pathname === '/') {
    console.log('redirecting to /%s', locale)
    return NextResponse.redirect(new URL(`/${locale}`, url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

