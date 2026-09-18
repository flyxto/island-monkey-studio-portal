import { fetchApi } from './client';
import { CreateModelBookingRequest, ModelBookingResponse } from '../types';

export const createModelBooking = async (data: CreateModelBookingRequest): Promise<ModelBookingResponse> => {
  return fetchApi('/model-bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
