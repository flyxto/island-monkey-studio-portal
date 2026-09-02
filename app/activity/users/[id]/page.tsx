'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Clock,
  RefreshCw,
  Check,
  CheckCircle2,
  FileText,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { INITIAL_USER_ACTIVITIES } from '@/lib/mock-data/studio-dashboard';

export default function UserActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const activityId = resolvedParams.id;

  const initialActivity =
    INITIAL_USER_ACTIVITIES.find((a) => a.id === activityId) ||
    INITIAL_USER_ACTIVITIES[0];

  const [activity] = useState(initialActivity);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleReissue = () => {
    setToastMessage(
      `Point activity notification successfully re-sent to ${activity.member}!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const isDeposit = activity.amount > 0;
  const pointsAbsolute = Math.abs(activity.amount);
  const lkrEquivalent = (pointsAbsolute * 200).toLocaleString();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/activity/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to User Activity</span>
        </Link>
      </div>

      {/* Hero Card */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-slate-100 shadow-sm">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" />
                <AvatarFallback className="bg-amber-100 text-amber-900 text-lg font-bold">
                  {activity.member.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900">
                    {activity.member}
                  </h1>
                  <span
                    className={`font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      isDeposit
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {isDeposit ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    )}
                    <span>{isDeposit ? 'Points Deposited' : 'Points Redeemed'}</span>
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Member ID:{' '}
                  <span className="font-bold text-slate-700">{activity.memberId}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleReissue}
                className="h-10 bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 text-white font-medium text-xs px-5 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-issue Notice</span>
              </Button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C85A17] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Attribution Partner</p>
                <p className="text-sm font-bold text-slate-900">{activity.partner}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Logged Time</p>
                <p className="text-sm font-bold text-slate-900">{activity.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                  isDeposit ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}
              >
                PTS
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Point Amount</p>
                <p
                  className={`text-sm font-black ${
                    isDeposit ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {isDeposit ? `+${activity.amount}` : activity.amount} pts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                LKR
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Conversion Value</p>
                <p className="text-sm font-black text-slate-900">LKR {lkrEquivalent}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Event Details (7 cols) */}
        <Card className="lg:col-span-7 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C85A17] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Transaction Record</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Transaction Reference</span>
                <span className="font-mono font-bold text-slate-800">
                  PTX-{activity.id.toUpperCase()}-IM
                </span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Event Type</span>
                <span className="font-bold text-slate-900">
                  {isDeposit ? 'Studio Admin Point Issue' : 'Partner Check-In Deduction'}
                </span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Conversion Standard</span>
                <span className="font-bold text-slate-800">1 Point = 200 LKR</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Verification Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authenticated & Balanced</span>
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 font-medium">Channel</span>
                <span className="font-bold text-slate-800">Island Monkey Studio Portal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Member Profile (5 cols) */}
        <Card className="lg:col-span-5 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Member Status</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Member Name</span>
                <span className="font-bold text-slate-900">{activity.member}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Membership ID</span>
                <span className="font-mono font-bold text-slate-700">{activity.memberId}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Membership Tier</span>
                <span className="font-bold text-[#C85A17]">Island Monkey VIP</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 font-medium">Account Status</span>
                <span className="font-bold text-emerald-600">Active & Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
