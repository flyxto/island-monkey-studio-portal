import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Island Monkey - Studio Portal',
  description: 'Internal admin portal for Island Monkey studio management, member check-ins, and model gig approvals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FAF6F0] flex text-[#0B1C30] font-sans selection:bg-[#FF6433]/20 selection:text-[#0B1C30]">
        <AuthGuard>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-[#FAF6F0] via-[#FAF6F3] to-[#F7F2EA]">{children}</main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
