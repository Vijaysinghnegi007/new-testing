'use client';

import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@/contexts/SocketContext';

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function Providers({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AuthProvider>
  );
}
