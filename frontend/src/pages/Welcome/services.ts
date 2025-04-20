import axiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';

type LoginPayload = {
  username: string;
  password: string;
};

type SignupPayload = {
  email: string;
  username: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  try {
    const response = await axiosInstance.post('/users/login', payload);
    console.log(response);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return error;
  }
}

export async function signup(payload: SignupPayload) {
  try {
    const response = await axiosInstance.post('/users/signup', payload);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return error;
  }
}
