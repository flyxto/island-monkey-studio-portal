'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/api/client';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else if (token && pathname === '/login') {
      router.push('/packages'); // Redirect logged in users away from login
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Optionally show a loading state while checking the token
  // to avoid flashing the protected content
  if (isAuthenticated === null && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="w-8 h-8 border-3 border-[#C85A17] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
