'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { useSocket } from '@/contexts/SocketContext';
import { useI18n } from '@/contexts/I18nContext';
import { 
  MapPin, 
  Menu, 
  X, 
  Search,
  User,
  Heart,
  ShoppingBag,
  LogOut,
  Settings,
  CreditCard,
  Bell,
  Briefcase
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [canPrefetch, setCanPrefetch] = useState(true);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { notifications, unreadCount, toggleNotificationPanel } = useSocket();
  const userMenuRef = useRef(null);

  // Decide if link prefetching should be enabled based on network conditions
  useEffect(() => {
    try {
      const conn = typeof navigator !== 'undefined' ? navigator.connection : undefined;
      if (!conn) return; // keep default true
      const fastEnough = conn.effectiveType === '4g';
      const saverOff = conn.saveData !== true;
      setCanPrefetch(Boolean(fastEnough && saverOff));
    } catch {
      // keep default true
    }
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { t, setLocale, locale } = useI18n();

  const navigation = [
    { key: 'home', href: '/' },
    { key: 'tours', href: '/tours' },
    { key: 'destinations', href: '/destinations' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background shadow-sm border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                TravelWeb
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                prefetch={canPrefetch}
                className={cn(
                  'text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href && 'text-primary bg-accent'
                )}
              >
                {t(`nav.${item.key}`, item.key)}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
              <Link href="/wishlist" prefetch={false}>
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Bookings */}
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            
            {/* Notifications */}
            {session && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={toggleNotificationPanel}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            )}
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1">
              <Button variant={locale === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLocale('en')}>EN</Button>
              <Button variant={locale === 'es' ? 'default' : 'outline'} size="sm" onClick={() => setLocale('es')}>ES</Button>
            </div>
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </div>
            ) : session ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline-block">
                    {session.user.firstName || session.user.name?.split(' ')[0] || 'User'}
                  </span>
                </Button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {session.user.name || `${session.user.firstName} ${session.user.lastName}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                    
                    <Link href="/settings" prefetch={false} className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                    
                    {(session.user.role === 'VENDOR' || session.user.role === 'ADMIN') && (
                      <Link href="/vendor" prefetch={false} className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Vendor Portal
                      </Link>
                    )}
                    
                    <Link href="/profile" prefetch={false} className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    
                    <Link href="/bookings" prefetch={false} className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent">
                      <CreditCard className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                    
                    <Link href="/wishlist" prefetch={false} className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Link>
                    
                    <hr className="my-1 border-border" />
                    
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/signin">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/auth/signup">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors',
                    pathname === item.href && 'text-primary bg-accent'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(`nav.${item.key}`, item.key)}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex items-center px-3">
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
