import type { Metadata } from "next";

import { AdminHeader } from "../_components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Quản lý thanh toán",
};

export default function PaymentsPage() {
    return (
        <>
            <AdminHeader title="Thanh toán" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Thanh toán</h2>
                    <p className="text-muted-foreground">
                        Xem và quản lý các giao dịch thanh toán
                    </p>
                </div>

                {/* Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Bảng quản lý thanh toán sẽ được hiển thị tại đây.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
