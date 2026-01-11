"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Ticket, Settings } from "lucide-react";

import { logout } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/lib/constants";
import type { Session } from "@/type";

interface HeaderAuthProps {
    session: Session | null;
}

export function HeaderAuth({ session }: HeaderAuthProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.refresh();
    };

    // Not logged in - show sign in buttons
    if (!session) {
        return (
            <div className="flex items-center gap-3">
                <Link href={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                        Sign in
                    </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                    <Button size="sm">
                        Get Started
                    </Button>
                </Link>
            </div>
        );
    }

    // Logged in - show user dropdown
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="size-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline-block max-w-[150px] truncate">
                        {session.email}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.email}</p>
                        <p className="text-xs text-muted-foreground">
                            {session.roles}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.roles?.includes("ADMIN") && (
                    <DropdownMenuItem asChild>
                        <Link href={ROUTES.ADMIN.DASHBOARD} className="cursor-pointer">
                            <Settings className="mr-2 size-4" />
                            Admin Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href={ROUTES.MY_BOOKINGS} className="cursor-pointer">
                        <Ticket className="mr-2 size-4" />
                        Vé của tôi
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={ROUTES.PROFILE} className="cursor-pointer">
                        <User className="mr-2 size-4" />
                        Tài khoản
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer"
                >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
