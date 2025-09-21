import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Vendors can see all active destinations
    const items = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      take: 200,
    });
    return NextResponse.json({ destinations: items });
  } catch (e) {
    return NextResponse.json({ destinations: [] });
  }
}
