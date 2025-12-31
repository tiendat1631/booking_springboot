"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MapPin,
    Route,
    Bus,
    Calendar,
    Ticket,
    CreditCard,
    ChevronUp,
    User2,
    LogOut,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth.action";
import { ROUTES } from "@/lib/constants";
import type { Session } from "@/type";

const NAV_ITEMS = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: ROUTES.ADMIN.DASHBOARD,
    },
    {
        title: "Stations",
        icon: MapPin,
        href: ROUTES.ADMIN.STATIONS,
    },
    {
        title: "Routes",
        icon: Route,
        href: ROUTES.ADMIN.ROUTES,
    },
    {
        title: "Buses",
        icon: Bus,
        href: ROUTES.ADMIN.BUSES,
    },
    {
        title: "Trips",
        icon: Calendar,
        href: ROUTES.ADMIN.TRIPS,
    },
    {
        title: "Bookings",
        icon: Ticket,
        href: ROUTES.ADMIN.BOOKINGS,
    },
    {
        title: "Payments",
        icon: CreditCard,
        href: ROUTES.ADMIN.PAYMENTS,
    },
] as const;

interface AdminSidebarProps {
    session: Session | null;
}

export function AdminSidebar({ session }: AdminSidebarProps) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Sidebar collapsible="icon">
            {/* Header with Logo */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={ROUTES.ADMIN.DASHBOARD}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Bus className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">BusGo</span>
                                    <span className="text-xs text-muted-foreground">
                                        Admin Panel
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with User Menu */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <User2 className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold truncate max-w-[120px]">
                                            {session?.email || "Admin"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {session?.roles || "Administrator"}
                                        </span>
                                    </div>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem asChild>
                                    <Link href={ROUTES.HOME}>
                                        <Bus className="mr-2 size-4" />
                                        Back to Site
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 size-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
