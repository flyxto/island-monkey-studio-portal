'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, ArrowUpRight, ArrowDownLeft, Eye, RefreshCw } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { INITIAL_USER_ACTIVITIES, INITIAL_USER_ACTIVITY_STATS } from '@/lib/mock-data/studio-dashboard';

export default function UserActivityPage() {
  const [activities] = useState(INITIAL_USER_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter(
    (a) =>
      a.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.partner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">User Activity</h1>
        <p className="text-xs text-[#8C8880] mt-1 font-medium">
          Detailed audit trail of member point deposits, redemptions, and studio interactions
        </p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="TOTAL USERS"
          value={INITIAL_USER_ACTIVITY_STATS.totalUsers}
          subtext="all registered users"
          icon={Users}
        />
        <StatCard
          label="TODAY'S DEDUCTIONS"
          value={INITIAL_USER_ACTIVITY_STATS.todaysDeductions.toLocaleString()}
          subtext="points deducted today"
          icon={ArrowDownLeft}
        />
        <StatCard
          label="TODAY'S DEPOSITS"
          value={INITIAL_USER_ACTIVITY_STATS.todaysDeposits.toLocaleString()}
          subtext="points deposited today"
          icon={ArrowUpRight}
        />
      </div>

      {/* Main Table Card */}
      <Card className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">User Activity Feed</h3>

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
                {filteredActivities.map((act) => (
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert(`Re-issuing point event for ${act.member}`)}
                          className="h-8 text-xs font-semibold im-btn-specular-secondary rounded-xl transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          <span>Re-issue</span>
                        </Button>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
