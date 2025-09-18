import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/notifications/preferences - Get user's notification preferences
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await prisma.notificationPreference.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        type: 'asc'
      }
    });

    // Create default preferences if none exist
    if (preferences.length === 0) {
      const defaultPreferences = [
        {
          userId: session.user.id,
          type: 'BOOKING',
          channels: JSON.stringify(['PUSH', 'IN_APP']),
          enabled: true,
          frequency: 'immediate'
        },
        {
          userId: session.user.id,
          type: 'TOUR',
          channels: JSON.stringify(['PUSH', 'IN_APP']),
          enabled: true,
          frequency: 'immediate'
        },
        {
          userId: session.user.id,
          type: 'PAYMENT',
          channels: JSON.stringify(['PUSH', 'IN_APP', 'EMAIL']),
          enabled: true,
          frequency: 'immediate'
        },
        {
          userId: session.user.id,
          type: 'SYSTEM',
          channels: JSON.stringify(['IN_APP']),
          enabled: true,
          frequency: 'immediate'
        },
        {
          userId: session.user.id,
          type: 'PROMOTION',
          channels: JSON.stringify(['IN_APP']),
          enabled: false,
          frequency: 'daily'
        },
        {
          userId: session.user.id,
          type: 'MESSAGE',
          channels: JSON.stringify(['PUSH', 'IN_APP']),
          enabled: true,
          frequency: 'immediate'
        }
      ];

      await prisma.notificationPreference.createMany({
        data: defaultPreferences
      });

      // Fetch the created preferences
      const newPreferences = await prisma.notificationPreference.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          type: 'asc'
        }
      });

      return NextResponse.json({ 
        preferences: newPreferences.map(pref => ({
          ...pref,
          channels: JSON.parse(pref.channels),
          quietHours: pref.quietHours ? pref.quietHours : null
        }))
      });
    }

    return NextResponse.json({ 
      preferences: preferences.map(pref => ({
        ...pref,
        channels: JSON.parse(pref.channels),
        quietHours: pref.quietHours ? pref.quietHours : null
      }))
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/preferences - Update user's notification preferences
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferences } = await request.json();

    if (!Array.isArray(preferences)) {
      return NextResponse.json(
        { error: 'Preferences must be an array' },
        { status: 400 }
      );
    }

    // Update preferences
    const updatePromises = preferences.map(pref => 
      prisma.notificationPreference.upsert({
        where: {
          userId_type: {
            userId: session.user.id,
            type: pref.type
          }
        },
        update: {
          channels: JSON.stringify(pref.channels),
          enabled: pref.enabled,
          frequency: pref.frequency,
          quietHours: pref.quietHours || null
        },
        create: {
          userId: session.user.id,
          type: pref.type,
          channels: JSON.stringify(pref.channels),
          enabled: pref.enabled,
          frequency: pref.frequency,
          quietHours: pref.quietHours || null
        }
      })
    );

    await Promise.all(updatePromises);

    // Fetch updated preferences
    const updatedPreferences = await prisma.notificationPreference.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        type: 'asc'
      }
    });

    return NextResponse.json({ 
      preferences: updatedPreferences.map(pref => ({
        ...pref,
        channels: JSON.parse(pref.channels),
        quietHours: pref.quietHours ? pref.quietHours : null
      }))
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
