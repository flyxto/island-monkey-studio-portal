'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { logoutAdmin } from '@/lib/api/auth';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-4">
        {title && <h2 className="text-xl font-medium text-slate-800 tracking-tight">{title}</h2>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search portal..."
            className="pl-9 h-9 bg-slate-50 border-slate-200 rounded-full text-xs focus-visible:ring-amber-500"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-im-accent rounded-full ring-2 ring-white"></span>
        </button>

        {/* Logout Quick Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logoutAdmin()}
          className="gap-2 text-xs font-medium rounded-lg border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}
