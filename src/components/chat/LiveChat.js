'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot
} from 'lucide-react';
import UserPresence from '@/components/common/UserPresence';

export default function LiveChat({ bookingId, tourId, onClose }) {
  const {
    socket,
    isConnected,
    // From SocketContext API
    joinRoom,
    leaveRoom,
    sendChatMessage,
    startTyping,
    stopTyping,
    userId
  } = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [chatRoom, setChatRoom] = useState('general');
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (bookingId || tourId) {
      const room = `chat_${bookingId || tourId}`;
      setChatRoom(room);
      if (socket && isConnected) {
        // Join a specific chat room by name
        joinRoom(room);
      }
    }
  }, [bookingId, tourId, socket, isConnected, joinRoom]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new_message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
      if (data.userId !== userId) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return [...prev.filter(u => u.userId !== data.userId), data];
          } else {
            return prev.filter(u => u.userId !== data.userId);
          }
        });
      }
    });

    // Listen for user join/leave events
    socket.on('user_joined_chat', (data) => {
      if (data.userId !== userId) {
        const systemMessage = {
          id: `system_${Date.now()}`,
          type: 'system',
          message: `${data.userName} joined the chat`,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    });

    socket.on('user_left_chat', (data) => {
      if (data.userId !== userId) {
        const systemMessage = {
          id: `system_${Date.now()}`,
          type: 'system',
          message: `${data.userName} left the chat`,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_joined_chat');
      socket.off('user_left_chat');
    };
  }, [socket, userId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && chatRoom) {
      sendChatMessage(chatRoom, newMessage.trim());
      setNewMessage('');
      if (isTyping) {
        stopTyping(chatRoom);
        setIsTyping(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (value.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        startTyping(chatRoom);
      }
      const timeout = setTimeout(() => {
        setIsTyping(false);
        stopTyping(chatRoom);
      }, 2000);
      setTypingTimeout(timeout);
    } else if (isTyping) {
      setIsTyping(false);
      stopTyping(chatRoom);
      setTypingTimeout(null);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MessageBubble = ({ message }) => {
    const isOwnMessage = message.userId === userId;
    const isSystemMessage = message.type === 'system';

    if (isSystemMessage) {
      return (
        <div className="flex justify-center my-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {message.message}
          </span>
        </div>
      );
    }

    return (
      <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium">
                {isOwnMessage ? 'You' : message.userName}
              </span>
              {!isOwnMessage && message.userId && (
                <UserPresence 
                  userId={message.userId} 
                  showLastSeen={false} 
                  size="sm" 
                />
              )}
            </div>
            <span className="text-xs opacity-70">
              {formatTime(message.timestamp)}
            </span>
          </div>
          <p className="text-sm">{message.message}</p>
        </div>
      </div>
    );
  };

  const TypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    const getTypingText = () => {
      if (typingUsers.length === 1) {
        return `${typingUsers[0].userName} is typing...`;
      } else if (typingUsers.length === 2) {
        return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
      } else {
        return `${typingUsers.length} people are typing...`;
      }
    };

    return (
      <div className="flex justify-start mb-4">
        <div className="bg-gray-100 px-4 py-2 rounded-lg max-w-xs">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">{getTypingText()}</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Chat trigger button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary-hover shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        {!isConnected && (
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 ${isMinimized ? 'h-14' : 'h-96'} transition-all duration-300`}>
      <Card className="h-full flex flex-col shadow-xl">
        {/* Header */}
        <CardHeader className="p-4 bg-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm">Live Support</CardTitle>
                <CardDescription className="text-xs text-blue-100">
                  {isConnected ? (
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 bg-green-400 rounded-full" />
                      <span>Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 bg-red-400 rounded-full" />
                      <span>Connecting...</span>
                    </div>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  onClose?.();
                }}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto bg-white">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bot className="h-12 w-12 mb-2" />
                  <p className="text-sm text-center">
                    Welcome to live support! How can we help you today?
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  
                  {/* Typing indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {typingUsers[0].userName} is typing...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              {!isConnected && (
                <p className="text-xs text-red-500 mt-2">
                  Reconnecting to chat...
                </p>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
