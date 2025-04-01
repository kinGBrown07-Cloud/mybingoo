import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupabaseProvider from "@/providers/SupabaseProvider";
import { SessionProvider } from '@/providers/SessionProvider';
import LoadingScreen from '@/components/LoadingScreen';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bingoo",
  description: "Jeu de bingo en ligne",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SupabaseProvider>
          <SessionProvider>
            <Navbar />
            <main>
              <Toaster position="top-center" />
              <Suspense fallback={<LoadingScreen />}>
                {children}
              </Suspense>
            </main>
            <Footer />
          </SessionProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
