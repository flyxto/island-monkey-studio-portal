'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Search, Filter, Eye } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { INITIAL_BOOKINGS, INITIAL_BOOKINGS_STATS } from '@/lib/mock-data/studio-dashboard';

export default function BookingsPage() {
  const [bookings] = useState(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.studioRoom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage and track all studio booking requests</p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="NEW BOOKINGS"
          value={INITIAL_BOOKINGS_STATS.newBookings}
          subtext="4 today's new bookings"
          icon={Calendar}
        />
        <StatCard
          label="PENDING BOOKINGS"
          value={INITIAL_BOOKINGS_STATS.pendingBookings}
          subtext="Awaiting approval"
          icon={Calendar}
        />
        <StatCard
          label="TODAY'S LIVE BOOKINGS"
          value={INITIAL_BOOKINGS_STATS.todaysLiveBookings}
          subtext="4 live active studio sessions"
          icon={Calendar}
        />
      </div>

      {/* Main Card: All Bookings */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">All Bookings</h3>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search customer or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-slate-50 border-slate-200 rounded-full text-xs"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
                {['All', 'Pending', 'Approved', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      statusFilter === status
                        ? 'bg-white text-slate-900 shadow-xs font-medium'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Studio Room</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={b.customerAvatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-900 text-xs font-bold">
                          {b.customer.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-slate-900">{b.customer}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{b.bookingCode}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md text-xs">
                        {b.studioRoom}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{b.dateTime}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{b.duration}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/bookings/${b.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs font-medium text-im-accent hover:text-im-accent hover:bg-im-accent-light rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>View</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
