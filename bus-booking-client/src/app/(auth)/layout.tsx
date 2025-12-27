import { AuthBrandingPanel, AuthLogo } from "@/components/layouts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding & Illustration */}
            <AuthBrandingPanel className="hidden lg:flex lg:w-1/2 xl:w-[55%] gradient-primary relative overflow-hidden" />

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <AuthLogo />
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
