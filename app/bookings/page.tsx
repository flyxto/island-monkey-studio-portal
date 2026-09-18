'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Calendar, Search, Eye, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { INITIAL_BOOKINGS_STATS } from '@/lib/mock-data/studio-dashboard';
import { getBookings } from '@/lib/api/bookings';
import { BookingResponse } from '@/lib/types';

// Helper for 'Oct 24, 2026 - 10:00 AM'
function formatDateTime(isoString: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).replace(',', '').replace(' at', ' -');
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const limit = 20;

  const { ref, inView } = useInView();

  const fetchBookings = useCallback(async (pageNum: number, search: string, status: string) => {
    try {
      setIsLoading(true);
      const res = await getBookings({
        page: pageNum,
        limit,
        search,
        status,
      });
      
      const newBookings = res?.bookings || [];
      
      if (pageNum === 1) {
        setBookings(newBookings);
      } else {
        setBookings((prev) => {
          // Prevent duplicates if API returns the same items
          const existingIds = new Set(prev.map(b => b.id));
          const uniqueNewBookings = newBookings.filter(b => !existingIds.has(b.id));
          return [...prev, ...uniqueNewBookings];
        });
      }
      
      setHasMore(newBookings.length === limit);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setHasMore(false); // Stop infinite looping on error
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Fetch when filters or search change (debounce search slightly)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchBookings(1, searchQuery, statusFilter);
    }, 400); // 400ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, fetchBookings]);

  // Fetch more when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isInitialLoad) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchBookings(nextPage, searchQuery, statusFilter);
        return nextPage;
      });
    }
  }, [inView, hasMore, isLoading, isInitialLoad, searchQuery, statusFilter, fetchBookings]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight">Bookings</h1>
        <p className="text-xs text-[#8C8880] font-medium mt-1">Manage and track all studio booking requests</p>
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
      <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-[#0B1C30]">All Bookings</h3>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8880]" />
              <Input
                type="search"
                placeholder="Search customer or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-[#FAF6F0] border-[#E8E1D5] rounded-full text-xs text-[#0B1C30] placeholder:text-[#8C8880] focus-visible:ring-2 focus-visible:ring-[#FF6433]/30 focus-visible:border-[#FF6433]"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center bg-[#FAF6F0] p-1 rounded-xl border border-[#EBE4D8] text-xs font-medium">
              {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-[#0B1C30] shadow-2xs font-semibold'
                      : 'text-[#616161] hover:text-[#0B1C30]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#EBE4D8]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#8C8880] font-semibold text-[11px] uppercase border-b border-[#EBE4D8]">
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
            <tbody className="divide-y divide-[#EBE4D8] font-medium">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-[#EBE4D8]">
                      <AvatarImage src={b.customer.avatarUrl} />
                      <AvatarFallback className="bg-[#FDF2EA] text-[#C85A17] text-xs font-semibold">
                        {b.customer.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-[#0B1C30]">
                      {b.customer.firstName} {b.customer.lastName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#616161] font-medium whitespace-nowrap">{b.bookingCode}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#FDF2EA] text-[#C85A17] font-semibold px-2.5 py-0.5 rounded-md text-xs whitespace-nowrap border border-[#F3DAC9]">
                      {b.studioRoom}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#616161] whitespace-nowrap font-medium">
                    {formatDateTime(b.dateTime)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0B1C30] whitespace-nowrap">
                    {b.duration?.toLowerCase().includes('hour') ? b.duration : `${b.duration} Hours`}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/bookings/${b.id}`}>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#FDF2EA] text-[#C85A17] border border-[#EBE4D8] hover:border-[#F3DAC9] text-xs font-semibold transition-all">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            
            {/* Empty State */}
            {!isLoading && bookings.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No bookings found matching your criteria.
              </div>
            )}
            
            {/* Loading / Infinite Scroll Sentinel */}
            <div ref={ref} className="py-4 flex justify-center">
              {isLoading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
            </div>
          </div>
        </div>
      </div>
    );
  }
