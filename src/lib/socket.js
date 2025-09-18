import { Server } from 'socket.io';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

let io = null;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://yourdomain.com'] 
          : ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Middleware for authentication
    io.use(async (socket, next) => {
      try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
          socket.userId = session.user.id;
          socket.userRole = session.user.role;
          socket.userName = session.user.name;
          socket.userEmail = session.user.email;
        }
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next();
      }
    });

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`, socket.userName || 'Anonymous');

      // Join user to their personal room
      if (socket.userId) {
        socket.join(`user_${socket.userId}`);
        
        // Join admin users to admin room
        if (socket.userRole === 'ADMIN') {
          socket.join('admins');
        } else {
          socket.join('users');
        }
      }

      // Handle live chat
      socket.on('join_chat', (data) => {
        const { bookingId, tourId } = data;
        const chatRoom = `chat_${bookingId || tourId}`;
        socket.join(chatRoom);
        
        // Notify others in the room
        socket.to(chatRoom).emit('user_joined_chat', {
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date().toISOString()
        });
        
        console.log(`${socket.userName || 'User'} joined chat: ${chatRoom}`);
      });

      // Handle chat messages
      socket.on('send_message', (data) => {
        const { chatRoom, message, bookingId, tourId } = data;
        
        const messageData = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: socket.userId,
          userName: socket.userName,
          userEmail: socket.userEmail,
          message,
          timestamp: new Date().toISOString(),
          bookingId,
          tourId
        };

        // Broadcast to chat room
        io.to(chatRoom).emit('new_message', messageData);
        
        // Notify admins of new customer messages
        if (socket.userRole !== 'ADMIN') {
          io.to('admins').emit('customer_message_alert', {
            ...messageData,
            chatRoom,
            alertType: 'new_message'
          });
        }

        console.log(`Message sent in ${chatRoom}:`, message);
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const { chatRoom } = data;
        socket.to(chatRoom).emit('user_typing', {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: true
        });
      });

      socket.on('typing_stop', (data) => {
        const { chatRoom } = data;
        socket.to(chatRoom).emit('user_typing', {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: false
        });
      });

      // Handle booking status updates
      socket.on('booking_status_update', (data) => {
        const { bookingId, status, userId } = data;
        
        // Notify the specific user
        io.to(`user_${userId}`).emit('booking_status_changed', {
          bookingId,
          status,
          timestamp: new Date().toISOString(),
          message: `Your booking status has been updated to: ${status}`
        });

        // Notify all admins
        io.to('admins').emit('booking_updated', {
          bookingId,
          status,
          userId,
          timestamp: new Date().toISOString()
        });
      });

      // Handle new booking notifications
      socket.on('new_booking', (bookingData) => {
        // Notify all admins of new booking
        io.to('admins').emit('new_booking_alert', {
          ...bookingData,
          timestamp: new Date().toISOString(),
          alertType: 'new_booking'
        });

        // Send confirmation to user
        io.to(`user_${bookingData.userId}`).emit('booking_confirmed', {
          bookingId: bookingData.bookingId,
          message: 'Your booking has been confirmed!',
          timestamp: new Date().toISOString()
        });
      });

      // Handle tour updates
      socket.on('tour_update', (tourData) => {
        // Broadcast to all users
        io.emit('tour_updated', {
          ...tourData,
          timestamp: new Date().toISOString()
        });
      });

      // Handle system announcements
      socket.on('system_announcement', (data) => {
        if (socket.userRole === 'ADMIN') {
          io.emit('announcement', {
            ...data,
            timestamp: new Date().toISOString(),
            sender: socket.userName
          });
        }
      });

      // Handle disconnect
      socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}`, reason);
        
        // Notify chat rooms about user leaving
        socket.rooms.forEach(room => {
          if (room.startsWith('chat_')) {
            socket.to(room).emit('user_left_chat', {
              userId: socket.userId,
              userName: socket.userName,
              timestamp: new Date().toISOString()
            });
          }
        });
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    console.log('Socket.io server initialized');
  }
  
  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }
  return io;
};

// Helper functions for emitting events
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

export const emitToAdmins = (event, data) => {
  if (io) {
    io.to('admins').emit(event, data);
  }
};

export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

export const emitToChatRoom = (chatRoom, event, data) => {
  if (io) {
    io.to(chatRoom).emit(event, data);
  }
};
