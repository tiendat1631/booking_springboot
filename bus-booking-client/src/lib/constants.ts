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
        BY_ID: (id: string) => `/trips/${id}`,
        SEATS: (id: string) => `/trips/${id}/seats`,
    },
    // Stations
    STATIONS: {
        BASE: "/stations",
        BY_ID: (id: string) => `/stations/${id}`,
        BY_CITY: (city: string) => `/stations/city/${city}`,
        ACTIVE: "/stations/active",
    },
    // Routes
    ROUTES: {
        BASE: "/routes",
        BY_ID: (id: string) => `/routes/${id}`,
    },
    // Payment
    PAYMENT: {
        VNPAY_CREATE: "/payment/vnpay/create",
        VNPAY_CALLBACK: "/payment/vnpay/callback",
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
        DASHBOARD: "/admin/dashboard",
        TRIPS: "/admin/trips",
        TRIP_DETAILS: (id: string) => `/admin/trips/${id}`,
        BOOKINGS: "/admin/bookings",
        CUSTOMERS: "/admin/customers",
        ROUTES: "/admin/routes",
        STATIONS: "/admin/stations",
    },
} as const;
