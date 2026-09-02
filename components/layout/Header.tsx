'use client';

import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-4">
        {title && <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>}
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C85A17] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Logout Quick Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Logged out.')}
          className="gap-2 text-xs font-semibold rounded-full border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}
