'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Loader2,
  Sliders,
  Globe,
  MessageCircle,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getModelById } from '@/lib/api/models';
import { ModelProfile } from '@/lib/types';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function formatBirthdateAndAge(dobStr?: string | null): string {
  if (!dobStr) return 'Not specified';
  const d = new Date(dobStr);
  if (isNaN(d.getTime())) return dobStr;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
    age--;
  }
  const formatted = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${formatted} (${age} yrs)`;
}

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
        <Link href="/models" className="text-[#C85A17] hover:underline mt-2 inline-block">
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
      <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left: Avatar + Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-2xs border-2 border-[#EBE4D8] shrink-0 bg-[#FAF6F0] flex items-center justify-center">
              {model.avatarUrl ? (
                <Image
                  src={model.avatarUrl}
                  alt={model.user.firstName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl font-semibold text-[#C85A17]">
                  {model.user.firstName.charAt(0)}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight">
                  {model.user.firstName} {model.user.lastName}
                </h1>
                {model.origin && (
                  <span className="bg-[#FDF2EA] text-[#C85A17] text-xs font-semibold px-3 py-0.5 rounded-full border border-[#F3DAC9]">
                    {model.origin}
                  </span>
                )}
                {model.gender && (
                  <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-0.5 rounded-full">
                    {model.gender}
                  </span>
                )}
                {model.specialty && (
                  <span className="bg-[#FAF6F0] text-[#0B1C30] text-xs font-semibold px-3 py-0.5 rounded-full border border-[#EBE4D8]">
                    {model.specialty}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#616161] font-medium max-w-xl leading-relaxed">
                {model.bio || 'No editorial bio added yet.'}
              </p>
              <div className="pt-1 flex items-center gap-3 flex-wrap">
                <StatusBadge status={model.availability} />
                <span className="text-xs text-[#8C8880] font-mono">• Handle: {model.handle}</span>
                {model.location && (
                  <span className="text-xs text-[#8C8880] flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C85A17]" />
                    {model.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Contact Information Box */}
          <div className="bg-[#FAF6F0] border border-[#EBE4D8] rounded-2xl p-5 space-y-3 w-full lg:w-72 shrink-0">
            <p className="text-[11px] font-semibold text-[#8C8880] uppercase tracking-wider">
              Contact & Direct Casting
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#0B1C30]">
              <Mail className="w-4 h-4 text-[#C85A17] shrink-0" />
              <span className="truncate">{model.user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#0B1C30]">
              <Phone className="w-4 h-4 text-[#C85A17] shrink-0" />
              <span>{model.user.phone || 'Phone pending'}</span>
            </div>
            {model.instagram && (
              <div className="flex items-center gap-3 text-xs font-semibold text-[#0B1C30]">
                <InstagramIcon className="w-4 h-4 text-[#C85A17] shrink-0" />
                <a
                  href={`https://instagram.com/${model.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-[#C85A17] hover:underline"
                >
                  {model.instagram.startsWith('@') ? model.instagram : `@${model.instagram}`}
                </a>
              </div>
            )}
            {model.whatsapp && (
              <div className="flex items-center gap-3 text-xs font-semibold text-[#0B1C30]">
                <MessageCircle className="w-4 h-4 text-[#C85A17] shrink-0" />
                <a
                  href={`https://wa.me/${model.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-[#0B1C30] hover:text-[#C85A17]"
                >
                  {model.whatsapp}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Bank Comp Card & Demographics Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Physical Comp Card Specifications */}
        <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE4D8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FDF2EA] text-[#C85A17] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#0B1C30]">Physical Specifications</h3>
                <p className="text-[11px] text-[#8C8880] font-medium">Digital Comp Card measurements</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#0B1C30] border border-[#EBE4D8]">
              Comp Card
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Height</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.height || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Weight</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.weight || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Bust / Chest</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.bust || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Waist</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.waist || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Hips</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.hips || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Shoe Size</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.shoeSize || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Dress Size</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.dressSize || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Hair Color</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.hairColor || '—'}
              </span>
            </div>

            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
              <span className="text-[11px] font-medium text-[#8C8880] block">Eye Color</span>
              <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                {model.eyeColor || '—'}
              </span>
            </div>
          </div>

          <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8] flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C8880]">Skin Complexion</span>
            <span className="text-xs font-semibold text-[#0B1C30]">
              {model.skinComplexion || '—'}
            </span>
          </div>
        </div>

        {/* Card 2: Casting Demographics & Specialties */}
        <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE4D8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2EA] text-[#C85A17] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0B1C30]">Casting & Demographics</h3>
                  <p className="text-[11px] text-[#8C8880] font-medium">Division and portfolio specialties</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EDFDF3] text-[#16A34A] border border-[#DCFCE7]">
                Verified Talent
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
                <span className="text-[11px] font-medium text-[#8C8880] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C85A17]" />
                  Birthdate & Age
                </span>
                <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                  {formatBirthdateAndAge(model.dateOfBirth)}
                </span>
              </div>

              <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
                <span className="text-[11px] font-medium text-[#8C8880] block">Division / Gender</span>
                <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                  {model.gender || 'Not specified'}
                </span>
              </div>

              <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
                <span className="text-[11px] font-medium text-[#8C8880] block">Origin Division</span>
                <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                  {model.origin || 'Not specified'}
                </span>
              </div>

              <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBE4D8]">
                <span className="text-[11px] font-medium text-[#8C8880] block">International Casting</span>
                <span className="text-[13px] font-semibold text-[#0B1C30] mt-0.5 block">
                  {model.availableForInternational ? 'Eligible' : 'Domestic Only'}
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Disciplines / Specialties */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-[#8C8880] uppercase tracking-wider mb-2">
              Portfolio Disciplines
            </p>
            <div className="flex flex-wrap gap-1.5">
              {model.modelingType && model.modelingType.length > 0 ? (
                model.modelingType.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] rounded-full text-xs font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{cat}</span>
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-[#FAF6F0] text-[#0B1C30] border border-[#EBE4D8] rounded-full text-xs font-semibold">
                  {model.specialty || 'General Modeling'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Pending Gigs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#C85A17]" />
          <h2 className="text-lg font-semibold text-[#0B1C30]">Pending Gigs</h2>
        </div>

        {model.pendingGigs && model.pendingGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {model.pendingGigs.map((gig) => (
              <div key={gig.id} className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs overflow-hidden hover:shadow-xs hover:border-[#DFCFC0] transition-all flex flex-col justify-between">
                <div className="relative h-48 w-full bg-[#FAF6F0]">
                  {gig.coverImageUrl && (
                    <Image src={gig.coverImageUrl} alt={gig.title} fill className="object-cover" />
                  )}
                  <span className="absolute top-3 left-3 bg-[#FF6433] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                    Pending Approval
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#0B1C30]">{gig.title}</h3>
                    <p className="text-xs text-[#616161] font-medium mt-1 line-clamp-2">{gig.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EBE4D8]">
                    <span className="text-sm font-semibold text-[#0B1C30]">LKR {gig.hourlyRateLkr}/hr</span>
                    <Link href={`/models/${model.id}/gigs/${gig.id}/pending`}>
                      <span className="im-btn-specular text-white text-xs font-semibold rounded-xl px-5 h-9 cursor-pointer">
                        <div className="absolute inset-x-2 top-0.5 h-[44%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-xl pointer-events-none" />
                        <span>Review Gig</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8C8880] font-medium bg-white p-6 rounded-2xl border border-[#EBE4D8]">
            No pending gig requests for this model.
          </p>
        )}
      </div>

      {/* Section 2: Active Gigs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-[#0B1C30]">Active Gigs</h2>
        </div>

        {model.activeGigs && model.activeGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {model.activeGigs.map((gig) => (
              <div key={gig.id} className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs overflow-hidden hover:shadow-xs hover:border-[#DFCFC0] transition-all flex flex-col justify-between">
                <div className="relative h-48 w-full bg-[#FAF6F0]">
                  {gig.coverImageUrl && (
                    <Image src={gig.coverImageUrl} alt={gig.title} fill className="object-cover" />
                  )}
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                    Active
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#0B1C30]">{gig.title}</h3>
                    <p className="text-xs text-[#616161] font-medium mt-1 line-clamp-2">{gig.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EBE4D8]">
                    <span className="text-sm font-semibold text-[#0B1C30]">LKR {gig.hourlyRateLkr}/hr</span>
                    <Link href={`/models/${model.id}/gigs/${gig.id}`}>
                      <span className="im-btn-specular-secondary text-[#0B1C30] text-xs font-semibold rounded-xl px-5 h-9 cursor-pointer">
                        <span>View Gig</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8C8880] font-medium bg-white p-6 rounded-2xl border border-[#EBE4D8]">
            No active gigs for this model.
          </p>
        )}
      </div>
    </div>
  );
}
