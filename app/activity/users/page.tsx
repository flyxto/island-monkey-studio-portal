'use client';

import { useState } from 'react';
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Activity</h1>
        <p className="text-xs text-slate-500 mt-1">
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
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">User Activity Feed</h3>

            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search member, ID or partner..."
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
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-amber-100 text-amber-900 text-xs font-bold">
                          {act.member.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-slate-900">{act.member}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{act.memberId}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-xs inline-flex items-center gap-1 ${
                          act.amount > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
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
                      <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md text-xs">
                        {act.partner}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{act.time}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert(`Re-issuing point event for ${act.member}`)}
                          className="h-8 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          <span>Re-issue</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert(`Viewing activity detail for ${act.member}`)}
                          className="h-8 text-xs font-medium text-im-accent hover:text-im-accent hover:bg-im-accent-light rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>View</span>
                        </Button>
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
