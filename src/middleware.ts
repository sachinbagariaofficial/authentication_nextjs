import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
  // Extracting the path from the request URL
  const path = request.nextUrl.pathname;

  // Checking if the path is a public path
  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail';

  // Retrieving token from cookies
  const token = request.cookies.get('token')?.value || '';

  // Handling redirection for authenticated users accessing public paths
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Handling redirection for unauthenticated users accessing private paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}


 // ********** Configuration specifying the paths to be matched for middleware execution **********
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verifyemail'
  ]
}