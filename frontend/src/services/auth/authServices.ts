import fetcher, { ApiResponse } from "@/lib/fetcher";
import { LoginPayload, LoginResponse, SignupPayload } from "./types";

export async function login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
  return await fetcher<LoginResponse>({
    method: 'POST',
    route: '/auth/login',
    payload
  });
}

export async function logout(): Promise<ApiResponse<void>> {
  return await fetcher({
    method: 'POST',
    route: '/auth/logout',
  });
}

export async function signup(payload: SignupPayload) {
  return await fetcher({ method: 'POST', route: '/auth/register', payload });
}


export async function refresh(): Promise<ApiResponse<LoginResponse>> {
  return await fetcher<LoginResponse>({
    method: 'GET',
    route: '/auth/refresh',
  });
}