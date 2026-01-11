import Link from "next/link";
import { Bus, Check, ShieldCheck, Headphones } from "lucide-react";

// ============================================================================
// Feature Item
// ============================================================================

interface FeatureItemProps {
    icon: React.ReactNode;
    text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                {icon}
            </div>
            <span className="text-white/90">{text}</span>
        </div>
    );
}

// ============================================================================
// Auth Branding Panel
// ============================================================================

const FEATURES = [
    {
        icon: <Check className="size-5" />,
        text: "Book tickets 24/7, anytime, anywhere",
    },
    {
        icon: <ShieldCheck className="size-5" />,
        text: "Secure payment with VNPay",
    },
    {
        icon: <Headphones className="size-5" />,
        text: "Dedicated customer support",
    },
] as const;

interface AuthBrandingPanelProps {
    className?: string;
}

export function AuthBrandingPanel({ className }: AuthBrandingPanelProps) {
    return (
        <div className={className}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Abstract shapes */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-32 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full h-full">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                        <Bus className="size-7" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">BusGo</span>
                </Link>

                {/* Main content */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                            Book bus tickets
                            <br />
                            <span className="text-white/90">easy & fast</span>
                        </h1>
                        <p className="text-lg text-white/80 max-w-md leading-relaxed">
                            Discover thousands of routes across the country. Book tickets in minutes
                            with secure payment.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-4">
                        {FEATURES.map((feature, index) => (
                            <FeatureItem key={index} icon={feature.icon} text={feature.text} />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-sm text-white/60">
                    © {new Date().getFullYear()} BusGo. All rights reserved.
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// Auth Logo (Mobile)
// ============================================================================

export function AuthLogo() {
    return (
        <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-primary rounded-xl group-hover:bg-primary/90 transition-colors">
                <Bus className="size-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BusGo</span>
        </Link>
    );
}
