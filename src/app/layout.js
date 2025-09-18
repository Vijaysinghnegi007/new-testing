import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Providers } from "@/components/providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LiveChat from "@/components/chat/LiveChat";
import NotificationPanel from "@/components/notifications/NotificationPanel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "TravelWeb - Discover Amazing Destinations",
    template: "%s | TravelWeb"
  },
  description: "Discover amazing destinations and create unforgettable memories with our expertly curated travel experiences. Book your next adventure today.",
  keywords: ["travel", "tours", "vacation", "destinations", "booking", "adventure", "cultural tours", "luxury travel"],
  authors: [{ name: "TravelWeb Team" }],
  creator: "TravelWeb",
  publisher: "TravelWeb",
  metadataBase: new URL("https://travelweb.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://travelweb.com",
    title: "TravelWeb - Discover Amazing Destinations",
    description: "Discover amazing destinations and create unforgettable memories with our expertly curated travel experiences.",
    siteName: "TravelWeb",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelWeb - Discover Amazing Destinations",
    description: "Discover amazing destinations and create unforgettable memories with our expertly curated travel experiences.",
    creator: "@travelweb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen bg-background">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          {/* Real-time components */}
          <LiveChat />
          <NotificationPanel />
          
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
