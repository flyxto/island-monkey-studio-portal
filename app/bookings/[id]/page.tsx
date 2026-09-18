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
  Users,
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
    timeZone: 'UTC',
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
      <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#EBE4D8]">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-[#EBE4D8] shadow-2xs rounded-2xl">
              <AvatarImage src={booking.customer.avatarUrl} />
              <AvatarFallback className="bg-[#FDF2EA] text-[#C85A17] text-lg font-semibold rounded-2xl">
                {booking.customer.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight">
                  {booking.customer.firstName} {booking.customer.lastName}
                </h1>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-xs font-mono text-[#8C8880] mt-1">
                Booking Code: <span className="font-semibold text-[#0B1C30]">{booking.bookingCode}</span>
              </p>
            </div>
          </div>

          {/* Quick Status Control */}
          <div className="flex items-center gap-3 flex-wrap">
            {booking.status === 'Pending' && (
              <>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Approved')}
                  disabled={isUpdating}
                  className="im-btn-specular h-10 px-5 rounded-xl text-xs font-semibold cursor-pointer gap-2"
                >
                  <div className="absolute inset-x-2 top-0.5 h-[44%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-xl pointer-events-none" />
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Approve Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Cancelled')}
                  disabled={isUpdating}
                  className="im-btn-specular-secondary h-10 px-4 rounded-xl text-xs font-semibold text-rose-600 border-rose-200/90 hover:bg-rose-50 cursor-pointer gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}

            {booking.status === 'Approved' && (
              <>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Completed')}
                  disabled={isUpdating}
                  className="h-10 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs px-5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Cancelled')}
                  disabled={isUpdating}
                  className="im-btn-specular-secondary h-10 px-4 rounded-xl text-xs font-semibold text-rose-600 border-rose-200/90 hover:bg-rose-50 cursor-pointer gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}

            {booking.status === 'Completed' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#EDFDF3] text-[#16A34A] border border-[#BBF7D0] rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Session Completed</span>
              </div>
            )}

            {booking.status === 'Cancelled' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-xl text-xs font-semibold">
                <XCircle className="w-4 h-4" />
                <span>Booking Cancelled</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#8C8880] font-semibold uppercase tracking-wider">Studio Room</p>
              <p className="text-sm font-semibold text-[#0B1C30] mt-0.5">{booking.studioRoom}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#8C8880] font-semibold uppercase tracking-wider">Date & Time</p>
              <p className="text-sm font-semibold text-[#0B1C30] whitespace-nowrap mt-0.5">{formatDateTime(booking.dateTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#8C8880] font-semibold uppercase tracking-wider">Duration</p>
              <p className="text-sm font-semibold text-[#0B1C30] mt-0.5">
                {booking.duration?.toLowerCase().includes('hour') ? booking.duration : `${booking.duration} Hours`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDFDF3] text-[#16A34A] border border-[#BBF7D0] flex items-center justify-center shrink-0 font-semibold text-xs">
              LKR
            </div>
            <div>
              <p className="text-[11px] text-[#8C8880] font-semibold uppercase tracking-wider">Total Amount</p>
              <p className="text-sm font-semibold text-[#0B1C30] mt-0.5">{booking.amountLkr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Room Info & Amenities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Studio Spec Details (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2EA] text-[#C85A17] flex items-center justify-center border border-[#F3DAC9]">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#0B1C30]">Package & Studio Information</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]">
              <span className="text-[#616161] font-medium">Package Booked</span>
              <span className="font-semibold text-[#0B1C30]">{booking.package.name}</span>
            </div>
            <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]">
              <span className="text-[#616161] font-medium">Studio Room</span>
              <span className="font-semibold text-[#0B1C30]">{booking.studioRoom}</span>
            </div>
            {booking.package.studioName && (
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]">
                <span className="text-[#616161] font-medium">Assigned Studio</span>
                <span className="font-semibold text-[#0B1C30]">{booking.package.studioName}</span>
              </div>
            )}
            {booking.notes && (
              <div className="flex justify-between py-2.5">
                <span className="text-[#616161] font-medium">Customer Notes</span>
                <span className="font-medium text-[#0B1C30] max-w-sm text-right">{booking.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Customer & Invoice Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#0B1C30] flex items-center justify-center border border-[#EBE4D8]">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#0B1C30]">Customer Details</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]">
              <span className="text-[#616161] font-medium">Customer Name</span>
              <span className="font-semibold text-[#0B1C30]">
                {booking.customer.firstName} {booking.customer.lastName}
              </span>
            </div>
            <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]">
              <span className="text-[#616161] font-medium">Email</span>
              <span className="font-semibold text-[#0B1C30]">{booking.customer.email}</span>
            </div>
            {booking.customer.memberId && (
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]">
                <span className="text-[#616161] font-medium">Member ID</span>
                <span className="font-mono font-semibold text-[#C85A17]">{booking.customer.memberId}</span>
              </div>
            )}
            <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]">
              <span className="text-[#616161] font-medium">Total Billed</span>
              <span className="text-sm font-semibold text-[#0B1C30]">LKR {booking.amountLkr}</span>
            </div>
          </div>
        </div>

        {/* Right: Assigned Model Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EDFDF3] text-[#16A34A] flex items-center justify-center border border-[#BBF7D0]">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#0B1C30]">Assigned Model</h3>
          </div>

          {booking.modelBookings && booking.modelBookings.length > 0 ? (
            <div className="space-y-4">
              {booking.modelBookings.map((mb) => (
                <div key={mb.id} className="p-4 bg-[#FAF6F0] border border-[#EBE4D8] rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-[#EBE4D8]">
                      <AvatarImage src={mb.model?.user.avatarUrl || undefined} />
                      <AvatarFallback className="bg-[#EDFDF3] text-[#16A34A] font-semibold text-xs">
                        {mb.model?.user.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-[#0B1C30]">
                        {mb.model?.user.firstName} {mb.model?.user.lastName}
                      </p>
                      <p className="text-xs text-[#8C8880] capitalize font-medium">Status: {mb.status}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#EBE4D8] text-xs">
                     <span className="text-[#616161] font-medium">Model Fee</span>
                     <span className="font-semibold text-[#0B1C30]">LKR {mb.paymentLkr}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-[#FAF6F0] border border-[#EBE4D8] rounded-2xl">
              <p className="text-xs text-[#8C8880] mb-3 font-medium">No model assigned to this booking.</p>
              <Link href="/models">
                <span className="im-btn-specular-secondary px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer">
                  Find a Model
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
