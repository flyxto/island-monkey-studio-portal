'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Clock, Calendar, ShieldCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { INITIAL_GIGS, INITIAL_MODELS } from '@/lib/mock-data/studio-dashboard';

export default function PendingGigPage({
  params,
}: {
  params: Promise<{ id: string; gigId: string }>;
}) {
  const resolvedParams = use(params);
  const { id: modelId, gigId } = resolvedParams;

  const [gig, setGig] = useState(() => {
    return INITIAL_GIGS.find((g) => g.id === gigId) || INITIAL_GIGS[0];
  });
  const [model] = useState(() => {
    return INITIAL_MODELS.find((m) => m.id === modelId) || INITIAL_MODELS[0];
  });

  const [selectedImage, setSelectedImage] = useState(gig.coverImage);
  const [isApproved, setIsApproved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApproveGig = () => {
    setIsApproved(true);
    setGig((prev) => ({ ...prev, status: 'active' }));
    setToastMessage(`Gig "${gig.title}" has been approved successfully! Status is now Active.`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
            <span>{toastMessage}</span>
          </div>
          <Link
            href={`/models/${model.id}`}
            className="text-xs underline hover:opacity-90 font-bold"
          >
            Return to Profile
          </Link>
        </div>
      )}

      {/* Back link */}
      <div>
        <Link
          href={`/models/${model.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {model.name}'s Profile</span>
        </Link>
      </div>

      {/* Main Gig Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Hero & Gallery Thumbnails (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <Image
              src={selectedImage}
              alt={gig.title}
              fill
              className="object-cover"
            />
            <span
              className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                isApproved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {isApproved ? 'Active' : 'Pending Approval'}
            </span>
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex items-center gap-3">
            {gig.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Parameters & Approve Action (5 cols) */}
        <Card className="lg:col-span-5 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 inline-block">
                {gig.tag}
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{gig.title}</h1>
              <p className="text-xs text-slate-500 leading-relaxed">{gig.description}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Hourly Rate</span>
              <span className="text-xl font-black text-slate-900">{gig.rate}</span>
            </div>

            {/* Booking parameters table / list */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Booking ID</span>
                <span className="font-mono font-bold text-slate-900">{gig.bookingId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-semibold text-slate-800">{gig.dateTime}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold text-slate-800">{gig.duration}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-bold text-indigo-700">{gig.amount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Approval Status</span>
                <span
                  className={`font-bold ${
                    isApproved ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {isApproved ? 'Approved & Active' : 'Awaiting Studio Approval'}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            {!isApproved ? (
              <Button
                onClick={handleApproveGig}
                className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve Gig</span>
              </Button>
            ) : (
              <Button
                disabled
                className="w-full h-12 bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-none opacity-100 flex items-center justify-center gap-2 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Gig Approved</span>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
