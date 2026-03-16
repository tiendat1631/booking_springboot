import { DashboardStatisticResponse } from '@/type/dashboard';
import { apiGet } from './api';
import { API_ENDPOINTS } from './constants';
import { ApiResponse } from '@/type/api.types';

export async function getDashboardStats(): Promise<DashboardStatisticResponse> {
    const response = await apiGet<ApiResponse<DashboardStatisticResponse>>(
        API_ENDPOINTS.STATISTICS.DASHBOARD,
        {
            cache: 'no-store',
        }
    );
    
    if (!response.success) {
        throw new Error(response.message || 'Failed to fetch dashboard statistics');
    }
    
    return response.data;
}
