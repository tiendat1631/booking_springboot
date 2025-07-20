import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type fetcherParams = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  route: string;
  payload?: any;
  options?: AxiosRequestConfig;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string; // quy ước: Nếu có lỗi và cần hiển thị cho người dùng, set ở đây
  content: T;
  error?: string;
  statusCode: number;
};

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

async function fetcher({
  method,
  route,
  payload = undefined,
  options = {},
}: fetcherParams): Promise<ApiResponse> {
  try {
    const response = await axiosInstance({
      method,
      url: route,
      data: payload,
      ...options,
    });

    return response.data;
  } catch (error) {
    // axios throws an AxiosError object when response status is outside of 2xx range
    const err = error as AxiosError;

    if (err.response) {
      return err.response.data as ApiResponse;
    }

    return {
      success: false,
      message: 'Lỗi không xác định, vui lòng thử lại sau',
      content: null,
      error: err.message,
      statusCode: 500,
    };
  }
}

export default fetcher;
