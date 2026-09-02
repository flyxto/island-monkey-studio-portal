'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Store,
  Calendar,
  Clock,
  User,
  RefreshCw,
  Check,
  CheckCircle2,
  FileText,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { INITIAL_PARTNER_ACTIVITIES } from '@/lib/mock-data/studio-dashboard';

export default function PartnerActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const activityId = resolvedParams.id;

  const initialActivity =
    INITIAL_PARTNER_ACTIVITIES.find((a) => a.id === activityId) ||
    INITIAL_PARTNER_ACTIVITIES[0];

  const [activity] = useState(initialActivity);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleReissue = () => {
    setToastMessage(
      `Transaction confirmation re-issued successfully to ${activity.partnerName} and ${activity.customerName}!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

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
          href="/activity/partners"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partner Activity</span>
        </Link>
      </div>

      {/* Hero Card */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C85A17] flex items-center justify-center border border-amber-100 shadow-sm shrink-0">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-medium text-slate-900">
                    {activity.partnerName}
                  </h1>
                  <span className="bg-emerald-50 text-emerald-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Settled & Logged</span>
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Transaction Ref:{' '}
                  <span className="font-medium text-slate-700">
                    TXN-{activity.id.toUpperCase()}-IM
                  </span>
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
                <span>Re-issue Transaction</span>
              </Button>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Customer</p>
                <p className="text-sm font-medium text-slate-900">{activity.customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C85A17] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Logged Time</p>
                <p className="text-sm font-medium text-slate-900">{activity.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-medium text-sm">
                PTS
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Points Redeemed</p>
                <p className="text-sm font-medium text-red-600">{activity.amount} pts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-medium text-xs">
                LKR
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">LKR Value Equivalent</p>
                <p className="text-sm font-medium text-slate-900">LKR {lkrEquivalent}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Transaction Details (7 cols) */}
        <Card className="lg:col-span-7 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C85A17] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-slate-900">Partner Settlement Breakdown</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Partner Organization</span>
                <span className="font-medium text-slate-900">{activity.partnerName}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Partner Tier</span>
                <span className="font-medium text-emerald-600">Verified Ecosystem Partner</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Point Conversion Rate</span>
                <span className="font-medium text-slate-800">1 Point = 200 LKR</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Settlement Status</span>
                <span className="font-medium text-emerald-600">Direct Portal Deduct</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 font-medium">Ledger Verification Hash</span>
                <span className="font-mono text-slate-500 font-medium">0x8f3c...b291</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Customer & Member Info (5 cols) */}
        <Card className="lg:col-span-5 bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium text-slate-900">Member Attribution</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer Name</span>
                <span className="font-medium text-slate-900">{activity.customerName}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer ID</span>
                <span className="font-mono font-medium text-slate-700">{activity.customerId}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Deduction Method</span>
                <span className="font-medium text-slate-800">QR Member Scan</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 font-medium">Net Value Processed</span>
                <span className="text-sm font-medium text-slate-900">LKR {lkrEquivalent}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
