# TravelWeb - Comprehensive Tour & Travel Website

A modern, full-stack travel booking platform built with Next.js 15, featuring tour listings, booking management, user authentication, and payment processing.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Built with Next.js 15 + App Router
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Shadcn/ui for accessible, customizable components
- **Animations**: Framer Motion for smooth interactions
- **Form Handling**: React Hook Form + Zod validation
- **Type Safety**: JavaScript with comprehensive error handling

### Backend & Database
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with social login support
- **API**: tRPC for end-to-end type-safe APIs
- **Caching**: Redis for session management and performance
- **Real-time**: Socket.io for live notifications
- **Payments**: Stripe integration for secure transactions

### Key Functionality
- **User Management**: Multi-tier registration (Guest, User, Premium, Admin, Vendor)
- **Tour Discovery**: Advanced search, filters, and map integration
- **Booking System**: Multi-step booking process with payment options
- **Review System**: User reviews and ratings
- **Admin Dashboard**: Comprehensive management panel
- **Vendor Portal**: Multi-vendor tour management
- **Real-time Chat**: Customer support integration

## 🛠 Tech Stack

### Frontend
- Next.js 15 with App Router
- React 18 with Server Components
- Tailwind CSS for styling
- Shadcn/ui components
- Framer Motion for animations
- Lucide React for icons

### Backend
- Node.js with Express.js
- Prisma ORM with PostgreSQL
- tRPC for API layer
- NextAuth.js for authentication
- JWT tokens for security
- Redis for caching
- Socket.io for real-time features

### External Integrations
- Stripe for payments
- Google Maps API
- Cloudinary for media storage
- Weather API
- Email services (SMTP)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18.x or higher
- PostgreSQL database
- Redis server (optional, for caching)
- Stripe account (for payments)
- Google Maps API key
- Cloudinary account (for image storage)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd travel-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the `.env.local` file and update with your credentials:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/travel_website"
DIRECT_URL="postgresql://username:password@localhost:5432/travel_website"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"

# External APIs
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── bookings/          # Booking management
│   ├── tours/             # Tour pages
│   └── globals.css        # Global styles
├── components/
│   ├── common/            # Shared components
│   └── ui/                # UI component library
├── lib/
│   ├── prisma.js          # Database client
│   └── utils.js           # Utility functions
├── server/                # tRPC server setup
├── hooks/                 # Custom React hooks
├── types/                 # Type definitions
└── utils/                 # Helper utilities

prisma/
└── schema.prisma          # Database schema

public/                    # Static assets
```

## 🔑 Key Features Implementation

### Database Schema
The application uses a comprehensive database schema with:
- User management with role-based access
- Tour and destination management
- Booking and payment tracking
- Review and rating system
- Vendor management
- Content management for blogs and pages

### Authentication
- NextAuth.js integration
- Social login (Google, Facebook)
- JWT token management
- Role-based access control
- Email verification

### Payment Processing
- Stripe integration
- Multiple payment methods
- Secure payment processing
- Refund handling
- Payment history tracking

### Search & Discovery
- Advanced filtering system
- Map-based search
- Price comparison
- Availability checking
- Recommendation engine

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Run database migrations
npx prisma generate  # Generate Prisma client

# Build & Deploy
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🔒 Security Features

- HTTPS enforcement
- Input validation and sanitization
- SQL injection protection
- XSS prevention
- CSRF protection
- Rate limiting
- JWT token security
- Password hashing with bcrypt
- Secure file uploads

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices
- Progressive Web App (PWA) ready

## 🌐 SEO Optimization

- Server-side rendering (SSR)
- Meta tags optimization
- Structured data markup
- Sitemap generation
- Open Graph support
- Twitter Card support
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email info@travelweb.com or join our Slack channel.

## 🔮 Future Enhancements

- Mobile app development (React Native)
- AI-powered recommendations
- Voice search capabilities
- Augmented reality features
- Blockchain integration for secure transactions
- Machine learning for pricing optimization

---

**Built with ❤️ for travelers worldwide**
