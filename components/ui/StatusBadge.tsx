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
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 shadow-none font-medium text-xs px-2.5 py-0.5 rounded-full">
          Pending
        </Badge>
      );
    case 'approved':
    case 'active':
    case 'available':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 shadow-none font-medium text-xs px-2.5 py-0.5 rounded-full">
          {normalized === 'active' ? 'Active' : normalized === 'available' ? 'Available' : 'Approved'}
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200 shadow-none font-medium text-xs px-2.5 py-0.5 rounded-full">
          Completed
        </Badge>
      );
    case 'cancelled':
    case 'unavailable':
      return (
        <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200 shadow-none font-medium text-xs px-2.5 py-0.5 rounded-full">
          {normalized === 'unavailable' ? 'Unavailable' : 'Cancelled'}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 shadow-none font-medium text-xs px-2.5 py-0.5 rounded-full">
          {status}
        </Badge>
      );
  }
}
