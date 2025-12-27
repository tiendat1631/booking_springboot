export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface Session {
    user: User;
    accessToken: string;
    expiresAt: number;
}
