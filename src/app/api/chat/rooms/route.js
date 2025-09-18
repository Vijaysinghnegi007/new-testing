import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/chat/rooms - Get all chat rooms
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rooms = await prisma.chatRoom.findMany({
      where: {
        isActive: true,
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        participants: {
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
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
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
        }
      }
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chat/rooms - Create a new chat room or join existing one
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    // Check if room already exists
    let room = await prisma.chatRoom.findUnique({
      where: { name },
      include: {
        participants: true
      }
    });

    if (!room) {
      // Create new room if it doesn't exist
      room = await prisma.chatRoom.create({
        data: {
          name,
          description
        },
        include: {
          participants: true
        }
      });
    }

    // Check if user is already a participant
    const isParticipant = room.participants.some(
      participant => participant.userId === session.user.id
    );

    if (!isParticipant) {
      // Add user as participant
      await prisma.chatRoomParticipant.create({
        data: {
          roomId: room.id,
          userId: session.user.id
        }
      });
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error('Error creating/joining chat room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
