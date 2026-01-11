import type { Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
    title: "Sign In - BusGo",
    description: "Sign in to book bus tickets online",
};

export default function LoginPage() {
    return <LoginForm />;
}
