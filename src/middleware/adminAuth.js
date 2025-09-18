import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/auth/signin?callbackUrl=/admin', request.url));
  }
  
  if (session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return session;
}

export async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return false;
  }
  
  return true;
}
