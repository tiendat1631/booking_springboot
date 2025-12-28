"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Mail, User, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { register as registerAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { GoogleIcon } from "@/components/shared";
import { ROUTES } from "@/lib/constants";
import { registerSchema, type RegisterInput } from "@/lib/validators";

export function RegisterForm() {
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
        },
    });

    async function onSubmit(data: RegisterInput) {
        try {
            const result = await registerAction(data);

            if (result?.success) {
                setIsSuccess(true);
                toast.success("Account created successfully!", {
                    description: "Please check your email to verify your account.",
                });
            } else if (result?.error) {
                // Handle field-specific errors
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, messages]) => {
                        form.setError(field as keyof RegisterInput, {
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

    // Redirect to login after success
    useEffect(() => {
        if (!isSuccess) return;

        const timer = setTimeout(() => {
            router.push(ROUTES.LOGIN);
        }, 3000);
        return () => clearTimeout(timer);
    }, [isSuccess, router]);



    // Success state
    if (isSuccess) {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Global Error */}
                {form.formState.errors.root && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                <FieldGroup>
                    {/* Name Fields - Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* First Name Field */}
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-firstName">First name</FieldLabel>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            id="register-firstName"
                                            type="text"
                                            placeholder="John"
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

                        {/* Last Name Field */}
                        <Controller
                            name="lastName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-lastName">Last name</FieldLabel>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            id="register-lastName"
                                            type="text"
                                            placeholder="Doe"
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
                    </div>

                    {/* Email Field */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        {...field}
                                        id="register-email"
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

                    {/* Phone Field */}
                    <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="register-phone">Phone number</FieldLabel>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        {...field}
                                        id="register-phone"
                                        type="tel"
                                        placeholder="0912345678"
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
                                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                                <PasswordInput
                                    {...field}
                                    id="register-password"
                                    placeholder="At least 6 characters"
                                    className="h-11"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                <FieldDescription>
                                    Password must be at least 6 characters
                                </FieldDescription>
                            </Field>
                        )}
                    />
                </FieldGroup>

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
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? (
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
