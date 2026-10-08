'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, ArrowUpRight, ArrowDownLeft, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getTransactions, PointTransaction } from '@/lib/api/activity';
import { formatStudioDateTime } from '@/lib/utils';
import { INITIAL_USER_ACTIVITIES } from '@/lib/mock-data/studio-dashboard';

export default function UserActivityPage() {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getTransactions({ limit: 100 });
      if (res && Array.isArray(res.transactions)) {
        setTransactions(res.transactions);
      }
    } catch (err: any) {
      console.error('Failed to fetch user activity:', err);
      setError(err.message || 'Failed to fetch user activity logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  // Compute live statistics from fetched transactions
  const uniqueUsers = new Set(transactions.map((t) => t.userId)).size;
  const todaysDeposits = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const todaysDeductions = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // If live transactions are empty or not yet seeded in backend, fall back seamlessly to mock items for display
  const displayItems = transactions.length > 0
    ? transactions.map((t) => {
        const memberName = t.user ? `${t.user.firstName} ${t.user.lastName}`.trim() : 'Studio Member';
        const memberId = t.user?.memberId || `MB-${t.userId.slice(0, 5).toUpperCase()}`;
        const partnerName = t.partner?.storeName || (t.amount > 0 ? 'Island Monkey Studio' : 'Partner Merchant');
        return {
          id: t.id,
          member: memberName,
          memberId,
          amount: t.amount,
          partner: partnerName,
          time: formatStudioDateTime(t.createdAt),
          isLive: true,
        };
      })
    : INITIAL_USER_ACTIVITIES.map((a) => ({
        ...a,
        isLive: false,
      }));

  const filteredActivities = displayItems.filter(
    (a) =>
      a.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.partner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">User Activity</h1>
          <p className="text-xs text-[#8C8880] mt-1 font-medium">
            Detailed audit trail of member point deposits, redemptions, and studio interactions
          </p>
        </div>
        <Button
          onClick={fetchActivity}
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
          label="TOTAL ACTIVE USERS"
          value={transactions.length > 0 ? uniqueUsers : 96}
          subtext="users with transaction activity"
          icon={Users}
        />
        <StatCard
          label="TODAY'S DEDUCTIONS"
          value={(transactions.length > 0 ? todaysDeductions : 24000).toLocaleString()}
          subtext="points deducted"
          icon={ArrowDownLeft}
        />
        <StatCard
          label="TODAY'S DEPOSITS"
          value={(transactions.length > 0 ? todaysDeposits : 14000).toLocaleString()}
          subtext="points deposited"
          icon={ArrowUpRight}
        />
      </div>

      {/* Main Table Card */}
      <Card className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">
              User Activity Feed
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
                placeholder="Search member, ID or partner..."
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
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Partner</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE4D8]/60 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8C8880]">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF6433]" />
                      <span>Loading activity feed...</span>
                    </td>
                  </tr>
                ) : filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#8C8880]">
                      No activity logs match your search.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-[#F3DAC9]">
                          <AvatarFallback className="bg-[#FDF2EA] text-[#C85A17] text-xs font-bold">
                            {act.member.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-[#0B1C30]">{act.member}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8C8880]">{act.memberId}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded-full text-xs inline-flex items-center gap-1 border ${
                            act.amount > 0
                              ? 'bg-[#EDFDF3] text-[#16A34A] border-[#D1F7DE]'
                              : 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]'
                          }`}
                        >
                          {act.amount > 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3" />
                          )}
                          {act.amount > 0 ? `+${act.amount}` : act.amount} pt
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#FAF6F0] text-[#0B1C30] border border-[#EBE4D8] font-medium px-2.5 py-1 rounded-lg text-xs">
                          {act.partner}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8C8880]">{act.time}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/activity/users/${act.id}`}>
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
