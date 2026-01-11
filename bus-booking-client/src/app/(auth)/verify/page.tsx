import type { Metadata } from "next";
import { VerifyEmailContent } from "./_components/verify-email-content";

export const metadata: Metadata = {
    title: "Verify Email - BusGo",
    description: "Verify your email address to activate your BusGo account.",
};

interface VerifyEmailPageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
    const params = await searchParams;
    const token = params.token;

    return <VerifyEmailContent token={token} />;
}
