import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/presence/[userId] - Get user presence status
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user presence
    const presence = await prisma.userPresence.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    if (!presence) {
      // If no presence record exists, user is offline
      return NextResponse.json({
        userId,
        isOnline: false,
        lastSeenAt: null,
        user: null
      });
    }

    return NextResponse.json({
      userId: presence.userId,
      isOnline: presence.isOnline,
      lastSeenAt: presence.lastSeenAt,
      updatedAt: presence.updatedAt,
      user: presence.user
    });
  } catch (error) {
    console.error('Error fetching user presence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
