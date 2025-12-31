"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { login } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { GoogleIcon } from "@/components/shared";
import { ROUTES } from "@/lib/constants";
import { loginSchema, type LoginInput } from "@/lib/validators";

export function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginInput) {
        try {
            const result = await login(data);

            if (result?.success) {
                toast.success("Welcome back!", {
                    description: "You have successfully signed in.",
                });
                router.push(ROUTES.HOME);
                router.refresh();
            } else if (result?.error) {
                // Handle field-specific errors
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, messages]) => {
                        form.setError(field as keyof LoginInput, {
                            type: "server",
                            message: messages[0],
                        });
                    });
                } else {
                    form.setError("root", { message: result.error });
                    toast.error(result.error);
                }
            }
        } catch {
            form.setError("root", { message: "An unexpected error occurred" });
            toast.error("An unexpected error occurred");
        }
    }



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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Global Error */}
                {form.formState.errors.root && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                <FieldGroup>
                    {/* Email Field */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        {...field}
                                        id="login-email"
                                        type="email"
                                        placeholder="email@example.com"
                                        className="pl-10 h-11"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Password Field */}
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                                    <Link
                                        href={ROUTES.FORGOT_PASSWORD}
                                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <PasswordInput
                                    {...field}
                                    id="login-password"
                                    placeholder="••••••••"
                                    className="h-11"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? (
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
