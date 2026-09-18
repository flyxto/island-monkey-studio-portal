import { Badge } from '@/components/ui/badge';

export type StatusType =
  | 'Pending'
  | 'Approved'
  | 'Completed'
  | 'Cancelled'
  | 'Available'
  | 'Unavailable'
  | 'active'
  | 'pending';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'pending':
      return (
        <span className="inline-flex items-center bg-[#FFF9EB] text-[#B45309] border border-[#FDE68A] font-semibold text-[11px] px-2.5 py-0.5 rounded-full tracking-wide">
          Pending
        </span>
      );
    case 'approved':
    case 'active':
    case 'available':
      return (
        <span className="inline-flex items-center bg-[#EDFDF3] text-[#16A34A] border border-[#BBF7D0] font-semibold text-[11px] px-2.5 py-0.5 rounded-full tracking-wide">
          {normalized === 'active' ? 'Active' : normalized === 'available' ? 'Available' : 'Approved'}
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] font-semibold text-[11px] px-2.5 py-0.5 rounded-full tracking-wide">
          Completed
        </span>
      );
    case 'cancelled':
    case 'unavailable':
      return (
        <span className="inline-flex items-center bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-semibold text-[11px] px-2.5 py-0.5 rounded-full tracking-wide">
          {normalized === 'unavailable' ? 'Unavailable' : 'Cancelled'}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] font-semibold text-[11px] px-2.5 py-0.5 rounded-full tracking-wide">
          {status}
        </span>
      );
  }
}
