import { fetchApi } from './client';
import { ModelProfile } from '../types';

export const getModels = async (search?: string): Promise<ModelProfile[]> => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetchApi(`/models${query}`);
};

export const getModelById = async (id: string): Promise<ModelProfile> => {
  return fetchApi(`/models/${id}`);
};
