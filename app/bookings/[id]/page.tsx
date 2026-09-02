'use client';

import { use, useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { INITIAL_BOOKINGS } from '@/lib/mock-data/studio-dashboard';
import { BookingStatus } from '@/lib/types';

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const initialBooking =
    INITIAL_BOOKINGS.find((b) => b.id === bookingId) || INITIAL_BOOKINGS[0];

  const [booking, setBooking] = useState(initialBooking);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateStatus = (newStatus: BookingStatus) => {
    setBooking((prev) => ({ ...prev, status: newStatus }));
    setToastMessage(`Booking ${booking.bookingCode} updated to ${newStatus}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
                <AvatarImage src={booking.customerAvatar} />
                <AvatarFallback className="bg-amber-100 text-amber-900 text-lg font-medium">
                  {booking.customer.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-medium text-slate-900">
                    {booking.customer}
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
                    className="h-10 bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 text-white font-medium text-xs px-5 rounded-lg shadow-sm transition-all flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve Booking</span>
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('Cancelled')}
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
                    className="h-10 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs px-5 rounded-lg shadow-sm transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Completed</span>
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('Cancelled')}
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
                <p className="text-sm font-medium text-slate-900">{booking.dateTime}</p>
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
                <p className="text-sm font-medium text-slate-900">{booking.amount}</p>
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
              <h3 className="text-base font-medium text-slate-900">Studio Setup & Equipment</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Room Name</span>
                <span className="font-medium text-slate-800">Studio Room A (Cyclorama Wall)</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Lighting Package</span>
                <span className="font-medium text-slate-800">3x Profoto D2 500W Strobes + Modifiers</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Backdrops Included</span>
                <span className="font-medium text-slate-800">Pure White, Warm Stone, Deep Charcoal</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Assistant on Standby</span>
                <span className="font-medium text-emerald-600">Included</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 font-medium">WiFi & Tether Station</span>
                <span className="font-medium text-emerald-600">Available (Calibrated Display)</span>
              </div>
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
              <h3 className="text-base font-medium text-slate-900">Customer & Invoice</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer Name</span>
                <span className="font-medium text-slate-900">{booking.customer}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Member ID</span>
                <span className="font-mono font-medium text-slate-700">NX-682-A</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Payment Mode</span>
                <span className="font-medium text-slate-800">Card / Studio Credit</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 font-medium">Total Billed</span>
                <span className="text-sm font-medium text-slate-900">{booking.amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
