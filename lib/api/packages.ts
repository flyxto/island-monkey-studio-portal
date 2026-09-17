import { fetchApi } from './client';
import { Package, CreatePackageDto } from '../types';

export const getPackages = async (): Promise<Package[]> => {
  return fetchApi('/packages', {
    method: 'GET',
  });
};

export const getPackage = async (id: string): Promise<Package> => {
  return fetchApi(`/packages/${id}`, {
    method: 'GET',
  });
};

export const createPackage = async (data: CreatePackageDto): Promise<Package> => {
  return fetchApi('/packages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePackage = async (id: string, data: Partial<CreatePackageDto>): Promise<Package> => {
  return fetchApi(`/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deletePackage = async (id: string): Promise<void> => {
  return fetchApi(`/packages/${id}`, {
    method: 'DELETE',
  });
};
