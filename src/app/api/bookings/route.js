import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  const DEMO = String(process.env.DEMO_MODE || '').toLowerCase() === 'true' || process.env.DEMO_MODE === '1'
  try {
    const session = await getServerSession(authOptions);
    const bookingData = await request.json();

    if (DEMO) {
      const bookingId = `TW${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      return NextResponse.json({
        bookingId,
        status: 'success',
        message: 'Booking created (demo mode)'.trim(),
        booking: {
          id: bookingId,
          bookingId,
          startDate: bookingData.startDate,
          totalPrice: bookingData.totalPrice,
          status: 'CONFIRMED'
        }
      })
    }

// Generate unique booking ID (fallback, but primary key in DB is id; bookingNumber is separate)
    // Keep compatibility with caller expecting bookingId
    const bookingId = `TW${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

// NOTE: Aligning with Prisma schema: store guestInfo JSON, numberOfTravelers, enums
    // Create booking in database
const booking = await prisma.booking.create({
      data: {
        bookingNumber: bookingId,
        userId: session?.user?.id || undefined,
        // Relations to real Tour/Availability could be wired later; store metadata in guestInfo
        numberOfTravelers: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        travelDate: new Date(bookingData.startDate),
        guestInfo: {
          primaryName: `${bookingData.guestInfo.firstName} ${bookingData.guestInfo.lastName}`.trim(),
          email: bookingData.guestInfo.email,
          phone: bookingData.guestInfo.phone,
          address: bookingData.guestInfo.address || null,
          tour: bookingData.tour, // store snapshot for reference
        },
        paymentStatus: 'PAID',
        bookingStatus: bookingData.status?.toUpperCase?.() || 'CONFIRMED',
      }
    });

    // If user is logged in, update their booking count
    if (session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { updatedAt: new Date() }
      });
    }

    // In a real app, you would also:
    // 1. Send confirmation email to guest
    // 2. Send notification to admin
    // 3. Update tour availability
    // 4. Create calendar events

return NextResponse.json({
      bookingId: booking.bookingNumber,
      status: 'success',
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        bookingId: booking.bookingNumber,
        startDate: booking.travelDate,
        totalPrice: booking.totalPrice,
        status: booking.bookingStatus
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const DEMO = String(process.env.DEMO_MODE || '').toLowerCase() === 'true' || process.env.DEMO_MODE === '1'
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      if (DEMO) {
        return NextResponse.json({ bookings: [] })
      }
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (DEMO) {
      return NextResponse.json({ bookings: [] })
    }

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
