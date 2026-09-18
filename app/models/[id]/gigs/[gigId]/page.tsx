'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Calendar, Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getGigById } from '@/lib/api/gigs';
import { getModelById } from '@/lib/api/models';
import { createModelBooking } from '@/lib/api/model-bookings';
import { getBookings } from '@/lib/api/bookings';
import { Gig, ModelProfile, BookingResponse } from '@/lib/types';

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

export default function ActiveGigPage({
  params,
}: {
  params: Promise<{ id: string; gigId: string }>;
}) {
  const resolvedParams = use(params);
  const { id: modelId, gigId } = resolvedParams;

  const [gig, setGig] = useState<Gig | null>(null);
  const [model, setModel] = useState<ModelProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [availableBookings, setAvailableBookings] = useState<BookingResponse[]>([]);

  // Booking Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    bookingId: '',
    dateTime: '',
    durationHours: '',
    location: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [gigData, modelData, bookingsData] = await Promise.all([
          getGigById(gigId),
          getModelById(modelId),
          getBookings({ limit: 100 })
        ]);
        setGig(gigData);
        setModel(modelData);
        setSelectedImage(gigData.coverImageUrl || '');
        setBookingForm(prev => ({ ...prev, location: gigData.venueName || '' }));
        setAvailableBookings(bookingsData.bookings.filter(b => 
          b.status !== 'Completed' && 
          b.status !== 'Cancelled' && 
          (!b.modelBookings || b.modelBookings.length === 0)
        ));
      } catch (err) {
        console.error('Failed to load active gig/model', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [gigId, modelId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig || !model) return;
    
    setIsSubmitting(true);
    try {
      const calculatedPayment = Number(bookingForm.durationHours) * gig.hourlyRateLkr;
      
      await createModelBooking({
        gigId: gig.id,
        modelId: model.id,
        clientName: bookingForm.clientName,
        bookingId: bookingForm.bookingId || undefined,
        dateTime: bookingForm.dateTime,
        duration: bookingForm.durationHours,
        location: bookingForm.location,
        paymentLkr: calculatedPayment,
        notes: bookingForm.notes,
      });

      setToastMessage({ type: 'success', text: 'Model booking successfully scheduled!' });
      setIsDrawerOpen(false);
      
      // Reset form
      setBookingForm({
        clientName: '',
        bookingId: '',
        dateTime: '',
        durationHours: '',
        location: gig.venueName || '',
        notes: '',
      });
      
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to create model booking', err);
      setToastMessage({ type: 'error', text: 'Failed to create booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C85A17] animate-spin" />
      </div>
    );
  }

  if (!gig || !model) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-slate-800">Gig or Model not found</h2>
        <Link href={`/models/${modelId}`} className="text-im-accent hover:underline mt-2 inline-block">
          Return to Profile
        </Link>
      </div>
    );
  }

  const calculatedTotal = Number(bookingForm.durationHours) * gig.hourlyRateLkr;

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 p-4 font-medium rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300 ${toastMessage.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <div className="flex items-center gap-3">
            {toastMessage.type === 'success' ? (
               <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
            ) : (
               <X className="w-5 h-5 text-white" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-4 opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Back link */}
      <div>
        <Link
          href={`/models/${model.id}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {model.user.firstName}'s Profile</span>
        </Link>
      </div>

      {/* Main Active Gig Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Hero & Gallery Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 flex items-center justify-center">
            {selectedImage ? (
              <Image src={selectedImage} alt={gig.title} fill className="object-cover" />
            ) : (
              <span className="text-slate-400">No Image Available</span>
            )}
            <span className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full shadow-md bg-emerald-600 text-white">
              Active
            </span>
          </div>

          {/* Gallery Thumbnails */}
          {gig.galleryImages && gig.galleryImages.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {[gig.coverImageUrl, ...gig.galleryImages].filter(Boolean).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-amber-600 ring-2 ring-amber-200 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Parameters & Booking Action */}
        <Card className="lg:col-span-5 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block">
                {gig.tag}
              </span>
              <h1 className="text-xl font-medium text-slate-900 tracking-tight">{gig.title}</h1>
              <p className="text-xs text-slate-500 leading-relaxed">{gig.description}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase">Hourly Rate</span>
              <span className="text-xl font-medium text-slate-900">LKR {gig.hourlyRateLkr}</span>
            </div>

            {/* Gig parameters list */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-800">{gig.durationHours} Hours</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Venue</span>
                <span className="font-medium text-slate-800">{gig.venueName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Approved On</span>
                <span className="font-medium text-slate-800">{formatDateTime(gig.createdAt)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved & Active</span>
                </span>
              </div>
            </div>

            {/* Highlights */}
            {(gig.highlightTitle || gig.highlightSubtitle) && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4 space-y-1">
                 <p className="text-xs font-medium text-slate-800">{gig.highlightTitle}</p>
                 <p className="text-xs text-slate-500">{gig.highlightSubtitle}</p>
              </div>
            )}

            {/* Included */}
            {gig.whatsIncluded && gig.whatsIncluded.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-800 mb-2">What's Included</p>
                <ul className="space-y-1 text-xs text-slate-600">
                  {gig.whatsIncluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                       <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                       <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Make Booking CTA */}
            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full h-12 bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 text-white font-medium text-[15px] rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Booking</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Booking Slide-out Drawer */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-medium text-slate-900">Book Model Gig</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="booking-form" onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Client Name (Required)</label>
                  <Input 
                    required 
                    placeholder="Enter customer name" 
                    value={bookingForm.clientName}
                    onChange={e => setBookingForm(prev => ({ ...prev, clientName: e.target.value }))}
                    className="text-sm border-slate-200 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Studio Booking (Optional)</label>
                  <select
                    value={bookingForm.bookingId}
                    onChange={e => {
                      const selectedId = e.target.value;
                      const selectedBooking = availableBookings.find(b => b.id === selectedId);
                      if (selectedBooking) {
                        const dateObj = new Date(selectedBooking.dateTime);
                        const isoString = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                        setBookingForm(prev => ({
                          ...prev,
                          bookingId: selectedId,
                          clientName: `${selectedBooking.customer.firstName} ${selectedBooking.customer.lastName}`,
                          dateTime: isoString,
                          durationHours: selectedBooking.duration,
                          location: selectedBooking.studioRoom
                        }));
                      } else {
                        setBookingForm(prev => ({ ...prev, bookingId: selectedId }));
                      }
                    }}
                    className="w-full text-sm border-slate-200 rounded-md focus:ring-amber-500 focus:border-amber-500 p-2.5 border"
                  >
                    <option value="">Select an unassigned booking...</option>
                    {availableBookings.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.bookingCode} - {b.customer.firstName} {b.customer.lastName} ({new Date(b.dateTime).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">Select a studio booking to auto-fill details.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Date & Time</label>
                  <Input 
                    type="datetime-local"
                    required 
                    value={bookingForm.dateTime}
                    onChange={e => setBookingForm(prev => ({ ...prev, dateTime: e.target.value }))}
                    className="text-sm border-slate-200 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Duration (Hours)</label>
                  <Input 
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 2"
                    value={bookingForm.durationHours}
                    onChange={e => setBookingForm(prev => ({ ...prev, durationHours: e.target.value }))}
                    className="text-sm border-slate-200 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Location</label>
                  <Input 
                    required 
                    value={bookingForm.location}
                    onChange={e => setBookingForm(prev => ({ ...prev, location: e.target.value }))}
                    className="text-sm border-slate-200 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Notes (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Any special requests or details..."
                    value={bookingForm.notes}
                    onChange={e => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full text-sm border-slate-200 rounded-md focus:ring-amber-500 focus:border-amber-500 p-3 outline-none border resize-none"
                  />
                </div>

                {/* Calculation Preview */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Calculated Total</span>
                  <span className="text-lg font-medium text-[#C85A17]">
                    LKR {isNaN(calculatedTotal) ? '0' : calculatedTotal.toLocaleString()}
                  </span>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <Button 
                type="submit" 
                form="booking-form"
                disabled={isSubmitting}
                className="w-full h-11 bg-im-btn-primary hover:bg-im-btn-primary/90 text-white font-medium rounded-lg shadow-md"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
