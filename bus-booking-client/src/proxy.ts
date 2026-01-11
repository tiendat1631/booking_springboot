import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/my-bookings", "/profile"];

// Routes only for unauthenticated users
const authRoutes = ["/login", "/register", "/forgot-password"];

// Routes only for admin users (admin panel)
const adminRoutes = [
    "/dashboard",
    "/stations",
    "/routes",
    "/buses",
    "/trips",
    "/bookings",
    "/payments",
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session from cookies (contains user info including roles)
    const sessionCookie = request.cookies.get("session")?.value;

    let session: { roles?: string } | null = null;
    if (sessionCookie) {
        try {
            session = JSON.parse(sessionCookie);
        } catch {
            session = null;
        }
    }

    const isAuthenticated = !!session;
    const isAdmin = session?.roles?.includes("ADMIN") ?? false;

    // Redirect authenticated users away from auth pages
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Protect routes that require authentication
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Protect admin routes
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (!isAdmin) {
            // Redirect non-admin users to home
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};
