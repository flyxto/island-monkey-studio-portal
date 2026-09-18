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
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-[#EBE4D8] px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      <div className="flex items-center gap-4">
        {title && <h2 className="text-xl font-semibold text-[#0B1C30] tracking-tight">{title}</h2>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8880]" />
          <Input
            type="search"
            placeholder="Search portal..."
            className="pl-9 h-9 bg-[#FAF6F0] border-[#E8E1D5] rounded-full text-xs text-[#0B1C30] placeholder:text-[#8C8880] focus-visible:ring-2 focus-visible:ring-[#FF6433]/30 focus-visible:border-[#FF6433]"
          />
        </div>

        {/* Notifications */}
        <button 
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-[#616161] hover:text-[#0B1C30] hover:bg-[#FAF6F0] rounded-full transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6433] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Logout Quick Action */}
        <button
          type="button"
          onClick={() => logoutAdmin()}
          className="im-btn-specular-secondary px-3.5 h-8 text-xs font-medium rounded-full cursor-pointer gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5 text-[#616161]" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
