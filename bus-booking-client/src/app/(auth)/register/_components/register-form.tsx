"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { register } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/shared";
import { ROUTES } from "@/lib/constants";

export function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(register, null);

    // Redirect to login after success
    useEffect(() => {
        if (!state?.success) return;

        toast.success("Account created successfully!", {
            description: "Please check your email to verify your account.",
        });

        const timer = setTimeout(() => {
            router.push(ROUTES.LOGIN);
        }, 3000);
        return () => clearTimeout(timer);
    }, [state?.success, router]);

    // Handle errors with toast
    useEffect(() => {
        if (state && !state.success && state.error && !state.fieldErrors) {
            toast.error(state.error);
        }
    }, [state]);

    // Success state
    if (state?.success) {
        return (
            <div className="space-y-6 animate-fade-in text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto">
                    <CheckCircle2 className="size-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                        Registration Successful!
                    </h2>
                    <p className="text-muted-foreground">
                        Please check your email to verify your account.
                        <br />
                        Redirecting to login page...
                    </p>
                </div>
                <div className="pt-4">
                    <Link href={ROUTES.LOGIN}>
                        <Button variant="outline" className="h-11">
                            Sign in now
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Create an account
                </h1>
                <p className="text-muted-foreground">
                    Sign up to start booking bus tickets
                </p>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-4">
                {/* Global Error */}
                {state && !state.success && state.error && !state.fieldErrors && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {state.error}
                    </div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="pl-10 h-11"
                            disabled={isPending}
                            aria-invalid={!!(state && !state.success && state.fieldErrors?.name)}
                        />
                    </div>
                    {state && !state.success && state.fieldErrors?.name && (
                        <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
                    )}
                </div>

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

                {/* Phone Field */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="pl-10 h-11"
                            disabled={isPending}
                            aria-invalid={!!(state && !state.success && state.fieldErrors?.phone)}
                        />
                    </div>
                    {state && !state.success && state.fieldErrors?.phone && (
                        <p className="text-sm text-destructive">{state.fieldErrors.phone[0]}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
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
                    <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                </div>

                {/* Terms */}
                <p className="text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link href="#" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </p>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Sign up"
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

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href={ROUTES.LOGIN}
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
