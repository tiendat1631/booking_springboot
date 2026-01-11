import type { Metadata } from "next";
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

// Placeholder stats data - will be replaced with real API data
const STATS = [
    {
        title: "Tổng đặt vé",
        value: "1,234",
        change: "+12%",
        changeType: "positive" as const,
        icon: Ticket,
        description: "so với tháng trước",
    },
    {
        title: "Doanh thu",
        value: "₫45.5M",
        change: "+8%",
        changeType: "positive" as const,
        icon: DollarSign,
        description: "so với tháng trước",
    },
    {
        title: "Chuyến đang hoạt động",
        value: "89",
        change: "+5",
        changeType: "positive" as const,
        icon: Calendar,
        description: "đã lên lịch hôm nay",
    },
    {
        title: "Chờ thanh toán",
        value: "23",
        change: "-3",
        changeType: "negative" as const,
        icon: CreditCard,
        description: "chờ xác nhận",
    },
];

const QUICK_STATS = [
    { label: "Khách hàng mới", value: "156", icon: Users },
    { label: "Tỷ lệ hoàn thành", value: "94%", icon: TrendingUp },
];

export default function AdminDashboardPage() {
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

                {/* Quick Stats Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    {QUICK_STATS.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="flex items-center gap-4 pt-6">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                                    <stat.icon className="size-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Placeholder for charts/tables */}
                <div className="grid gap-4 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Đặt vé gần đây</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Dữ liệu đặt vé gần đây sẽ được hiển thị tại đây.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Tuyến đường phổ biến</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Phân tích tuyến đường phổ biến sẽ được hiển thị tại đây.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
