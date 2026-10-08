'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Handshake, Search, ArrowDownLeft, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTransactions, PointTransaction } from '@/lib/api/activity';
import { formatStudioDateTime } from '@/lib/utils';
import { INITIAL_PARTNER_ACTIVITIES } from '@/lib/mock-data/studio-dashboard';

export default function PartnerActivityPage() {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchPartnerActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Deductions correspond to partner redemption events
      const res = await getTransactions({ type: 'deduction', limit: 100 });
      if (res && Array.isArray(res.transactions)) {
        setTransactions(res.transactions);
      }
    } catch (err: any) {
      console.error('Failed to fetch partner activity:', err);
      setError(err.message || 'Failed to fetch partner redemption logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerActivity();
  }, []);

  // Compute live partner deduction stats
  const uniquePartners = new Set(
    transactions.map((t) => t.partner?.storeName || t.partnerId).filter(Boolean)
  ).size;
  const totalDeductions = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const displayItems = transactions.length > 0
    ? transactions.map((t) => {
        const partnerName = t.partner?.storeName || 'Partner Merchant';
        const customerName = t.user ? `${t.user.firstName} ${t.user.lastName}`.trim() : 'Customer';
        const customerId = t.user?.memberId || `MB-${t.userId.slice(0, 5).toUpperCase()}`;
        return {
          id: t.id,
          partnerName,
          customerName,
          customerId,
          amount: t.amount,
          time: formatStudioDateTime(t.createdAt),
          isLive: true,
        };
      })
    : INITIAL_PARTNER_ACTIVITIES.map((a) => ({
        ...a,
        isLive: false,
      }));

  const filteredActivities = displayItems.filter(
    (a) =>
      a.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">Partner Activity</h1>
          <p className="text-xs text-[#8C8880] mt-1 font-medium">
            Monitor partner point redemptions, deduction balances, and merchant settlements
          </p>
        </div>
        <Button
          onClick={fetchPartnerActivity}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="self-start sm:self-auto h-9 text-xs font-semibold rounded-xl border-[#EBE4D8] text-[#0B1C30] hover:bg-[#FAF6F0] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </Button>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="ACTIVE REDEEMING PARTNERS"
          value={transactions.length > 0 ? uniquePartners : 136}
          subtext="partners with logged redemptions"
          icon={Handshake}
        />
        <StatCard
          label="TOTAL DEDUCTIONS"
          value={(transactions.length > 0 ? totalDeductions : 126000).toLocaleString()}
          subtext="points redeemed overall"
          icon={ArrowDownLeft}
        />
        <StatCard
          label="LKR SETTLEMENT VOLUME"
          value={`LKR ${((transactions.length > 0 ? totalDeductions : 126000) * 200).toLocaleString()}`}
          subtext="conversion value (1 pt = 200 LKR)"
          icon={Handshake}
        />
      </div>

      {/* Main Table Card */}
      <Card className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">
              Partner Activity Feed
              {transactions.length > 0 && (
                <span className="ml-2 text-xs font-normal text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Live DB Feed
                </span>
              )}
            </h3>

            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8880]" />
              <Input
                type="search"
                placeholder="Search partner or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-[#FAF6F0] border-[#E8E1D5] rounded-full text-xs text-[#0B1C30] focus:border-[#C85A17] focus:ring-[#C85A17]/20"
              />
            </div>
          </div>

          {/* Activity Table */}
          <div className="overflow-x-auto rounded-[18px] border border-[#EBE4D8]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F0] text-[#8C8880] font-bold text-[11px] uppercase tracking-wider border-b border-[#EBE4D8]">
                <tr>
                  <th className="py-3.5 px-4">Partner</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Customer ID</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE4D8]/60 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8C8880]">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF6433]" />
                      <span>Loading partner activity...</span>
                    </td>
                  </tr>
                ) : filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#8C8880]">
                      No partner activity matches your search.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#0B1C30] flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#FDF2EA] border border-[#F3DAC9] text-[#C85A17] flex items-center justify-center font-bold text-[10px]">
                          {act.partnerName.charAt(0)}
                        </div>
                        <span>{act.partnerName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#0B1C30] font-semibold">{act.customerName}</td>
                      <td className="py-3.5 px-4 font-mono text-[#8C8880]">{act.customerId}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold px-2.5 py-0.5 rounded-full text-xs bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6] inline-flex items-center gap-1">
                          <ArrowDownLeft className="w-3 h-3" />
                          {act.amount} pt
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8C8880]">{act.time}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/activity/partners/${act.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs font-semibold text-[#C85A17] hover:text-[#A64510] hover:bg-[#FDF2EA] rounded-xl transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>View</span>
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
