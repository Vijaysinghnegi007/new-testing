'use client';

import React, { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  MessageSquare,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Send,
  Settings
} from 'lucide-react';
import { toast } from 'react-toastify';

const RealtimeDemoPage = () => {
  const { data: session } = useSession();
  const { 
    socket, 
    notifications, 
    unreadCount,
    sendChatMessage,
    joinRoom,
    leaveRoom,
    simulateBookingUpdate,
    simulateTourUpdate,
    simulateAdminNotification
  } = useSocket();

  const [chatMessage, setChatMessage] = useState('');
  const [room, setRoom] = useState('general');
  const [notificationType, setNotificationType] = useState('booking');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSendMessage = () => {
    if (chatMessage.trim() && session) {
      sendChatMessage(room, chatMessage);
      setChatMessage('');
    }
  };

  const handleSimulateNotification = () => {
    if (!notificationTitle || !notificationMessage) return;

    const mockData = {
      booking: {
        id: `booking_${Date.now()}`,
        tourName: 'Paris City Tour',
        customerName: 'John Doe',
        status: 'confirmed',
        amount: 299
      },
      tour: {
        id: `tour_${Date.now()}`,
        name: 'Tokyo Adventure',
        status: 'published',
        bookings: 15
      }
    };

    if (notificationType === 'booking') {
      simulateBookingUpdate(mockData.booking);
    } else if (notificationType === 'tour') {
      simulateTourUpdate(mockData.tour);
    } else {
      simulateAdminNotification({
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType
      });
    }

    setNotificationTitle('');
    setNotificationMessage('');
  };

  const handleJoinRoom = (roomName) => {
    joinRoom(roomName);
    setRoom(roomName);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Real-time Features Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Test the Socket.io integration with live chat, notifications, and real-time updates. 
            {!session && " Please sign in to access all features."}
          </p>
        </div>

        {!session ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Authentication Required</CardTitle>
              <CardDescription className="text-center">
                Please sign in to test the real-time features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/auth/signin">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${socket?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                  Socket Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> {socket?.connected ? 'Connected' : 'Disconnected'}</p>
                  <p><strong>Socket ID:</strong> {socket?.id || 'N/A'}</p>
                  <p><strong>User:</strong> {session.user.name}</p>
                  <p><strong>Current Room:</strong> {room}</p>
                </div>
              </CardContent>
            </Card>

            {/* Live Chat Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Room</Label>
                  <div className="flex gap-2 mt-1">
                    <Button 
                      size="sm" 
                      variant={room === 'general' ? 'default' : 'outline'}
                      onClick={() => handleJoinRoom('general')}
                    >
                      General
                    </Button>
                    <Button 
                      size="sm" 
                      variant={room === 'support' ? 'default' : 'outline'}
                      onClick={() => handleJoinRoom('support')}
                    >
                      Support
                    </Button>
                    <Button 
                      size="sm" 
                      variant={room === 'vip' ? 'default' : 'outline'}
                      onClick={() => handleJoinRoom('vip')}
                    >
                      VIP
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="chatMessage">Message</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="chatMessage"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Open the live chat widget in the bottom-right to see messages.
                </p>
              </CardContent>
            </Card>

            {/* Notifications Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications ({unreadCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {recentNotifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-2 rounded text-sm border ${!notif.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="font-medium">{notif.title}</div>
                        <div className="text-gray-600 text-xs">{notif.message}</div>
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No recent notifications</p>
                )}
              </CardContent>
            </Card>

            {/* Simulate Notifications */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Simulate Real-time Events</CardTitle>
                <CardDescription>
                  Generate test notifications and updates to see the real-time system in action.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Event Type</Label>
                    <Select value={notificationType} onValueChange={setNotificationType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Update</SelectItem>
                        <SelectItem value="tour">Tour Update</SelectItem>
                        <SelectItem value="payment">Payment Alert</SelectItem>
                        <SelectItem value="system">System Alert</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notifTitle">Title</Label>
                    <Input
                      id="notifTitle"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      placeholder="Notification title..."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notifMessage">Message</Label>
                  <Textarea
                    id="notifMessage"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Notification message..."
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleSimulateNotification} disabled={!notificationTitle || !notificationMessage}>
                  Send Test Notification
                </Button>
              </CardContent>
            </Card>

            {/* Booking Status Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Booking Status</CardTitle>
                <CardDescription>
                  Simulate live booking status updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (socket) {
                      const mockBookingId = `demo_booking_${Date.now()}`;
                      socket.emit('simulate_booking_flow', { bookingId: mockBookingId });
                      toast.info('Simulating booking status changes...');
                    }
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Simulate Booking Flow
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (socket) {
                      socket.emit('process_payment', {
                        bookingId: 'demo_booking_123',
                        paymentData: {
                          amount: 299,
                          currency: 'USD',
                          paymentMethod: 'stripe',
                          status: 'PAID'
                        }
                      });
                    }
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Simulate Payment
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Test Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                    onClick={() => {
                      setNotificationType('booking');
                      setNotificationTitle('New Booking Confirmed');
                      setNotificationMessage('John Doe has booked the Paris City Tour for $299');
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Booking Confirmed
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    asChild
                  >
                    <a href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Notification Settings
                    </a>
                  </Button>
                
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    asChild
                  onClick={() => {
                    setNotificationType('payment');
                    setNotificationTitle('Payment Received');
                    setNotificationMessage('Payment of $299 received for booking #12345');
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Received
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setNotificationType('tour');
                    setNotificationTitle('Tour Capacity Alert');
                    setNotificationMessage('Tokyo Adventure tour is 90% booked');
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Capacity Alert
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setNotificationType('system');
                    setNotificationTitle('System Maintenance');
                    setNotificationMessage('Scheduled maintenance tonight at 2 AM EST');
                  }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  System Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeDemoPage;
