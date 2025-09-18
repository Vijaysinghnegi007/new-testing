'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Shield,
  CheckCircle
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Step 1: Guest Information
const GuestInfoStep = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Guest Information</h2>
        <p className="text-muted-foreground">Please provide details for the lead traveler</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              className="pl-10"
              value={formData.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
          </div>
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              className="pl-10"
              value={formData.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="pl-10"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            className="pl-10"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            type="text"
            placeholder="Enter address (optional)"
            className="pl-10"
            value={formData.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <Shield className="inline h-4 w-4 mr-2" />
          Your personal information is encrypted and secure. We never share your data with third parties.
        </p>
      </div>
    </div>
  );
};

// Step 2: Booking Details Review
const BookingReviewStep = ({ formData, bookingData }) => {
  const { tour, startDate, guests, totalPrice } = bookingData;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Booking</h2>
        <p className="text-muted-foreground">Please review all details before proceeding to payment</p>
      </div>

      {/* Tour Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Tour Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-foreground">{tour.title}</h3>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {tour.destination}
              </p>
            </div>
            <Badge variant="secondary">{tour.category}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{new Date(startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{tour.duration} days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Guests</p>
              <p className="font-medium">{guests} {guests === 1 ? 'person' : 'people'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price per person</p>
              <p className="font-medium">${tour.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Lead Traveler Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{formData.firstName} {formData.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{formData.phone}</p>
            </div>
            {formData.address && (
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{formData.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Tour price × {guests} guests</span>
            <span>${tour.price * guests}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>$99</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>$89</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Step 3: Payment
const PaymentStep = ({ formData, bookingData, onPaymentSuccess, processing, setProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState('');

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setPaymentError('');

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingData.totalPrice * 100, // Stripe expects cents
          bookingData: {
            ...bookingData,
            guestInfo: formData
          }
        }),
      });

      const { client_secret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      setPaymentError('An error occurred while processing your payment.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Payment Details</h2>
        <p className="text-muted-foreground">Your payment is secured with 256-bit SSL encryption</p>
      </div>

      {/* Payment Summary */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-primary">${bookingData.totalPrice}</span>
          </div>
        </CardContent>
      </Card>

      {/* Card Details */}
      <Card>
        <CardHeader>
          <CardTitle>Card Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: 'hsl(var(--foreground))',
                    '::placeholder': {
                      color: 'hsl(var(--muted-foreground))',
                    },
                  },
                },
              }}
            />
          </div>
          
          {paymentError && (
            <p className="text-sm text-destructive">{paymentError}</p>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <Shield className="inline h-4 w-4 mr-2" />
              Your payment information is encrypted and processed securely by Stripe.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handlePayment}
        disabled={!stripe || processing}
        className="w-full"
        size="lg"
        variant="gradient"
      >
        {processing ? 'Processing...' : `Pay $${bookingData.totalPrice}`}
      </Button>
    </div>
  );
};

// Step 4: Confirmation
const ConfirmationStep = ({ bookingConfirmation }) => {
  const router = useRouter();

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          Your booking has been confirmed. We&apos;ve sent a confirmation email with all the details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              #{bookingConfirmation.bookingId}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          onClick={() => router.push('/my-bookings')}
          className="w-full"
          variant="gradient"
        >
          View My Bookings
        </Button>
        <Button 
          onClick={() => router.push('/')}
          variant="outline"
          className="w-full"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

// Main BookingForm Component
const BookingForm = ({ tour, initialBookingData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const bookingData = {
    tour,
    startDate: initialBookingData.startDate,
    guests: initialBookingData.guests,
    totalPrice: (tour.price * initialBookingData.guests) + 99 + 89 // tour price + service fee + taxes
  };

  const totalSteps = 4;

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Save booking to database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          guestInfo: formData,
          paymentIntentId: paymentIntent.id,
          status: 'confirmed'
        }),
      });

      const booking = await response.json();
      setBookingConfirmation(booking);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GuestInfoStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />;
      case 2:
        return <BookingReviewStep formData={formData} bookingData={bookingData} />;
      case 3:
        return <PaymentStep formData={formData} bookingData={bookingData} onPaymentSuccess={handlePaymentSuccess} processing={processing} setProcessing={setProcessing} />;
      case 4:
        return <ConfirmationStep bookingConfirmation={bookingConfirmation} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      {currentStep < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Guest Info</span>
            <span>Review</span>
            <span>Payment</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card className="border-2">
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-6">
          <Button 
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={handleNext} variant="gradient">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Wrapper component with Stripe Elements
const BookingFormWrapper = ({ tour, initialBookingData }) => {
  return (
    <Elements stripe={stripePromise}>
      <BookingForm tour={tour} initialBookingData={initialBookingData} />
    </Elements>
  );
};

export default BookingFormWrapper;
