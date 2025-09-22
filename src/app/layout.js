import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/react'

export async function generateMetadata() {
  const locale = (await cookies()).get('LOCALE')?.value || 'en';
  const isEs = locale === 'es';
  const title = isEs ? 'TravelWeb - Descubre destinos increíbles' : 'TravelWeb - Discover Amazing Destinations';
  const description = isEs
    ? 'Descubre destinos increíbles y crea recuerdos inolvidables con nuestras experiencias de viaje seleccionadas.'
    : 'Discover amazing destinations and create unforgettable memories with our expertly curated travel experiences.';

  return {
    title: { default: title, template: `%s | TravelWeb` },
    description,
    keywords: ['travel','tours','vacation','destinations','booking','adventure','cultural tours','luxury travel'],
    authors: [{ name: 'TravelWeb Team' }],
    creator: 'TravelWeb',
    publisher: 'TravelWeb',
    metadataBase: new URL('https://travelweb.com'),
    alternates: {
      canonical: 'https://travelweb.com',
      languages: {
        'en-US': 'https://travelweb.com',
        'es-ES': 'https://travelweb.com/es',
      },
    },
    openGraph: {
      type: 'website',
      locale: isEs ? 'es_ES' : 'en_US',
      url: 'https://travelweb.com',
      title,
      description,
      siteName: 'TravelWeb',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@travelweb',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({ children }) {
  const cookieLocale = cookies().get('LOCALE')?.value || 'en'
  return (
    <html lang={cookieLocale} className={inter.variable}>
      <body className="font-sans antialiased min-h-screen bg-background">
        {/* Accessibility: Skip link for keyboard/screen reader users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only fixed top-2 left-2 z-50 rounded bg-white text-black ring-2 ring-offset-2 ring-primary px-3 py-2"
        >
          Skip to content
        </a>
        <ClientLayoutWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ClientLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
