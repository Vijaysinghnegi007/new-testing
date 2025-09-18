import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Create a lazy-loaded adapter for better performance
function createPrismaAdapter() {
  try {
    return PrismaAdapter(prisma);
  } catch (error) {
    console.warn('Prisma adapter failed to initialize:', error.message);
    return null;
  }
}

export const authOptions = {
  // Only use adapter if database is available
  ...(process.env.DATABASE_URL ? { adapter: createPrismaAdapter() } : {}),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
          role: 'USER',
        };
      },
    }),
    
    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: 'USER',
        };
      },
    }),
    
    // Email & Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          image: user.profileImage,
        };
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || 'USER';
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        token.firstName = session.firstName;
        token.lastName = session.lastName;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      
      return session;
    },
    
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers, create or update user in database
        if (account?.provider === 'google' || account?.provider === 'facebook') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Update existing user with OAuth info
            await prisma.user.update({
              where: { email: user.email },
              data: {
                profileImage: user.image,
                isEmailVerified: true,
              },
            });
          } else {
            // Create new user
            await prisma.user.create({
              data: {
                email: user.email,
                firstName: user.firstName || profile?.given_name || '',
                lastName: user.lastName || profile?.family_name || '',
                profileImage: user.image,
                role: 'USER',
                isEmailVerified: true,
              },
            });
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
      
      // Track sign in event
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`);
      }
    },
    
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
