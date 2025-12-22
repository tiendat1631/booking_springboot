import { getAccessToken, setAccessToken } from '@/context/AuthContext';
import { refresh } from '@/services/auth/authServices';
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';



// ========== Helper functions ==========
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function timeDelay(k: number): number {
  const base_interval = 0.5;
  const base_multiplier = 1.5;
  const retry_interval = base_interval * base_multiplier ** (k - 1) * 1000;
  const max = k === 5 ? 500 : retry_interval;
  return retry_interval + randomInt(0, max);
}

function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// ========== Retry control ==========
let _retry_count = 0;

export function resetRetry(): void {
  _retry_count = 0;
}

type FetcherParams = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  route: string;
  payload?: any;
  options?: AxiosRequestConfig;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string; // Nếu có lỗi hiển thị cho người dùng, set ở đây
  data: T;
  error?: string;
  statusCode: number;
};


// ===== AxiosInstance =====
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  responseType: 'json',
});

// ===== Interceptors =====
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use((response) => response, async (error: AxiosError) => {

  // Save request
  const origReqConfig = error.config as AxiosRequestConfig & {
    headers: Record<string, any>;
  };

  // Server lost connection error (retry 3 times)
  if (error.response?.status && error.response.status >= 500 && _retry_count < 4) {
    _retry_count++;
    return wait(timeDelay(_retry_count)).then(() =>
      axiosInstance.request(origReqConfig)
    );
  }

  // Token expired
  if (error.response?.status === 401 && origReqConfig.headers.hasOwnProperty('Authorization')) {
    console.log("Handle 401 Token expired")
    if (_retry_count < 4) {
      _retry_count++
      const res = await refresh();

      if (res.success) {
        delete origReqConfig.headers['Authorization']
        const { accessToken } = res.data;

        console.log(res.data)
        setAccessToken(accessToken)

        // retry request
        origReqConfig.headers = {
          ...origReqConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return axiosInstance.request(origReqConfig);
      }
    } else {
      return Promise.reject(error);
    }
  }

  if (error.response?.status === 403) {
    console.warn('Forbidden - Access denied.');
  }

  return Promise.reject(error);
}
);

// ======================================

// Wrapper function
async function fetcher<T = any>({ method, route, payload = undefined, options = {} }: FetcherParams): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance({
      method,
      url: route,
      data: payload,
      ...options,
    });

    return response.data as ApiResponse<T>;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.data) {
      return err.response.data as ApiResponse<T>;
    }

    return {
      success: false,
      message: 'Lỗi không xác định, vui lòng thử lại sau',
      data: null as any,
      error: err.message,
      statusCode: 500,
    };
  }
}

export default fetcher;
