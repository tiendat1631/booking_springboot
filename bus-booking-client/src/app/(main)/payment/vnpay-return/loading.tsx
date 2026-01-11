import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VNPayReturnLoading() {
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Processing Payment</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="size-16 animate-spin text-primary" />
                </CardContent>
            </Card>
        </div>
    );
}
