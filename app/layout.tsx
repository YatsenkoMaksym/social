import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next social app',
  description: 'Social app with clerk and next.js',
};
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/Theme-Provider';
import Navbar from '@/components/Navbar/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className='py-8 max-w-7xl mx-auto grid grid-cols-3 gap-4 '>
              <section className='bg-emerald-500'>
                This is like the left part of the layout
              </section>
              <section className='bg-violet-600'>{children}</section>
              <section className='bg-rose-500'>
                This is like the right part of the layout lorem5000
              </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
