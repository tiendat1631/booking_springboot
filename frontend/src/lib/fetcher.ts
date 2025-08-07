import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

type FetcherParams = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  route: string;
  payload?: any;
  options?: AxiosRequestConfig;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string; // Nếu có lỗi hiển thị cho người dùng, set ở đây
  content: T;
  error?: string;
  statusCode: number;
};

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  responseType: 'json',
});

// ===== Interceptors =====
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Redirecting to login...');
      // TODO: redirect to login or clear session, etc.
    }

    if (error.response?.status === 403) {
      console.warn('Forbidden - Access denied.');
    }

    return Promise.reject(error);
  }
);

// ======================================

// Wrapper function
async function fetcher<T = any>({
  method,
  route,
  payload = undefined,
  options = {},
}: FetcherParams): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance({
      method,
      url: route,
      data: payload,
      ...options,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.data) {
      return err.response.data as ApiResponse<T>;
    }

    return {
      success: false,
      message: 'Lỗi không xác định, vui lòng thử lại sau',
      content: null as any,
      error: err.message,
      statusCode: 500,
    };
  }
}

export default fetcher;
