"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

import { verifyEmail } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

interface VerifyEmailContentProps {
    token?: string;
}

type VerificationState = "loading" | "success" | "error" | "no-token";

export function VerifyEmailContent({ token }: VerifyEmailContentProps) {
    const router = useRouter();
    const [state, setState] = useState<VerificationState>(token ? "loading" : "no-token");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (!token) return;

        const verify = async () => {
            const result = await verifyEmail(token);
            if (result.success) {
                setState("success");
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push(ROUTES.LOGIN);
                }, 3000);
            } else {
                setState("error");
                setErrorMessage(result.error || "Verification failed");
            }
        };

        verify();
    }, [token, router]);

    // No token provided
    if (state === "no-token") {
        return (
            <div className="space-y-6 animate-fade-in text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted text-muted-foreground mx-auto">
                    <Mail className="size-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                        No Verification Token
                    </h2>
                    <p className="text-muted-foreground">
                        Please click the verification link from your email.
                    </p>
                </div>
                <div className="pt-4">
                    <Link href={ROUTES.LOGIN}>
                        <Button className="h-11">
                            Go to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Loading state
    if (state === "loading") {
        return (
            <div className="space-y-6 animate-fade-in text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto">
                    <Loader2 className="size-10 animate-spin" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                        Verifying Your Email
                    </h2>
                    <p className="text-muted-foreground">
                        Please wait while we verify your email address...
                    </p>
                </div>
            </div>
        );
    }

    // Success state
    if (state === "success") {
        return (
            <div className="space-y-6 animate-fade-in text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto">
                    <CheckCircle2 className="size-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                        Email Verified!
                    </h2>
                    <p className="text-muted-foreground">
                        Your account is now active. Redirecting to login...
                    </p>
                </div>
                <div className="pt-4">
                    <Link href={ROUTES.LOGIN}>
                        <Button className="h-11">
                            Sign in now
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Error state
    return (
        <div className="space-y-6 animate-fade-in text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mx-auto">
                <XCircle className="size-10" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                    Verification Failed
                </h2>
                <p className="text-muted-foreground">
                    {errorMessage || "The verification link is invalid or has expired."}
                </p>
            </div>
            <div className="pt-4 space-y-3">
                <Link href={ROUTES.REGISTER}>
                    <Button className="h-11 w-full sm:w-auto">
                        Register Again
                    </Button>
                </Link>
                <div>
                    <Link href={ROUTES.LOGIN}>
                        <Button variant="outline" className="h-11">
                            Go to Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
