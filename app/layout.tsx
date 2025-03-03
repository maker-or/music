import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';



const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SongID - Identify Your Music',
  description: 'Upload audio files to identify songs using Shazam API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

          {children}
      

      </body>
    </html>
  );
}