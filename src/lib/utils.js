import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function getClientLocale() {
  try {
    if (typeof document !== 'undefined') {
      const m = document.cookie.match(/(?:^|; )LOCALE=(en|es)/)
      if (m) return m[1] === 'es' ? 'es-ES' : 'en-US'
    }
  } catch {}
  return 'en-US'
}

export function formatPrice(amount, currency = 'USD', locale) {
  const loc = locale || getClientLocale();
  try {
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  }
}

export function formatDate(date, options = {}, locale) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const loc = locale || getClientLocale();
  try {
    return new Date(date).toLocaleDateString(loc, {
      ...defaultOptions,
      ...options,
    });
  } catch {
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options })
  }
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function generateBookingNumber() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TW-${timestamp.slice(-6)}-${random}`;
}

export function calculateDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end - start;
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
