import Link from "next/link";
import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const NAV_LINKS = [
    { label: "Search Trips", href: ROUTES.SEARCH },
    { label: "My Bookings", href: ROUTES.MY_BOOKINGS },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
] as const;

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="p-1.5 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
                            <Bus className="size-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">BusGo</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href={ROUTES.LOGIN}>
                            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                                Sign in
                            </Button>
                        </Link>
                        <Link href={ROUTES.REGISTER}>
                            <Button size="sm">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
