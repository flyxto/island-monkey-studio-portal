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
    <div className="bg-white rounded-[22px] border border-[#EBE4D8] shadow-2xs hover:shadow-xs hover:border-[#DFCFC0] transition-all duration-200 p-5 sm:p-6 relative group overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-[#8C8880] uppercase">
          {label}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#FDF2EA] text-[#C85A17] flex items-center justify-center border border-[#F3DAC9]/60 group-hover:scale-105 transition-transform duration-200">
            <Icon className="w-4 h-4 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-baseline gap-2.5">
        <span className="text-[32px] sm:text-[36px] font-semibold text-[#0B1C30] tracking-tight leading-none">
          {value}
        </span>
        {change && (
          <span className="text-xs font-semibold text-[#16A34A] bg-[#EDFDF3] border border-[#DCFCE7] px-2.5 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs font-medium text-[#616161] leading-normal">
          {subtext}
        </p>
      )}
    </div>
  );
}
