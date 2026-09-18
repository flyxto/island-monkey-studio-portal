import { fetchApi } from './client';
import { BookingResponse, GetBookingsResponse, BookingStatus } from '../types';

export const getBookings = async (
  options: { status?: string; search?: string; page?: number; limit?: number } = {}
): Promise<GetBookingsResponse> => {
  const query = new URLSearchParams();
  if (options.status && options.status !== 'All') {
    query.append('status', options.status);
  }
  if (options.search) {
    query.append('search', options.search);
  }
  if (options.page) {
    query.append('page', options.page.toString());
  }
  if (options.limit) {
    query.append('limit', options.limit.toString());
  }

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchApi(`/bookings${queryString}`);
};

export const getBookingById = async (id: string): Promise<BookingResponse> => {
  return fetchApi(`/bookings/${id}`);
};

export const updateBookingStatus = async (
  id: string,
  status: BookingStatus
): Promise<BookingResponse> => {
  return fetchApi(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};
