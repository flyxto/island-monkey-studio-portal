'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  QrCode,
  ArrowRight,
  TrendingUp,
  UserPlus,
  Zap,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  INITIAL_DASHBOARD_STATS,
  INITIAL_RECENT_ACTIVITIES,
} from '@/lib/mock-data/studio-dashboard';
import { RecentScanActivity } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS);
  const [activities, setActivities] = useState<RecentScanActivity[]>(INITIAL_RECENT_ACTIVITIES);

  // Manual Scan state
  const [selectedMember, setSelectedMember] = useState('Sarah Jenkins (NX-682-A)');
  const [customPts, setCustomPts] = useState('');
  const [activePreset, setActivePreset] = useState<number | null>(50);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmAddition = () => {
    const pointsToAdd = customPts ? parseInt(customPts, 10) : activePreset || 50;
    if (isNaN(pointsToAdd) || pointsToAdd <= 0) return;

    // Update stats
    setStats((prev) => ({
      ...prev,
      pointsIssued: prev.pointsIssued + pointsToAdd,
      activeScansToday: prev.activeScansToday + 1,
    }));

    // Add new activity
    const newAct: RecentScanActivity = {
      id: `act-${Date.now()}`,
      member: 'Sarah Jenkins',
      memberId: 'NX-682-A',
      pointsAwarded: pointsToAdd,
      time: 'Just now',
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    };

    setActivities((prev) => [newAct, ...prev]);

    // Toast feedback
    setToastMessage(`Successfully issued +${pointsToAdd} Island Monkey points to Sarah Jenkins!`);
    setTimeout(() => setToastMessage(null), 4000);

    // Reset custom field
    setCustomPts('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner: Daily Conversion Rate */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-700 via-orange-700 to-stone-800 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-amber-200 uppercase">
              Daily Conversion Rate
            </span>
            <p className="text-sm text-amber-100 mt-1">
              Current exchange value for active members in the Island Monkey ecosystem.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight">1 Point = 200 LKR</span>
            <span className="text-xs bg-white text-amber-950 font-extrabold px-2.5 py-1 rounded-full uppercase">
              LKR
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Manual Scan QR Box + Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Manual Scan QR tool (7 cols on lg) */}
        <Card className="lg:col-span-7 bg-white border-slate-200 shadow-xs flex flex-col justify-between">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl border border-amber-100 mx-auto flex items-center justify-center text-[#C85A17] shadow-inner">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Manual Scan QR</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to process member check-ins and issue Island Monkey points.
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center justify-center gap-3">
              {[50, 100, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setActivePreset(preset);
                    setCustomPts('');
                  }}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activePreset === preset && !customPts
                      ? 'bg-[#C85A17] text-white shadow-xs ring-2 ring-amber-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>

            {/* Custom Amount Entry */}
            <div className="max-w-md mx-auto space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Pts:
                </span>
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customPts}
                  onChange={(e) => setCustomPts(e.target.value)}
                  className="pl-14 h-11 bg-slate-50 border-slate-200 rounded-xl text-sm focus-visible:ring-amber-500 font-semibold"
                />
              </div>

              <Button
                onClick={handleConfirmAddition}
                className="w-full h-11 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Addition</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Stack: Stat Cards (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <StatCard
            label="POINTS ISSUED"
            value={stats.pointsIssued.toLocaleString()}
            change={stats.pointsIssuedChange}
            icon={Zap}
          />
          <StatCard
            label="ACTIVE SCANS"
            value={stats.activeScansToday}
            subtext="unique members today"
            icon={TrendingUp}
          />
          <StatCard
            label="MEMBER GROWTH"
            value={`+${stats.newRegistrationsToday}`}
            subtext="New Registrations today"
            icon={UserPlus}
          />
        </div>
      </div>

      {/* Bottom Section: Recent Activity Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500">Live member point issuance log</p>
            </div>
            <Link
              href="/activity/users"
              className="text-xs font-bold text-[#C85A17] hover:text-amber-800 flex items-center gap-1.5 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Points Awarded</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={item.memberAvatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-900 text-xs font-bold">
                          {item.member.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-slate-900">{item.member}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{item.memberId}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                          item.pointsAwarded > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        +{item.pointsAwarded} pts
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.time}</td>
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
