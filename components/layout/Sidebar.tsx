'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Users,
  Activity,
  Handshake,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Bookings', href: '/bookings', icon: Calendar },
  { label: 'Models', href: '/models', icon: Users },
  { label: 'User Activity', href: '/activity/users', icon: Activity },
  { label: 'Partner Activity', href: '/activity/partners', icon: Handshake },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#FAF6F0] border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Logo & Header */}
        <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C85A17] flex items-center justify-center text-white font-medium shadow-md shadow-orange-100">
              IM
            </div>
            <div>
              <h1 className="font-medium text-slate-900 text-lg leading-tight tracking-tight">
                IslandMonkey
              </h1>
              <p className="text-xs text-[#C85A17] font-medium">Studio Portal</p>
            </div>
          </div>
        </div>

        {/* User Card inside Sidebar */}
        <div className="mx-4 my-4 p-3 bg-amber-50/80 border border-amber-100 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-medium text-xs">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-800 truncate">Admin</p>
            <p className="text-[11px] text-slate-500 truncate">Studio Manager</p>
          </div>
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? 'bg-[#FDF2EA] text-[#C85A17] font-medium shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#C85A17]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-slate-200/60">
        <button
          onClick={() => alert('Logged out successfully.')}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
