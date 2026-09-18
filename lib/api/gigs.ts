import { fetchApi } from './client';
import { Gig } from '../types';

export const getGigById = async (id: string): Promise<Gig> => {
  return fetchApi(`/gigs/${id}`);
};

export const approveGig = async (id: string): Promise<Gig> => {
  return fetchApi(`/gigs/${id}/approve`, {
    method: 'PATCH',
  });
};

export const rejectGig = async (id: string): Promise<Gig> => {
  return fetchApi(`/gigs/${id}/reject`, {
    method: 'PATCH',
  });
};
