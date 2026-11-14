'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  QrCode,
  ArrowRight,
  TrendingUp,
  UserPlus,
  Zap,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  getDashboardStats,
  issuePoints,
  DashboardStats,
} from '@/lib/api/dashboard';
import { getTransactions, PointTransaction } from '@/lib/api/activity';
import { formatStudioDateTime } from '@/lib/utils';
import {
  INITIAL_DASHBOARD_STATS,
  INITIAL_RECENT_ACTIVITIES,
} from '@/lib/mock-data/studio-dashboard';
import { RecentScanActivity } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_DASHBOARD_STATS);
  const [activities, setActivities] = useState<RecentScanActivity[]>(INITIAL_RECENT_ACTIVITIES);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Manual Scan & Point Issuance state
  const [targetMemberId, setTargetMemberId] = useState('');
  const [customPts, setCustomPts] = useState('');
  const [activePreset, setActivePreset] = useState<number | null>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setIsLoadingStats(true);
      const [liveStats, txsRes] = await Promise.allSettled([
        getDashboardStats(),
        getTransactions({ limit: 10 }),
      ]);

      if (liveStats.status === 'fulfilled' && liveStats.value) {
        setStats(liveStats.value);
      }

      if (txsRes.status === 'fulfilled' && txsRes.value?.transactions) {
        const liveTxs = txsRes.value.transactions;
        if (liveTxs.length > 0) {
          const mapped: RecentScanActivity[] = liveTxs.map((t: PointTransaction) => ({
            id: t.id,
            member: t.user ? `${t.user.firstName} ${t.user.lastName}`.trim() : 'Studio Member',
            memberId: t.user?.memberId || `MB-${t.userId.slice(0, 5).toUpperCase()}`,
            pointsAwarded: t.amount,
            time: formatStudioDateTime(t.createdAt),
          }));
          setActivities(mapped);
        }
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleConfirmAddition = async () => {
    const pointsToAdd = customPts ? parseInt(customPts, 10) : activePreset || 50;
    if (isNaN(pointsToAdd) || pointsToAdd <= 0) {
      setErrorMessage('Please specify a positive point amount.');
      return;
    }

    const memberIdentifier = targetMemberId.trim();
    if (!memberIdentifier) {
      setErrorMessage('Please enter a Member ID, Customer ID, or QR code value.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setToastMessage(null);

      const res = await issuePoints({
        userId: memberIdentifier,
        amount: pointsToAdd,
        description: `Manual studio scan award — +${pointsToAdd} pts`,
      });

      const memberName = res?.member?.name || memberIdentifier;
      const assignedId = res?.member?.memberId || memberIdentifier;

      // Optimistically update live stats
      setStats((prev) => ({
        ...prev,
        pointsIssued: prev.pointsIssued + pointsToAdd,
        activeScansToday: prev.activeScansToday + 1,
      }));

      // Prepend to activity feed
      const newAct: RecentScanActivity = {
        id: res?.transaction?.id || `act-${Date.now()}`,
        member: memberName,
        memberId: assignedId,
        pointsAwarded: pointsToAdd,
        time: 'Just now',
      };
      setActivities((prev) => [newAct, ...prev]);

      // Success feedback
      setToastMessage(
        `Successfully issued +${pointsToAdd} Island Monkey points to ${memberName}! (New Balance: ${res?.newBalance ?? 'Updated'})`
      );
      setTimeout(() => setToastMessage(null), 5000);

      // Reset fields
      setTargetMemberId('');
      setCustomPts('');
    } catch (err: any) {
      console.error('Failed to issue points:', err);
      setErrorMessage(err.message || 'Failed to issue points to member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-medium rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-[#FFF1F2] border border-[#FFE4E6] text-[#E11D48] font-semibold rounded-2xl shadow-sm flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#E11D48] shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner: Daily Conversion Rate */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#0B1C30] border border-white/10 p-6 sm:p-7 text-white shadow-md">
        {/* Glow shape */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FF6433]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#C85A17]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[#FDF2EA]/70 uppercase">
              Daily Conversion Rate
            </span>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              Current exchange value for active members in the Island Monkey ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-inner">
              <span className="text-2xl font-semibold tracking-tight text-white">
                1 Point = {stats.conversionRate?.lkr || 200} LKR
              </span>
              <span className="text-xs bg-[#FF6433] text-white font-semibold px-2.5 py-1 rounded-full uppercase shadow-xs">
                LKR
              </span>
            </div>
            <button
              onClick={loadDashboardData}
              title="Refresh dashboard stats"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Manual Scan QR Box + Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Manual Scan QR tool (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#FDF2EA] rounded-2xl border border-[#F3DAC9] mx-auto flex items-center justify-center text-[#C85A17] shadow-inner">
              <QrCode className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0B1C30]">Manual Scan QR & Point Issuance</h3>
            <p className="text-xs text-[#616161] font-medium max-w-sm mx-auto">
              Scan member QR or enter Member ID / Customer ID to issue Island Monkey points.
            </p>
          </div>

          {/* Member ID / QR Code Input */}
          <div className="max-w-md mx-auto w-full space-y-2">
            <label className="text-[11px] font-bold text-[#8C8880] uppercase tracking-wider block">
              Member ID, Customer ID, or QR Code
            </label>
            <Input
              type="text"
              placeholder="e.g. NX-682-A or Customer UUID"
              value={targetMemberId}
              onChange={(e) => setTargetMemberId(e.target.value)}
              className="h-11 bg-[#FAF6F0] border-[#E8E1D5] rounded-xl text-sm text-[#0B1C30] placeholder:text-[#8C8880] focus-visible:ring-2 focus-visible:ring-[#FF6433]/30 font-medium"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-center gap-3">
            {[50, 100, 250, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setActivePreset(preset);
                  setCustomPts('');
                }}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === preset && !customPts
                    ? 'im-btn-specular text-white'
                    : 'bg-[#FAF6F0] text-[#45464D] hover:bg-[#F3EFE9] border border-[#EBE4D8]'
                }`}
              >
                +{preset}
              </button>
            ))}
          </div>

          {/* Custom Amount Entry */}
          <div className="max-w-md mx-auto w-full space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C8880]">
                Pts:
              </span>
              <Input
                type="number"
                min="1"
                placeholder="Enter custom points"
                value={customPts}
                onChange={(e) => setCustomPts(e.target.value)}
                className="pl-14 h-11 bg-[#FAF6F0] border-[#E8E1D5] rounded-xl text-sm text-[#0B1C30] placeholder:text-[#8C8880] focus-visible:ring-2 focus-visible:ring-[#FF6433]/30 font-semibold"
              />
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmAddition}
              className="im-btn-specular w-full h-11 rounded-xl text-sm font-semibold cursor-pointer gap-2 disabled:opacity-60 flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-x-2 top-0.5 h-[44%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-xl pointer-events-none" />
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{isSubmitting ? 'Issuing Points...' : 'Confirm Addition'}</span>
            </button>
          </div>
        </div>

        {/* Right Stack: Stat Cards (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <StatCard
            label="POINTS ISSUED TODAY"
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
      <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0B1C30]">Recent Activity</h3>
            <p className="text-xs text-[#8C8880] font-medium mt-0.5">Live member point issuance log</p>
          </div>
          <Link
            href="/activity/users"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDF2EA] text-[#C85A17] hover:bg-[#FAEFEA] border border-[#F3DAC9] text-xs font-semibold transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#EBE4D8]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#8C8880] font-semibold text-[11px] uppercase border-b border-[#EBE4D8]">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Points Awarded</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE4D8] font-medium">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-[#EBE4D8]">
                      <AvatarImage src={item.memberAvatar} />
                      <AvatarFallback className="bg-[#FDF2EA] text-[#C85A17] text-xs font-semibold">
                        {item.member.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-[#0B1C30]">{item.member}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#616161] font-medium">{item.memberId}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                        item.pointsAwarded > 0
                          ? 'bg-[#EDFDF3] text-[#16A34A] border border-[#DCFCE7]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      +{item.pointsAwarded} pts
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#8C8880] font-medium">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
