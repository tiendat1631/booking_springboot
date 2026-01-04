// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        VERIFY: (token: string) => `/auth/verify?token=${token}`,
    },
    // Bookings
    BOOKINGS: {
        BASE: "/bookings",
        ADMIN: "/bookings/admin",
        MY_BOOKINGS: "/bookings/my-bookings",
        BY_ID: (id: string) => `/bookings/${id}`,
        REQUEST_CANCELLATION: (id: string) => `/bookings/${id}/request-cancellation`,
        CANCEL: (id: string) => `/bookings/${id}/cancel`,
        PAYMENT: (id: string) => `/bookings/${id}/payment`,
    },
    // Trips
    TRIPS: {
        BASE: "/trips",
        SEARCH: "/trips/search",
        STATUSES: "/trips/statuses",
        BY_ID: (id: string) => `/trips/${id}`,
    },
    // Stations
    STATIONS: {
        BASE: "/stations",
        BY_ID: (id: string) => `/stations/${id}`,
    },
    // Routes
    ROUTES: {
        BASE: "/routes",
        BY_ID: (id: string) => `/routes/${id}`,
        ACTIVE: "/routes/active",
    },
    // Buses
    BUSES: {
        BASE: "/buses",
        BY_ID: (id: string) => `/buses/${id}`,
    },
    // Payment
    PAYMENT: {
        INITIATE: (bookingId: string) => `/payments/booking/${bookingId}`,
        VNPAY_CALLBACK: "/payments/vnpay/callback",
        CONFIRM_CASH: (bookingId: string) => `/payments/cash/confirm/${bookingId}`
    },
} as const;

// Route paths for navigation
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY_EMAIL: "/verify-email",
    FORGOT_PASSWORD: "/forgot-password",
    SEARCH: "/search",
    BOOKING: (tripId: string) => `/booking/${tripId}`,
    BOOKING_CONFIRMATION: (bookingId: string) => `/booking/confirmation/${bookingId}`,
    MY_BOOKINGS: "/my-bookings",
    PROFILE: "/profile",
    // Admin routes
    ADMIN: {
        DASHBOARD: "/dashboard",
        STATIONS: "/stations",
        ROUTES: "/routes",
        BUSES: "/buses",
        TRIPS: "/trips",
        BOOKINGS: "/bookings",
        PAYMENTS: "/payments",
    },
} as const;
