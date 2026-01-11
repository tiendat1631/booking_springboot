import type { Metadata } from "next";
import { RegisterForm } from "./_components/register-form";

export const metadata: Metadata = {
    title: "Sign Up - BusGo",
    description: "Create a new account to book bus tickets online",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
