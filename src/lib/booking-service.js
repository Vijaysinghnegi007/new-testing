const { PrismaClient } = require('@prisma/client');
const { NotificationService } = require('./notification-service.js');

const prisma = new PrismaClient();

class BookingService {
  constructor(io) {
    this.io = io;
    this.prisma = prisma;
    this.notificationService = new NotificationService();
  }

  // Create a new booking with real-time updates
  async createBooking(bookingData) {
    try {
      const booking = await this.prisma.booking.create({
        data: {
          ...bookingData,
          bookingNumber: this.generateBookingNumber(),
          bookedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          tour: {
            select: {
              id: true,
              title: true,
              basePrice: true
            }
          },
          availability: {
            select: {
              startDate: true,
              endDate: true
            }
          }
        }
      });

      // Send real-time notification to user
      await this.notificationService.sendNotification(
        this.io,
        booking.userId,
        'BOOKING',
        'Booking Confirmed',
        `Your booking for ${booking.tour.title} has been confirmed. Booking #${booking.bookingNumber}`,
        {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          tourTitle: booking.tour.title,
          totalPrice: booking.totalPrice
        }
      );

      // Send notification to admins
      await this.notificationService.sendAdminNotification(
        this.io,
        'BOOKING',
        'New Booking Received',
        `${booking.user.firstName} ${booking.user.lastName} booked ${booking.tour.title} for $${booking.totalPrice}`,
        {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          customerName: `${booking.user.firstName} ${booking.user.lastName}`,
          tourTitle: booking.tour.title,
          totalPrice: booking.totalPrice,
          travelDate: booking.travelDate
        }
      );

      // Emit real-time booking update
      this.io.emit('booking_created', {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.bookingStatus,
        timestamp: booking.bookedAt.toISOString()
      });

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Update booking status with real-time notifications
  async updateBookingStatus(bookingId, newStatus, updateData = {}) {
    try {
      const booking = await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          bookingStatus: newStatus,
          ...updateData
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          tour: {
            select: {
              title: true
            }
          }
        }
      });

      const statusMessages = {
        PENDING: 'Your booking is being processed',
        CONFIRMED: 'Your booking has been confirmed',
        CANCELLED: 'Your booking has been cancelled',
        COMPLETED: 'Your trip has been completed',
        REFUNDED: 'Your booking has been refunded'
      };

      // Send notification to user about status change
      await this.notificationService.sendNotification(
        this.io,
        booking.userId,
        'BOOKING',
        'Booking Status Update',
        `${statusMessages[newStatus]} - ${booking.tour.title}`,
        {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          oldStatus: booking.bookingStatus,
          newStatus: newStatus,
          tourTitle: booking.tour.title
        }
      );

      // Send notification to admins
      await this.notificationService.sendAdminNotification(
        this.io,
        'BOOKING',
        'Booking Status Changed',
        `Booking #${booking.bookingNumber} status changed to ${newStatus}`,
        {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          customerName: `${booking.user.firstName} ${booking.user.lastName}`,
          newStatus: newStatus,
          tourTitle: booking.tour.title
        }
      );

      // Emit real-time booking update
      this.io.emit('booking_status_changed', {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        oldStatus: booking.bookingStatus,
        newStatus: newStatus,
        timestamp: new Date().toISOString()
      });

      // Send specific update to user's room
      this.io.to(`user_${booking.userId}`).emit('user_booking_updated', {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        status: newStatus,
        message: statusMessages[newStatus],
        timestamp: new Date().toISOString()
      });

      return booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Process payment with real-time updates
  async processPayment(bookingId, paymentData) {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          tour: {
            select: {
              title: true
            }
          }
        }
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          bookingId: bookingId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'USD',
          paymentMethod: paymentData.paymentMethod,
          stripePaymentId: paymentData.stripePaymentId,
          status: paymentData.status,
          paidAt: paymentData.status === 'PAID' ? new Date() : null
        }
      });

      // Update booking payment status
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: paymentData.status,
          bookingStatus: paymentData.status === 'PAID' ? 'CONFIRMED' : 'PENDING'
        }
      });

      const paymentMessages = {
        PAID: 'Payment successful! Your booking is confirmed.',
        FAILED: 'Payment failed. Please try again.',
        PENDING: 'Payment is being processed...',
        REFUNDED: 'Payment has been refunded.'
      };

      // Send payment notification to user
      await this.notificationService.sendNotification(
        this.io,
        booking.userId,
        'PAYMENT',
        'Payment Update',
        `${paymentMessages[paymentData.status]} - ${booking.tour.title}`,
        {
          bookingId: booking.id,
          paymentId: payment.id,
          amount: payment.amount,
          status: payment.status,
          tourTitle: booking.tour.title
        }
      );

      // Send payment notification to admins
      if (paymentData.status === 'PAID') {
        await this.notificationService.sendAdminNotification(
          this.io,
          'PAYMENT',
          'Payment Received',
          `Payment of $${payment.amount} received for booking #${booking.bookingNumber}`,
          {
            bookingId: booking.id,
            paymentId: payment.id,
            amount: payment.amount,
            customerName: `${booking.user.firstName} ${booking.user.lastName}`
          }
        );
      }

      // Emit real-time payment update
      this.io.to(`user_${booking.userId}`).emit('payment_processed', {
        bookingId: booking.id,
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        message: paymentMessages[paymentData.status],
        timestamp: payment.paidAt || payment.createdAt
      });

      return { booking, payment };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Get real-time booking updates for a user
  async getUserBookings(userId) {
    try {
      const bookings = await this.prisma.booking.findMany({
        where: { userId },
        include: {
          tour: {
            select: {
              title: true,
              images: true,
              basePrice: true
            }
          },
          payments: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  // Generate unique booking number
  generateBookingNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `TW${year}${month}${day}${random}`;
  }

  // Simulate booking status changes for demo
  async simulateBookingFlow(bookingId) {
    try {
      const stages = [
        { status: 'PENDING', delay: 0 },
        { status: 'CONFIRMED', delay: 3000 },
        { status: 'COMPLETED', delay: 8000 }
      ];

      for (const stage of stages) {
        setTimeout(async () => {
          await this.updateBookingStatus(bookingId, stage.status);
        }, stage.delay);
      }
    } catch (error) {
      console.error('Error simulating booking flow:', error);
    }
  }
}

module.exports = { BookingService };
