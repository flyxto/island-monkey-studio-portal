'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Eye } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { INITIAL_MODELS, INITIAL_MODELS_STATS } from '@/lib/mock-data/studio-dashboard';

export default function ModelsPage() {
  const [models] = useState(INITIAL_MODELS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = models.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Models</h1>
        <p className="text-xs text-slate-500 mt-1">Manage talent profiles, availability, and gig approval status</p>
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
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-medium text-slate-900">Models Catalog</h3>

            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search model name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-slate-50 border-slate-200 rounded-full text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-medium uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Approved Gigs</th>
                  <th className="py-3 px-4">Uploaded Time</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredModels.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={m.avatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-900 text-xs font-medium">
                          {m.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{m.name}</p>
                        <p className="text-[11px] text-slate-400">{m.specialty}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">NX-682-A</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full text-xs">
                        {m.approvedGigsCount} Approved
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{m.uploadedTime}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.availability} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/models/${m.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs font-medium text-im-accent hover:text-im-accent hover:bg-im-accent-light rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>View Profile</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
