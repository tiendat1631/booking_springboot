
import { AxiosError } from 'axios';
import {axiosInstance} from "@/lib/fetcher.ts";

type LoginPayload = {
  username: string;
  password: string;
};

type SignupPayload = {
  username: string;
  password: string;
  email: string;
  name: string;
  age: string;
};

export async function login(payload: LoginPayload) {
  try {
    const response = await axiosInstance.post('/auth/login', payload);
    console.log(response);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
}

export async function signup(payload: SignupPayload) {
  try {
    const response = await axiosInstance.post('/auth/register', payload);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return error;
  }
}
