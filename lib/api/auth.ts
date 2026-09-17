import { fetchApi, setAuthToken, clearAuthToken, getRefreshToken } from './client';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  name: string;
}

export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  const data = await fetchApi('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (data?.accessToken) {
    setAuthToken(data.accessToken, data.refreshToken);
  }
  
  return data;
};

export const logoutAdmin = async () => {
  const refreshToken = getRefreshToken();
  
  if (refreshToken) {
    try {
      await fetchApi('/admin/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch (e) {
      console.warn('Failed to logout from backend', e);
    }
  }

  clearAuthToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
