import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedRoutes = ['/dashboard', '/profile'];
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));

  if (!isProtected) return NextResponse.next();

  // Check auth cookie (Supabase sets sb-*-auth-token cookies)
  const authCookie = req.cookies.get('sb-access-token')
    || req.cookies.getAll().find(c => c.name.includes('-auth-token'));

  if (!authCookie) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
