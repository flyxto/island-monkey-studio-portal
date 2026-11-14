import { fetchApi } from './client';

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

export interface IssuePointsPayload {
  userId: string;
  amount: number;
  description?: string;
}

export interface IssuePointsResponse {
  transaction: any;
  newBalance: number;
  member: {
    id: string;
    name: string;
    memberId: string;
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchApi('/dashboard/stats', { method: 'GET' });
}

export async function issuePoints(payload: IssuePointsPayload): Promise<IssuePointsResponse> {
  return fetchApi('/points/issue', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
