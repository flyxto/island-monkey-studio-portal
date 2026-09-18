'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Check,
  Camera,
  User,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getBookingById, updateBookingStatus } from '@/lib/api/bookings';
import { BookingResponse, BookingStatus } from '@/lib/types';

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
  }).replace(',', '').replace(' at', ' -');
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;
  const router = useRouter();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        console.error('Failed to load booking details', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [bookingId]);

  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    if (!booking) return;
    setIsUpdating(true);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBooking((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setToastMessage(`Booking ${booking.bookingCode} updated to ${newStatus}!`);
      setTimeout(() => setToastMessage(null), 4000);
      
      // Refresh the current route to ensure everything is synced (optional)
      router.refresh();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C85A17] animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-slate-800">Booking not found</h2>
        <Link href="/bookings" className="text-im-accent hover:underline mt-2 inline-block">
          Return to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-medium rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>
      </div>

      {/* Booking Header Hero */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-slate-100 shadow-sm">
                <AvatarImage src={booking.customer.avatarUrl} />
                <AvatarFallback className="bg-amber-100 text-amber-900 text-lg font-medium">
                  {booking.customer.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-medium text-slate-900">
                    {booking.customer.firstName} {booking.customer.lastName}
                  </h1>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Booking Code: <span className="font-medium text-slate-700">{booking.bookingCode}</span>
                </p>
              </div>
            </div>

            {/* Quick Status Control */}
            <div className="flex items-center gap-3 flex-wrap">
              {booking.status === 'Pending' && (
                <>
                  <Button
                    onClick={() => handleUpdateStatus('Approved')}
                    disabled={isUpdating}
                    className="h-10 bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 text-white font-medium text-xs px-5 rounded-lg shadow-sm transition-all flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve Booking</span>
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('Cancelled')}
                    disabled={isUpdating}
                    variant="outline"
                    className="h-10 text-xs font-medium text-red-600 border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                </>
              )}

              {booking.status === 'Approved' && (
                <>
                  <Button
                    onClick={() => handleUpdateStatus('Completed')}
                    disabled={isUpdating}
                    className="h-10 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs px-5 rounded-lg shadow-sm transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Completed</span>
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('Cancelled')}
                    disabled={isUpdating}
                    variant="outline"
                    className="h-10 text-xs font-medium text-red-600 border-red-200 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                </>
              )}

              {booking.status === 'Completed' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Session Completed</span>
                </div>
              )}

              {booking.status === 'Cancelled' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-medium">
                  <XCircle className="w-4 h-4" />
                  <span>Booking Cancelled</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C85A17] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Studio Room</p>
                <p className="text-sm font-medium text-slate-900">{booking.studioRoom}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C85A17] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Date & Time</p>
                <p className="text-sm font-medium text-slate-900 whitespace-nowrap">{formatDateTime(booking.dateTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C85A17] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Duration</p>
                <p className="text-sm font-medium text-slate-900">{booking.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="font-medium text-xs">LKR</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Amount</p>
                <p className="text-sm font-medium text-slate-900">{booking.amountLkr}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Room Info & Amenities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Studio Spec Details (7 cols) */}
        <Card className="lg:col-span-7 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C85A17] flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-slate-900">Package & Studio Information</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Package Booked</span>
                <span className="font-medium text-slate-800">{booking.package.name}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Studio Room</span>
                <span className="font-medium text-slate-800">{booking.studioRoom}</span>
              </div>
              {booking.package.studioName && (
                <div className="flex justify-between py-2.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Assigned Studio</span>
                  <span className="font-medium text-slate-800">{booking.package.studioName}</span>
                </div>
              )}
              {booking.notes && (
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-500 font-medium">Customer Notes</span>
                  <span className="font-medium text-slate-800 max-w-sm text-right">{booking.notes}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Customer & Invoice Card (5 cols) */}
        <Card className="lg:col-span-5 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-slate-900">Customer Details</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer Name</span>
                <span className="font-medium text-slate-900">
                  {booking.customer.firstName} {booking.customer.lastName}
                </span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Email</span>
                <span className="font-medium text-slate-900">{booking.customer.email}</span>
              </div>
              {booking.customer.memberId && (
                <div className="flex justify-between py-2.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Member ID</span>
                  <span className="font-mono font-medium text-slate-700">{booking.customer.memberId}</span>
                </div>
              )}
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Total Billed</span>
                <span className="text-sm font-medium text-slate-900">LKR {booking.amountLkr}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
