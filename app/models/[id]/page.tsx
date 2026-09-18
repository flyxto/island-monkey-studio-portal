'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Phone, Tag, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getModelById } from '@/lib/api/models';
import { ModelProfile } from '@/lib/types';

export default function ModelProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const modelId = resolvedParams.id;

  const [model, setModel] = useState<ModelProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getModelById(modelId);
        setModel(data);
      } catch (err) {
        console.error('Failed to load model profile', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [modelId]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C85A17] animate-spin" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-slate-800">Model not found</h2>
        <Link href="/models" className="text-im-accent hover:underline mt-2 inline-block">
          Return to Models
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/models"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Models</span>
        </Link>
      </div>

      {/* Model Profile Hero Card */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 shrink-0 bg-slate-100 flex items-center justify-center">
                {model.avatarUrl ? (
                  <Image
                    src={model.avatarUrl}
                    alt={model.user.firstName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl font-medium text-slate-400">
                    {model.user.firstName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-medium text-slate-900 tracking-tight">
                    {model.user.firstName} {model.user.lastName}
                  </h1>
                  <span className="bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-100">
                    {model.specialty}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">{model.bio}</p>
                <div className="pt-1 flex items-center gap-2">
                  <StatusBadge status={model.availability} />
                  <span className="text-xs text-slate-400">• Handle: {model.handle}</span>
                </div>
              </div>
            </div>

            {/* Right: Contact Information Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 w-full lg:w-72 shrink-0">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contact Details</p>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">{model.user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{model.user.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Pending Gigs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-medium text-slate-900">Pending Gigs</h2>
        </div>

        {model.pendingGigs && model.pendingGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {model.pendingGigs.map((gig) => (
              <Card key={gig.id} className="bg-white border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full bg-slate-100">
                  {gig.coverImageUrl && (
                    <Image src={gig.coverImageUrl} alt={gig.title} fill className="object-cover" />
                  )}
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-md">
                    Pending Approval
                  </span>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-slate-900">{gig.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{gig.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-900">LKR {gig.hourlyRateLkr}/hr</span>
                    <Link href={`/models/${model.id}/gigs/${gig.id}/pending`}>
                      <Button className="bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 text-white text-xs font-medium rounded-lg px-5 h-9 transition-all shadow-xs">
                        Review Gig
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 bg-white p-6 rounded-2xl border border-slate-200">
            No pending gig requests for this model.
          </p>
        )}
      </div>

      {/* Section 2: Active Gigs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-medium text-slate-900">Active Gigs</h2>
        </div>

        {model.activeGigs && model.activeGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {model.activeGigs.map((gig) => (
              <Card key={gig.id} className="bg-white border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full bg-slate-100">
                  {gig.coverImageUrl && (
                    <Image src={gig.coverImageUrl} alt={gig.title} fill className="object-cover" />
                  )}
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-md">
                    Active
                  </span>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-slate-900">{gig.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{gig.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-900">LKR {gig.hourlyRateLkr}/hr</span>
                    <Link href={`/models/${model.id}/gigs/${gig.id}`}>
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg px-5 h-9 transition-all shadow-xs">
                        View Gig
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 bg-white p-6 rounded-2xl border border-slate-200">
            No active gigs for this model.
          </p>
        )}
      </div>
    </div>
  );
}
