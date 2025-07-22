import fetcher from "@/lib/fetcher";
import { LoginPayload, SignupPayload } from "./types";

export async function login(payload: LoginPayload) {
  return await fetcher({ method: 'POST', route: '/users/login', payload });
}

export async function signup(payload: SignupPayload) {
  return await fetcher({ method: 'POST', route: '/users/signup', payload });
}
