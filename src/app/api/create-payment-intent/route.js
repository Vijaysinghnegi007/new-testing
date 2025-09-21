import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Important: do NOT instantiate Stripe at module load time.
// This avoids build-time errors when STRIPE_SECRET_KEY is not configured.
export async function POST(request) {
  try {
    const { amount, bookingData } = await request.json();

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum $0.50 required.' },
        { status: 400 }
      );
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      console.error('STRIPE_SECRET_KEY is not set. Payment processing is not configured.');
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secret);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: 'usd',
      metadata: {
        tourTitle: bookingData.tour.title,
        startDate: bookingData.startDate,
        guests: bookingData.guests.toString(),
        guestName: `${bookingData.guestInfo.firstName} ${bookingData.guestInfo.lastName}`,
        guestEmail: bookingData.guestInfo.email,
      },
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
