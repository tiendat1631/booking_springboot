"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { login } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/shared";
import { ROUTES } from "@/lib/constants";

export function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(login, null);

    useEffect(() => {
        if (state?.success) {
            toast.success("Welcome back!", {
                description: "You have successfully signed in.",
            });
            router.push(ROUTES.HOME);
            router.refresh();
        } else if (state && !state.success && state.error && !state.fieldErrors) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Welcome back
                </h1>
                <p className="text-muted-foreground">
                    Sign in to continue booking your trips
                </p>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-5">
                {/* Global Error */}
                {state && !state.success && state.error && !state.fieldErrors && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {state.error}
                    </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            className="pl-10 h-11"
                            disabled={isPending}
                            aria-invalid={!!(state && !state.success && state.fieldErrors?.email)}
                        />
                    </div>
                    {state && !state.success && state.fieldErrors?.email && (
                        <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href={ROUTES.FORGOT_PASSWORD}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-11"
                            disabled={isPending}
                            aria-invalid={!!(state && !state.success && state.fieldErrors?.password)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {state && !state.success && state.fieldErrors?.password && (
                        <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">
                        Or
                    </span>
                </div>
            </div>

            {/* Social Login Placeholder */}
            <Button variant="outline" className="w-full h-11" disabled>
                <GoogleIcon className="mr-2" />
                Continue with Google
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href={ROUTES.REGISTER}
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}
