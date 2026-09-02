'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Handshake, Search, ArrowDownLeft, Eye, RefreshCw } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { INITIAL_PARTNER_ACTIVITIES, INITIAL_PARTNER_ACTIVITY_STATS } from '@/lib/mock-data/studio-dashboard';

export default function PartnerActivityPage() {
  const [activities] = useState(INITIAL_PARTNER_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter(
    (a) =>
      a.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Partner Activity</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor partner point redemptions, deduction balances, and merchant settlements
        </p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="TOTAL PARTNERS"
          value={INITIAL_PARTNER_ACTIVITY_STATS.totalPartners}
          subtext="all active partners"
          icon={Handshake}
        />
        <StatCard
          label="TODAY'S DEDUCTIONS"
          value={INITIAL_PARTNER_ACTIVITY_STATS.todaysDeductions.toLocaleString()}
          subtext="points deducted today"
          icon={ArrowDownLeft}
        />
        <StatCard
          label="TOTAL DEDUCTIONS"
          value={INITIAL_PARTNER_ACTIVITY_STATS.totalDeductions.toLocaleString()}
          subtext="points overall"
          icon={Handshake}
        />
      </div>

      {/* Main Table Card */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">Partner Activity Feed</h3>

            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search partner or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-slate-50 border-slate-200 rounded-full text-xs"
              />
            </div>
          </div>

          {/* Activity Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-[10px]">
                        {act.partnerName.charAt(0)}
                      </div>
                      <span>{act.partnerName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">{act.customerName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{act.customerId}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold px-2.5 py-0.5 rounded-full text-xs bg-rose-50 text-rose-700 inline-flex items-center gap-1">
                        <ArrowDownLeft className="w-3 h-3" />
                        {act.amount} pt
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{act.time}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert(`Re-issuing transaction for ${act.partnerName}`)}
                          className="h-8 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          <span>Re-issue</span>
                        </Button>
                        <Link href={`/activity/partners/${act.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs font-medium text-im-accent hover:text-im-accent hover:bg-im-accent-light rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>View</span>
                          </Button>
                        </Link>
                      </div>
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
