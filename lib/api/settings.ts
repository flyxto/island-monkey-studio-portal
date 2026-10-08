import { fetchApi } from './client';

export interface SystemSettings {
  conversion_rate_lkr?: string;
  studio_name?: string;
  admin_email?: string;
  [key: string]: string | undefined;
}

export interface UpdateSettingsPayload {
  conversionRateLkr?: number;
  studioName?: string;
  adminEmail?: string;
}

export async function getSettings(): Promise<SystemSettings> {
  return fetchApi('/settings', { method: 'GET' });
}

export async function updateSettings(data: UpdateSettingsPayload): Promise<SystemSettings> {
  return fetchApi('/settings', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
