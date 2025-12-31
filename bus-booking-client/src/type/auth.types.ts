export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: string;
}

// Token data from login API
export interface AuthTokenData {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // in milliseconds
}

// Decoded JWT payload
export interface JwtPayload {
    iss: string;
    sub: string; // email
    exp: number;
    iat: number;
    userId: string;
    roles: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface Session {
    userId: string;
    email: string;
    roles: string;
    accessToken: string;
    expiresAt: number; // timestamp in ms
}
