'use client';

import React from 'react';
import { useSocket } from '@/contexts/SocketContext';

const UserPresence = ({ 
  userId, 
  showLastSeen = true, 
  className = '',
  size = 'sm' // sm, md, lg
}) => {
  const { socket } = useSocket();
  const [presence, setPresence] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;

    // Fetch initial presence
    fetchPresence();

    // Listen for presence updates
    if (socket) {
      socket.on('presence_update', (data) => {
        if (data.userId === userId) {
          setPresence(data);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('presence_update');
      }
    };
  }, [userId, socket]);

  const fetchPresence = async () => {
    try {
      const response = await fetch(`/api/users/presence/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPresence(data);
      }
    } catch (error) {
      console.error('Error fetching user presence:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diff = now - lastSeen;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return lastSeen.toLocaleDateString();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'h-4 w-4';
      case 'md':
        return 'h-3 w-3';
      case 'sm':
      default:
        return 'h-2 w-2';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`${getSizeClasses()} bg-gray-300 rounded-full animate-pulse`} />
        {showLastSeen && size !== 'sm' && (
          <span className="text-xs text-gray-400">Loading...</span>
        )}
      </div>
    );
  }

  if (!presence) return null;

  const isOnline = presence.isOnline;
  const lastSeenText = formatLastSeen(presence.lastSeenAt);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div
          className={`${getSizeClasses()} rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        {isOnline && (
          <div
            className={`absolute inset-0 ${getSizeClasses()} bg-green-500 rounded-full animate-ping opacity-75`}
          />
        )}
      </div>
      
      {showLastSeen && size !== 'sm' && (
        <span className="text-xs text-gray-500">
          {isOnline ? 'Online' : `Last seen ${lastSeenText}`}
        </span>
      )}
    </div>
  );
};

export default UserPresence;
