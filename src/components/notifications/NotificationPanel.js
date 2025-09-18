'use client'

import React, { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  MessageSquare,
  Package,
  AlertCircle,
  Info,
  Settings,
  Eye,
  Clock,
  User
} from 'lucide-react';

export default function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    isAdmin,
    isNotificationPanelOpen,
    toggleNotificationPanel
  } = useSocket();

  const [filter, setFilter] = useState('all'); // all, unread, admin, user

  const getNotificationIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'BOOKING':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'TOUR':
        return <Info className="h-4 w-4 text-purple-600" />;
      case 'PAYMENT':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'SYSTEM':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'PROMOTION':
        return <Settings className="h-4 w-4 text-orange-600" />;
      case 'MESSAGE':
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type, isRead) => {
    const baseClasses = isRead ? 'bg-gray-50' : 'bg-white border-l-4';
    
    switch (type?.toUpperCase()) {
      case 'BOOKING':
        return `${baseClasses} ${!isRead ? 'border-l-green-500' : ''}`;
      case 'PAYMENT':
        return `${baseClasses} ${!isRead ? 'border-l-blue-500' : ''}`;
      case 'MESSAGE':
        return `${baseClasses} ${!isRead ? 'border-l-orange-500' : ''}`;
      case 'TOUR':
        return `${baseClasses} ${!isRead ? 'border-l-purple-500' : ''}`;
      case 'SYSTEM':
        return `${baseClasses} ${!isRead ? 'border-l-red-500' : ''}`;
      case 'PROMOTION':
        return `${baseClasses} ${!isRead ? 'border-l-orange-500' : ''}`;
      default:
        return `${baseClasses} ${!isRead ? 'border-l-gray-500' : ''}`;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'admin':
        return ['BOOKING', 'PAYMENT', 'SYSTEM'].includes(notification.type);
      case 'user':
        return ['BOOKING', 'TOUR', 'PROMOTION'].includes(notification.type);
      default:
        return true;
    }
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }

    // Handle notification-specific actions
    switch (notification.type?.toUpperCase()) {
      case 'BOOKING':
        // Redirect to booking details or admin panel
        if (isAdmin) {
          window.location.href = `/admin/bookings`;
        } else {
          window.location.href = '/bookings';
        }
        break;
      case 'MESSAGE':
        // Open chat or redirect to messages
        console.log('Open chat:', notification.data?.chatRoom);
        break;
      case 'TOUR':
        // Redirect to tour details
        if (notification.data?.tourId) {
          window.location.href = `/tours/${notification.data.slug || notification.data.tourId}`;
        }
        break;
      case 'PAYMENT':
        // Redirect to payment or booking details
        window.location.href = '/bookings';
        break;
      default:
        break;
    }
  };

  if (!isNotificationPanelOpen) return null;

  return (
    <div className="fixed top-16 right-4 w-96 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNotificationPanel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2 mt-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setFilter('all')}
              className="text-xs px-2 py-1"
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setFilter('unread')}
              className="text-xs px-2 py-1"
            >
              Unread
            </Button>
            {isAdmin && (
              <Button
                variant={filter === 'admin' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setFilter('admin')}
                className="text-xs px-2 py-1"
              >
                Admin
              </Button>
            )}
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex justify-end space-x-2 mt-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 text-blue-600 hover:text-blue-700"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="xs"
                onClick={clearNotifications}
                className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mb-2 opacity-30" />
                <p className="text-sm text-center">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${getNotificationColor(notification.type, notification.isRead)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-1">
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-blue-600 rounded-full" />
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt || notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      
                      {/* Additional notification data */}
                      {notification.data && (
                        <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                          {notification.data.bookingId && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Booking: {notification.data.bookingId}
                            </span>
                          )}
                          {notification.data.tourTitle && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Tour: {notification.data.tourTitle}
                            </span>
                          )}
                          {notification.data.customerName && (
                            <span className="bg-gray-100 px-2 py-1 rounded flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {notification.data.customerName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
