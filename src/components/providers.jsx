'use client';

import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@/contexts/SocketContext';
import { I18nProvider } from '@/contexts/I18nContext';

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function Providers({ children }) {
  return (
    <AuthProvider>
      <I18nProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </I18nProvider>
    </AuthProvider>
  );
}
