import type { Metadata } from "next";
import { getDashboardStats } from "@/lib/dashboard";
import {
    Ticket,
    DollarSign,
    Calendar,
    CreditCard,
    TrendingUp,
    Users,
} from "lucide-react";

import { AdminHeader } from "../_components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Tổng quan",
};




export default async function AdminDashboardPage() {
    let stats;

    try {
    stats = await getDashboardStats();
    } catch (error) {
    console.error("Failed to load dashboard stats:", error);

    stats = {
        totalBookings: 0,
        totalTrips: 0,
        totalTicketsSold: 0,
        revenueToday: 0,
        revenueThisMonth: 0,
        revenueThisYear: 0,
    };
    }
    const STATS = [
        {
        title: "Tổng đặt vé",
        value: stats.totalBookings.toLocaleString(),
        change: "",
        changeType: "positive" as const,
        icon: Ticket,
        description: "tổng số booking",
        },
        {
        title: "Doanh thu hôm nay",
        value: `₫${stats.revenueToday.toLocaleString()}`,
        change: "",
        changeType: "positive" as const,
        icon: DollarSign,
        description: "doanh thu hôm nay",
        },
        {
        title: "Tổng chuyến xe",
        value: stats.totalTrips.toString(),
        change: "",
        changeType: "positive" as const,
        icon: Calendar,
        description: "tổng chuyến xe",
        },
        {
        title: "Vé đã bán",
        value: stats.totalTicketsSold.toString(),
        change: "",
        changeType: "positive" as const,
        icon: CreditCard,
        description: "tổng vé đã bán",
        },
    ];
    return (
        <>
            <AdminHeader title="Tổng quan" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {STATS.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span
                                        className={
                                            stat.changeType === "positive"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        {stat.change}
                                    </span>{" "}
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                
            </div>
        </>
    );
}
