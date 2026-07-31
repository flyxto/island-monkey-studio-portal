import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  change?: string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, subtext, change, icon: Icon }: StatCardProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-xs hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">{label}</p>
          {Icon && <Icon className="w-5 h-5 text-indigo-500 opacity-80" />}
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          {change && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {change}
            </span>
          )}
        </div>
        {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
      </CardContent>
    </Card>
  );
}
