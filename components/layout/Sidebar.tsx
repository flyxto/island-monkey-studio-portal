'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '@/lib/api/auth';
import {
  Home,
  Calendar,
  Users,
  Activity,
  Handshake,
  Settings,
  LogOut,
  Sparkles,
  Package,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Bookings', href: '/bookings', icon: Calendar },
  { label: 'Models', href: '/models', icon: Users },
  { label: 'Packages', href: '/packages', icon: Package },
  { label: 'User Activity', href: '/activity/users', icon: Activity },
  { label: 'Partner Activity', href: '/activity/partners', icon: Handshake },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#FAF6F0] border-r border-[#EBE4D8] flex flex-col justify-between shrink-0 min-h-screen select-none">
      <div>
        {/* Logo & Header */}
        <div className="p-6 border-b border-[#EBE4D8] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF7A45] via-[#FF6433] to-[#E84A23] flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-orange-500/20 border border-white/40 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200">
              <div className="absolute inset-x-1 top-0.5 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-xl pointer-events-none" />
              <span className="relative z-10 tracking-tight">IM</span>
            </div>
            <div>
              <h1 className="font-semibold text-[#0B1C30] text-[17px] leading-tight tracking-tight">
                Island Monkey
              </h1>
              <p className="text-[11px] text-[#C85A17] font-semibold uppercase tracking-wider mt-0.5">
                Studio Portal
              </p>
            </div>
          </Link>
        </div>

        {/* User Card inside Sidebar */}
        <div className="mx-4 my-4 p-3.5 bg-white/80 border border-[#EBE4D8] rounded-2xl shadow-2xs flex items-center gap-3 backdrop-blur-xs">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FDF2EA] to-[#FAECE1] border border-[#F3DAC9] text-[#C85A17] flex items-center justify-center font-semibold text-xs shadow-inner shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#0B1C30] truncate">Admin</p>
            <p className="text-[11px] text-[#8C8880] truncate font-medium">Studio Manager</p>
          </div>
          <Sparkles className="w-4 h-4 text-[#C85A17] opacity-80" />
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
                    ? 'bg-gradient-to-r from-[#FDF2EA] to-[#FAECE1] text-[#C85A17] font-semibold shadow-xs border border-[#F3DAC9]/80'
                    : 'text-[#616161] hover:bg-black/[0.03] hover:text-[#0B1C30] font-medium border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#C85A17]' : 'text-[#8C8880]'}`} />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-[#EBE4D8]">
        <button
          onClick={() => logoutAdmin()}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-[#616161] hover:bg-white/90 hover:text-[#0B1C30] border border-transparent hover:border-[#EBE4D8] hover:shadow-2xs transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#8C8880]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
