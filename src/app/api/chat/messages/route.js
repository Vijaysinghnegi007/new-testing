import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/chat/messages?roomId=xxx&page=1&limit=50
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    // Verify user is participant in this room
    const participant = await prisma.chatRoomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: session.user.id
        }
      }
    });

    if (!participant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        roomId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalCount = await prisma.chatMessage.count({
      where: {
        roomId
      }
    });

    return NextResponse.json({
      messages: messages.reverse(), // Reverse to get chronological order
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chat/messages - Send a new message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, message } = await request.json();

    if (!roomId || !message?.trim()) {
      return NextResponse.json(
        { error: 'Room ID and message are required' },
        { status: 400 }
      );
    }

    // Verify user is participant in this room
    const participant = await prisma.chatRoomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: session.user.id
        }
      }
    });

    if (!participant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create the message
    const newMessage = await prisma.chatMessage.create({
      data: {
        roomId,
        userId: session.user.id,
        message: message.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        room: {
          select: {
            name: true
          }
        }
      }
    });

    // Update participant's lastSeenAt
    await prisma.chatRoomParticipant.update({
      where: {
        roomId_userId: {
          roomId,
          userId: session.user.id
        }
      },
      data: {
        lastSeenAt: new Date()
      }
    });

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('Error creating chat message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
