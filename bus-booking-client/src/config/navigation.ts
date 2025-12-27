import {
    LayoutDashboard,
    Bus,
    Ticket,
    Users,
    MapPin,
    Route,
    type LucideIcon,
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    disabled?: boolean;
    external?: boolean;
    badge?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

// Main navigation for public pages
export const mainNavItems: NavItem[] = [
    {
        title: "Trang chủ",
        href: "/",
    },
    {
        title: "Tìm chuyến",
        href: "/search",
    },
    {
        title: "Tra cứu vé",
        href: "/my-bookings",
    },
];

// User menu items
export const userNavItems: NavItem[] = [
    {
        title: "Vé của tôi",
        href: "/my-bookings",
    },
    {
        title: "Tài khoản",
        href: "/profile",
    },
];

// Admin sidebar navigation
export const adminNavGroups: NavGroup[] = [
    {
        title: "Tổng quan",
        items: [
            {
                title: "Dashboard",
                href: "/admin/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Quản lý",
        items: [
            {
                title: "Chuyến xe",
                href: "/admin/trips",
                icon: Bus,
            },
            {
                title: "Đặt vé",
                href: "/admin/bookings",
                icon: Ticket,
            },
            {
                title: "Khách hàng",
                href: "/admin/customers",
                icon: Users,
            },
        ],
    },
    {
        title: "Cấu hình",
        items: [
            {
                title: "Tuyến đường",
                href: "/admin/routes",
                icon: Route,
            },
            {
                title: "Bến xe",
                href: "/admin/stations",
                icon: MapPin,
            },
        ],
    },
];
