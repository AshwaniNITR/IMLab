import { NextRequest, NextResponse } from 'next/server';
import { JWT } from '@/app/lib/jwt';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //console.log('🟢 [PROXY] HIT:', pathname);

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow admin login
  if (pathname === '/admin/login') {
    //console.log('🟡 [PROXY] Login page allowed');
    return NextResponse.next();
  }

  const token = request.cookies.get('admin-token')?.value;

  //console.log('🟠 [PROXY] Cookie present?', !!token);

  if (!token) {
    //console.log('🔴 [PROXY] No token → redirect');
    return NextResponse.redirect(
      new URL('/admin/login', request.url)
    );
  }

  const payload = JWT.verifyToken(token);

  if (!payload || !payload.isAdmin) {
    //console.log('🔴 [PROXY] Invalid or non-admin token');
    return NextResponse.redirect(
      new URL('/admin/login', request.url)
    );
  }

  console.log('✅ [PROXY] Admin verified:', payload.email);
  return NextResponse.next();
}
