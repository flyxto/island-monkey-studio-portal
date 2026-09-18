'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, Check, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getGigById, approveGig, rejectGig } from '@/lib/api/gigs';
import { getModelById } from '@/lib/api/models';
import { Gig, ModelProfile } from '@/lib/types';

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

export default function PendingGigPage({
  params,
}: {
  params: Promise<{ id: string; gigId: string }>;
}) {
  const resolvedParams = use(params);
  const { id: modelId, gigId } = resolvedParams;
  const router = useRouter();

  const [gig, setGig] = useState<Gig | null>(null);
  const [model, setModel] = useState<ModelProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [gigData, modelData] = await Promise.all([
          getGigById(gigId),
          getModelById(modelId),
        ]);
        setGig(gigData);
        setModel(modelData);
        setSelectedImage(gigData.coverImageUrl || '');
      } catch (err) {
        console.error('Failed to load gig/model', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [gigId, modelId]);

  const handleApproveGig = async () => {
    if (!gig) return;
    setIsUpdating(true);
    try {
      await approveGig(gigId);
      setGig((prev) => (prev ? { ...prev, status: 'active' } : prev));
      setToastMessage({ type: 'success', text: `Gig "${gig.title}" has been approved! Redirecting...` });
      
      // Redirect back to profile after a short delay
      setTimeout(() => {
        router.push(`/models/${modelId}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to approve gig', err);
      setToastMessage({ type: 'error', text: 'Failed to approve gig. Please try again.' });
      setIsUpdating(false);
    }
  };

  const handleRejectGig = async () => {
    if (!gig) return;
    setIsUpdating(true);
    try {
      await rejectGig(gigId);
      setToastMessage({ type: 'success', text: `Gig "${gig.title}" rejected.` });
      
      setTimeout(() => {
        router.push(`/models/${modelId}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to reject gig', err);
      setToastMessage({ type: 'error', text: 'Failed to reject gig. Please try again.' });
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

  const isApproved = gig.status === 'active';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className={`p-4 font-medium rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-300 ${toastMessage.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <div className="flex items-center gap-3">
            {toastMessage.type === 'success' ? (
               <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
            ) : (
               <XCircle className="w-5 h-5 text-white" />
            )}
            <span>{toastMessage.text}</span>
          </div>
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

      {/* Main Gig Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Hero & Gallery Thumbnails (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 flex items-center justify-center">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={gig.title}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-slate-400">No Image Available</span>
            )}
            <span
              className={`absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full shadow-md ${
                isApproved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {isApproved ? 'Active' : 'Pending Approval'}
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

        {/* Right Column: Parameters & Approve Action (5 cols) */}
        <Card className="lg:col-span-5 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 inline-block">
                {gig.tag}
              </span>
              <h1 className="text-xl font-medium text-slate-900 tracking-tight">{gig.title}</h1>
              <p className="text-xs text-slate-500 leading-relaxed">{gig.description}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase">Hourly Rate</span>
              <span className="text-xl font-medium text-slate-900">LKR {gig.hourlyRateLkr}</span>
            </div>

            {/* Booking parameters table / list */}
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
                <span className="text-slate-500">Submitted On</span>
                <span className="font-medium text-slate-800">{formatDateTime(gig.createdAt)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Approval Status</span>
                <span
                  className={`font-medium ${
                    isApproved ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {isApproved ? 'Approved & Active' : 'Awaiting Studio Approval'}
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

            {/* Primary Action Button */}
            {!isApproved ? (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  onClick={handleRejectGig}
                  disabled={isUpdating}
                  variant="outline"
                  className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 font-medium text-[14px] rounded-lg transition-all"
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApproveGig}
                  disabled={isUpdating}
                  className="w-full h-12 bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 text-white font-medium text-[14px] rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve</span>
                </Button>
              </div>
            ) : (
              <Button
                disabled
                className="w-full h-12 bg-emerald-600 text-white font-medium text-[15px] rounded-lg shadow-none opacity-100 flex items-center justify-center gap-2 cursor-default pt-4"
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
