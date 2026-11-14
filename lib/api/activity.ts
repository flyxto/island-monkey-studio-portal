import { fetchApi } from './client';

export interface PointTransaction {
  id: string;
  userId: string;
  partnerId?: string | null;
  amount: number;
  type: string;
  description?: string | null;
  referenceId?: string | null;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    memberId: string;
  };
  partner?: {
    storeName: string;
  };
}

export interface TransactionsResponse {
  transactions: PointTransaction[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TransactionFilterParams {
  userId?: string;
  partnerId?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export async function getTransactions(params: TransactionFilterParams = {}): Promise<TransactionsResponse> {
  const query = new URLSearchParams();
  if (params.userId) query.append('userId', params.userId);
  if (params.partnerId) query.append('partnerId', params.partnerId);
  if (params.type) query.append('type', params.type);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const qs = query.toString();
  return fetchApi(`/points/transactions${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function getUserTransactions(userId: string): Promise<{ transactions: PointTransaction[]; balance: number }> {
  return fetchApi(`/points/transactions/user/${userId}`, { method: 'GET' });
}

export async function getPartnerTransactions(partnerId: string): Promise<PointTransaction[]> {
  return fetchApi(`/points/transactions/partner/${partnerId}`, { method: 'GET' });
}
