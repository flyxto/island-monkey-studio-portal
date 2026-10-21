import { fetchApi } from './client';
import { Addon, CreateAddonDto, AddonType } from '../types';

export const getAddons = async (type?: AddonType): Promise<Addon[]> => {
  const query = type ? `?type=${type}` : '';
  return fetchApi(`/addons${query}`, {
    method: 'GET',
  });
};

export const getAddon = async (id: string): Promise<Addon> => {
  return fetchApi(`/addons/${id}`, {
    method: 'GET',
  });
};

export const createAddon = async (data: CreateAddonDto): Promise<Addon> => {
  return fetchApi('/addons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAddon = async (id: string, data: Partial<CreateAddonDto>): Promise<Addon> => {
  return fetchApi(`/addons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAddon = async (id: string): Promise<void> => {
  return fetchApi(`/addons/${id}`, {
    method: 'DELETE',
  });
};
