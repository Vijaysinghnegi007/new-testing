import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe publishable key not found. Payment features will be disabled.');
      return null;
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;

// Stripe server-side configuration
export const stripe = (() => {
  try {
    const Stripe = require('stripe');
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      console.warn('Stripe secret key not found. Server-side payment features will be disabled.');
      return null;
    }
    
    return new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  } catch (error) {
    console.warn('Stripe server configuration failed:', error.message);
    return null;
  }
})();
