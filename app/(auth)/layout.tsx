import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Island Monkey Studio',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#FAF6F0] via-[#F5EEE1] to-[#EAE0D0]">
      {children}
    </div>
  );
}
