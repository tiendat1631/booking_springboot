import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth.action";
import { ROUTES } from "@/lib/constants";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./_components/admin-sidebar";

export const metadata: Metadata = {
    title: {
        template: "%s | Admin - BusGo",
        default: "Admin - BusGo",
    },
    description: "BusGo Admin Dashboard",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Redirect to login if not authenticated
    if (!session) {
        redirect(ROUTES.LOGIN);
    }

    // Redirect if not admin
    if (!session.roles?.includes("ADMIN")) {
        redirect(ROUTES.HOME);
    }

    return (
        <SidebarProvider>
            <AdminSidebar session={session} />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
