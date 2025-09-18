'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      // Initialize socket connection
      const socketInstance = io({
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      setSocket(socketInstance);

      // Connection event handlers
      socketInstance.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected:', socketInstance.id);
        
        // Authenticate user
        socketInstance.emit('authenticate', {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || `${session.user.firstName} ${session.user.lastName}`,
          role: session.user.role
        });
        
        // Join default room
        socketInstance.emit('join_room', currentRoom);
      });

      socketInstance.on('authenticated', async (data) => {
        console.log('User authenticated:', data);
        
        // Load existing notifications from database
        try {
          const response = await fetch('/api/notifications?limit=50');
          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
          }
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      });

      socketInstance.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('Socket disconnected:', reason);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Chat message handlers
      socketInstance.on('new_message', (messageData) => {
        setMessages(prev => [...prev, messageData]);
      });

      socketInstance.on('user_typing_start', (data) => {
        setTypingUsers(prev => {
          if (!prev.find(user => user.userId === data.userId)) {
            return [...prev, data];
          }
          return prev;
        });
      });

      socketInstance.on('user_typing_stop', (data) => {
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
      });

      // Notification handlers
      socketInstance.on('notification', (notification) => {
        console.log('New notification:', notification);
        addNotification(notification);
        
        // Show toast notification
        if (notification.type === 'booking') {
          toast.success(notification.title);
        } else if (notification.type === 'payment') {
          toast.success(notification.title);
        } else if (notification.type === 'system') {
          toast.warning(notification.title);
        } else {
          toast.info(notification.title);
        }
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [session, currentRoom]);

  // Helper functions
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50));
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: [notificationId]
        }),
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId && !notif.isRead
              ? { ...notif, isRead: true, readAt: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markAllAsRead: true
        }),
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleteAll: true
        }),
      });
      
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(prev => !prev);
  };

  // Chat methods
  const joinRoom = async (room) => {
    if (socket && room !== currentRoom) {
      if (currentRoom) {
        socket.emit('leave_room', currentRoom);
      }
      socket.emit('join_room', room);
      setCurrentRoom(room);
      
      // Load chat history from database
      try {
        // First ensure room exists by joining it via API
        await fetch('/api/chat/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: room,
            description: `${room.charAt(0).toUpperCase() + room.slice(1)} chat room`
          }),
        });

        // Then load recent messages
        const response = await fetch(`/api/chat/messages?roomId=${encodeURIComponent(room)}&limit=50`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        setMessages([]);
      }
    }
  };

  const leaveRoom = (room) => {
    if (socket) {
      socket.emit('leave_room', room);
    }
  };

  const sendChatMessage = (room, message) => {
    if (socket && message.trim()) {
      socket.emit('send_message', { room, message });
    }
  };

  const startTyping = (room) => {
    if (socket) {
      socket.emit('typing_start', { room });
    }
  };

  const stopTyping = (room) => {
    if (socket) {
      socket.emit('typing_stop', { room });
    }
  };

  // Simulation methods for testing
  const simulateBookingUpdate = (bookingData) => {
    if (socket) {
      socket.emit('booking_update', bookingData);
    }
  };

  const simulateTourUpdate = (tourData) => {
    if (socket) {
      socket.emit('tour_update', tourData);
    }
  };

  const simulateAdminNotification = (notificationData) => {
    if (socket) {
      socket.emit('admin_notification', notificationData);
    }
  };

  const value = {
    // Socket state
    socket,
    isConnected,
    
    // Messages
    messages,
    typingUsers,
    currentRoom,
    
    // Notifications
    notifications,
    unreadCount,
    isNotificationPanelOpen,
    
    // Notification methods
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    toggleNotificationPanel,
    
    // Chat methods
    joinRoom,
    leaveRoom,
    sendChatMessage,
    startTyping,
    stopTyping,
    
    // Simulation methods
    simulateBookingUpdate,
    simulateTourUpdate,
    simulateAdminNotification,
    
    // User info
    isAdmin: session?.user?.role === 'admin',
    userId: session?.user?.id,
    userName: session?.user?.name || `${session?.user?.firstName} ${session?.user?.lastName}`
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
