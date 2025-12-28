import type { Metadata } from "next";

import { AdminHeader } from "../_components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Payments",
};

export default function PaymentsPage() {
    return (
        <>
            <AdminHeader title="Payments" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
                    <p className="text-muted-foreground">
                        View and manage payment transactions
                    </p>
                </div>

                {/* Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Payment management table will be displayed here.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
