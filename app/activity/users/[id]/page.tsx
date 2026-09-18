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
        <div className="p-4 bg-emerald-600 text-white font-medium rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C8880] hover:text-[#0B1C30] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to User Activity</span>
        </Link>
      </div>

      {/* Hero Card */}
      <Card className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#EBE4D8]">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-[#F3DAC9] shadow-sm">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" />
                <AvatarFallback className="bg-[#FDF2EA] text-[#C85A17] text-xl font-bold">
                  {activity.member.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">
                    {activity.member}
                  </h1>
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border ${
                      isDeposit
                        ? 'bg-[#EDFDF3] text-[#16A34A] border-[#D1F7DE]'
                        : 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]'
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
                <p className="text-xs font-mono text-[#8C8880] mt-1 font-medium">
                  Member ID:{' '}
                  <span className="font-semibold text-[#0B1C30]">{activity.memberId}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleReissue}
                className="h-10 im-btn-specular font-semibold text-xs px-5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-issue Notice</span>
              </Button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE4D8]/70">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-[#8C8880] font-bold uppercase tracking-wider">Attribution Partner</p>
                <p className="text-sm font-bold text-[#0B1C30]">{activity.partner}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE4D8]/70">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0B1C30] border border-[#EBE4D8] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-[#8C8880] font-bold uppercase tracking-wider">Logged Time</p>
                <p className="text-sm font-bold text-[#0B1C30]">{activity.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE4D8]/70">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs border ${
                  isDeposit ? 'bg-[#EDFDF3] text-[#16A34A] border-[#D1F7DE]' : 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]'
                }`}
              >
                PTS
              </div>
              <div>
                <p className="text-[11px] text-[#8C8880] font-bold uppercase tracking-wider">Point Amount</p>
                <p
                  className={`text-sm font-bold ${
                    isDeposit ? 'text-[#16A34A]' : 'text-[#E11D48]'
                  }`}
                >
                  {isDeposit ? `+${activity.amount}` : activity.amount} pts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE4D8]/70">
              <div className="w-10 h-10 rounded-xl bg-[#EDFDF3] text-[#16A34A] border border-[#D1F7DE] flex items-center justify-center shrink-0 font-bold text-xs">
                LKR
              </div>
              <div>
                <p className="text-[11px] text-[#8C8880] font-bold uppercase tracking-wider">Conversion Value</p>
                <p className="text-sm font-bold text-[#0B1C30]">LKR {lkrEquivalent}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Event Details (7 cols) */}
        <Card className="lg:col-span-7 bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">Transaction Record</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]/60">
                <span className="text-[#8C8880] font-medium">Transaction Reference</span>
                <span className="font-mono font-bold text-[#0B1C30]">
                  PTX-{activity.id.toUpperCase()}-IM
                </span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]/60">
                <span className="text-[#8C8880] font-medium">Event Type</span>
                <span className="font-semibold text-[#0B1C30]">
                  {isDeposit ? 'Studio Admin Point Issue' : 'Partner Check-In Deduction'}
                </span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]/60">
                <span className="text-[#8C8880] font-medium">Conversion Standard</span>
                <span className="font-semibold text-[#0B1C30]">1 Point = 200 LKR</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]/60">
                <span className="text-[#8C8880] font-medium">Verification Status</span>
                <span className="font-semibold text-[#16A34A] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authenticated & Balanced</span>
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-[#8C8880] font-medium">Channel</span>
                <span className="font-semibold text-[#0B1C30]">Island Monkey Studio Portal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Member Profile (5 cols) */}
        <Card className="lg:col-span-5 bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] text-[#0B1C30] border border-[#EBE4D8] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">Member Status</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]/60">
                <span className="text-[#8C8880] font-medium">Member Name</span>
                <span className="font-semibold text-[#0B1C30]">{activity.member}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]/60">
                <span className="text-[#8C8880] font-medium">Membership ID</span>
                <span className="font-mono font-semibold text-[#8C8880]">{activity.memberId}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[#EBE4D8]/60">
                <span className="text-[#8C8880] font-medium">Membership Tier</span>
                <span className="font-bold text-[#C85A17]">Island Monkey VIP</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-[#8C8880] font-medium">Account Status</span>
                <span className="font-semibold text-[#16A34A]">Active & Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
