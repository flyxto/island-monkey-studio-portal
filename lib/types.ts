export type BookingStatus = 'Pending' | 'Approved' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  bookingCode: string;
  customer: string;
  customerAvatar?: string;
  studioRoom: string;
  dateTime: string;
  duration: string;
  status: BookingStatus;
  amount: string;
}

export type GigStatus = 'pending' | 'active';

export interface Gig {
  id: string;
  modelId: string;
  title: string;
  tag: string;
  rate: string;
  description: string;
  bookingId: string;
  dateTime: string;
  duration: string;
  amount: string;
  status: GigStatus;
  coverImage: string;
  galleryImages: string[];
}

export interface ModelProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
  specialty: string;
  availability: 'Available' | 'Unavailable';
  uploadedTime: string;
  approvedGigsCount: number;
  pendingGigsCount: number;
  pendingGigs: Gig[];
  activeGigs: Gig[];
}

export interface RecentScanActivity {
  id: string;
  member: string;
  memberAvatar?: string;
  memberId: string;
  pointsAwarded: number;
  time: string;
}

export interface UserActivityItem {
  id: string;
  member: string;
  memberId: string;
  amount: number; // positive for deposit, negative for deduction
  partner: string;
  time: string;
}

export interface PartnerActivityItem {
  id: string;
  partnerName: string;
  customerName: string;
  customerId: string;
  amount: number; // negative deduction
  time: string;
}

export interface DashboardStats {
  conversionRate: {
    points: number;
    lkr: number;
  };
  pointsIssued: number;
  pointsIssuedChange: string;
  activeScansToday: number;
  newRegistrationsToday: number;
}

export interface BookingsStats {
  newBookings: number;
  pendingBookings: number;
  todaysLiveBookings: number;
}

export interface ModelsStats {
  activeModels: number;
  totalModels: number;
  pendingGigs: number;
  pendingPayments: number;
}

export interface UserActivityStats {
  totalUsers: number;
  todaysDeductions: number;
  todaysDeposits: number;
}

export interface PartnerActivityStats {
  totalPartners: number;
  todaysDeductions: number;
  totalDeductions: number;
}
