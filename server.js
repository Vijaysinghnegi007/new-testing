const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const { PrismaClient } = require('@prisma/client');
const { NotificationService } = require('./src/lib/notification-service.js');
const { BookingService } = require('./src/lib/booking-service.js');

const prisma = new PrismaClient();
const notificationService = new NotificationService();
let bookingService;

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// When using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  const io = new Server(httpServer, {
    cors: {
      origin: [`http://${hostname}:${port}`, 'http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Initialize booking service with io instance
  bookingService = new BookingService(io);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Authentication
    socket.on('authenticate', async (userData) => {
      try {
        socket.userId = userData.id;
        socket.userEmail = userData.email;
        socket.userName = userData.name;
        socket.isAdmin = userData.role === 'admin';
        
        console.log('User authenticated:', userData.name);
        
        // Update user presence
        const presence = await prisma.userPresence.upsert({
          where: { userId: userData.id },
          update: {
            isOnline: true,
            socketId: socket.id,
            lastSeenAt: new Date()
          },
          create: {
            userId: userData.id,
            isOnline: true,
            socketId: socket.id,
            lastSeenAt: new Date()
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
          }
        });

        // Broadcast presence update to all connected clients
        io.emit('presence_update', {
          userId: presence.userId,
          isOnline: presence.isOnline,
          lastSeenAt: presence.lastSeenAt,
          user: presence.user
        });
        
        // Join user to their personal room
        socket.join(`user_${userData.id}`);
        
        // Join admins to admin room
        if (socket.isAdmin) {
          socket.join('admin_room');
        }
        
        socket.emit('authenticated', { success: true });
      } catch (error) {
        console.error('Error during authentication:', error);
        socket.emit('auth_error', { error: 'Authentication failed' });
      }
    });

    // Chat events
    socket.on('join_room', (room) => {
      socket.join(room);
      socket.currentRoom = room;
      console.log(`User ${socket.userName} joined room: ${room}`);
      socket.to(room).emit('user_joined', {
        userId: socket.userId,
        userName: socket.userName,
        room
      });
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
      console.log(`User ${socket.userName} left room: ${room}`);
      socket.to(room).emit('user_left', {
        userId: socket.userId,
        userName: socket.userName,
        room
      });
    });

    socket.on('send_message', async (data) => {
      try {
        // First, ensure the room exists and user is a participant
        let room = await prisma.chatRoom.findUnique({
          where: { name: data.room }
        });

        if (!room) {
          // Create room if it doesn't exist
          room = await prisma.chatRoom.create({
            data: {
              name: data.room,
              description: `${data.room.charAt(0).toUpperCase() + data.room.slice(1)} chat room`
            }
          });
        }

        // Ensure user is a participant
        const participant = await prisma.chatRoomParticipant.upsert({
          where: {
            roomId_userId: {
              roomId: room.id,
              userId: socket.userId
            }
          },
          update: {
            lastSeenAt: new Date()
          },
          create: {
            roomId: room.id,
            userId: socket.userId
          }
        });

        // Save message to database
        const savedMessage = await prisma.chatMessage.create({
          data: {
            roomId: room.id,
            userId: socket.userId,
            message: data.message
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
          }
        });

        const messageData = {
          id: savedMessage.id,
          message: savedMessage.message,
          room: data.room,
          user: {
            id: savedMessage.user.id,
            name: `${savedMessage.user.firstName || ''} ${savedMessage.user.lastName || ''}`.trim(),
            firstName: savedMessage.user.firstName,
            lastName: savedMessage.user.lastName,
            profileImage: savedMessage.user.profileImage
          },
          timestamp: savedMessage.createdAt.toISOString(),
          createdAt: savedMessage.createdAt,
          updatedAt: savedMessage.updatedAt
        };

        // Send to all users in the room
        io.to(data.room).emit('new_message', messageData);
        console.log(`Message saved and sent to room ${data.room}:`, messageData);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('typing_start', (data) => {
      socket.to(data.room).emit('user_typing_start', {
        userId: socket.userId,
        userName: socket.userName,
        room: data.room
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.room).emit('user_typing_stop', {
        userId: socket.userId,
        userName: socket.userName,
        room: data.room
      });
    });

    // Booking events
    socket.on('booking_update', async (bookingData) => {
      try {
        // Send notification to admins using notification service
        await notificationService.sendAdminNotification(
          io,
          'BOOKING',
          `Booking ${bookingData.status}`,
          `${bookingData.customerName} - ${bookingData.tourName} ($${bookingData.amount})`,
          bookingData
        );
        
        // Send to specific user if they have a booking
        if (bookingData.userId) {
          await notificationService.sendNotification(
            io,
            bookingData.userId,
            'BOOKING',
            'Booking Update',
            `Your booking for ${bookingData.tourName} has been ${bookingData.status}`,
            bookingData
          );
        }
      } catch (error) {
        console.error('Error handling booking update:', error);
      }
    });

    // Tour events
    socket.on('tour_update', async (tourData) => {
      try {
        await notificationService.sendAdminNotification(
          io,
          'TOUR',
          'Tour Update',
          `${tourData.name} - Status: ${tourData.status}`,
          tourData
        );
      } catch (error) {
        console.error('Error handling tour update:', error);
      }
    });

    // Admin notifications
    socket.on('admin_notification', async (notificationData) => {
      try {
        await notificationService.sendAdminNotification(
          io,
          notificationData.type || 'SYSTEM',
          notificationData.title,
          notificationData.message,
          notificationData.data
        );
      } catch (error) {
        console.error('Error handling admin notification:', error);
      }
    });

    // Generic notification broadcast
    socket.on('broadcast_notification', (notificationData) => {
      const notification = {
        id: `notif_${Date.now()}`,
        ...notificationData,
        timestamp: new Date().toISOString(),
        read: false
      };

      io.emit('notification', notification);
    });

    // Real-time booking events
    socket.on('create_booking', async (bookingData) => {
      try {
        const booking = await bookingService.createBooking(bookingData);
        socket.emit('booking_created', {
          success: true,
          booking: {
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            status: booking.bookingStatus,
            totalPrice: booking.totalPrice
          }
        });
      } catch (error) {
        console.error('Error creating booking:', error);
        socket.emit('booking_error', { error: 'Failed to create booking' });
      }
    });

    socket.on('update_booking_status', async (data) => {
      try {
        if (!socket.isAdmin) {
          socket.emit('booking_error', { error: 'Unauthorized' });
          return;
        }
        
        await bookingService.updateBookingStatus(data.bookingId, data.status, data.updateData);
        socket.emit('booking_status_updated', { success: true });
      } catch (error) {
        console.error('Error updating booking status:', error);
        socket.emit('booking_error', { error: 'Failed to update booking status' });
      }
    });

    socket.on('process_payment', async (data) => {
      try {
        const result = await bookingService.processPayment(data.bookingId, data.paymentData);
        socket.emit('payment_processed', {
          success: true,
          payment: {
            id: result.payment.id,
            status: result.payment.status,
            amount: result.payment.amount
          }
        });
      } catch (error) {
        console.error('Error processing payment:', error);
        socket.emit('payment_error', { error: 'Failed to process payment' });
      }
    });

    socket.on('simulate_booking_flow', async (data) => {
      try {
        await bookingService.simulateBookingFlow(data.bookingId);
        socket.emit('booking_simulation_started', { success: true });
      } catch (error) {
        console.error('Error simulating booking flow:', error);
        socket.emit('booking_error', { error: 'Failed to simulate booking flow' });
      }
    });

    socket.on('disconnect', async (reason) => {
      try {
        console.log('Client disconnected:', socket.id, 'Reason:', reason);
        
        // Update user presence if user was authenticated
        if (socket.userId) {
          const presence = await prisma.userPresence.update({
            where: { userId: socket.userId },
            data: {
              isOnline: false,
              lastSeenAt: new Date(),
              socketId: null
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
            }
          });

          // Broadcast presence update to all connected clients
          io.emit('presence_update', {
            userId: presence.userId,
            isOnline: presence.isOnline,
            lastSeenAt: presence.lastSeenAt,
            user: presence.user
          });
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port} with Socket.io`);
  });
});
