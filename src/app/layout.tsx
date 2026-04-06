import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ELVERA - Premium Men\'s Fashion',
  description: 'Discover curated men\'s fashion from top brands at unbeatable prices',
  keywords: 'men fashion, clothing, shirts, pants, affordable fashion, elvera',
  authors: [{ name: 'ELVERA' }],
  openGraph: {
    title: 'ELVERA - Premium Men\'s Fashion',
    description: 'Discover curated men\'s fashion from top brands',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
