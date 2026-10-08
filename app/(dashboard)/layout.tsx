import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-[#FAF6F0] via-[#FAF6F3] to-[#F7F2EA]">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
