import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public routes that do NOT require authentication
  const isPublicPath = 
    path === '/login' || 
    path === '/forgot-password' || 
    path === '/reset-password' || 
    path === '/activate' ||
    path.startsWith('/api/auth/login') ||
    path.startsWith('/api/auth/forgot-password') ||
    path.startsWith('/api/auth/reset-password') ||
    path.startsWith('/api/auth/logout') ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico');

  const authCookie = request.cookies.get('auth_user_email')?.value;

  // 1. If user is NOT authenticated and trying to access any protected route, redirect to /login
  if (!isPublicPath && !authCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user IS authenticated and trying to access login page, redirect to Dashboard
  if (authCookie && (path === '/login' || path === '/forgot-password')) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/wizard',
    '/business',
    '/roadmap',
    '/requirements',
    '/tax-calculator',
    '/calendar',
    '/documents',
    '/contractors',
    '/contacts',
    '/audit',
    '/settings',
    '/change-password',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/activate'
  ]
};
