'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Eye, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { INITIAL_MODELS_STATS } from '@/lib/mock-data/studio-dashboard';
import { getModels } from '@/lib/api/models';
import { ModelProfile } from '@/lib/types';

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

export default function ModelsPage() {
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      async function fetchModels() {
        setIsLoading(true);
        try {
          const data = await getModels(searchQuery);
          setModels(data || []);
        } catch (err) {
          console.error('Failed to fetch models', err);
          setModels([]);
        } finally {
          setIsLoading(false);
        }
      }
      fetchModels();
    }, 400); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight">Models</h1>
        <p className="text-xs text-[#8C8880] font-medium mt-1">Manage talent profiles, availability, and gig approval status</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="ACTIVE MODELS"
          value={INITIAL_MODELS_STATS.activeModels}
          subtext="Currently active"
          icon={Users}
        />
        <StatCard
          label="TOTAL MODELS"
          value={INITIAL_MODELS_STATS.totalModels}
          subtext="Registered talent"
          icon={Users}
        />
        <StatCard
          label="PENDING GIGS"
          value={INITIAL_MODELS_STATS.pendingGigs}
          subtext="Awaiting studio approval"
          icon={Users}
        />
        <StatCard
          label="PENDING PAYMENTS"
          value={INITIAL_MODELS_STATS.pendingPayments}
          subtext="Payouts queued"
          icon={Users}
        />
      </div>

      {/* Models List Table */}
      <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-[#0B1C30]">Models Catalog</h3>

          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8880]" />
            <Input
              type="search"
              placeholder="Search model name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-[#FAF6F0] border-[#E8E1D5] rounded-full text-xs text-[#0B1C30] placeholder:text-[#8C8880] focus-visible:ring-2 focus-visible:ring-[#FF6433]/30 focus-visible:border-[#FF6433]"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#EBE4D8]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#8C8880] font-semibold text-[11px] uppercase border-b border-[#EBE4D8]">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Approved Gigs</th>
                <th className="py-3 px-4">Uploaded Time</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE4D8] font-medium">
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-[#EBE4D8]">
                      <AvatarImage src={m.avatarUrl || ''} />
                      <AvatarFallback className="bg-[#FDF2EA] text-[#C85A17] text-xs font-semibold">
                        {m.user.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-[#0B1C30]">
                        {m.user.firstName} {m.user.lastName}
                      </p>
                      <p className="text-[11px] text-[#8C8880] font-medium">{m.specialty}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#616161] font-medium">{m.handle}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#EDFDF3] text-[#16A34A] border border-[#DCFCE7] font-semibold px-2.5 py-0.5 rounded-full text-xs">
                      {m.approvedGigsCount || 0} Approved
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#8C8880] font-medium">{formatDateTime(m.createdAt)}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={m.availability} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/models/${m.id}`}>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#FDF2EA] text-[#C85A17] border border-[#EBE4D8] hover:border-[#F3DAC9] text-xs font-semibold transition-all">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty / Loading State */}
          {isLoading && (
            <div className="p-8 flex justify-center text-[#C85A17]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
          {!isLoading && models.length === 0 && (
            <div className="p-8 text-center text-[#8C8880] text-sm font-medium">
              No models found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
