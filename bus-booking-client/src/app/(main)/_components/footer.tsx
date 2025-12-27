import Link from "next/link";
import { Bus, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_LINKS = {
    company: [
        { label: "About Us", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
        { label: "Blog", href: "#blog" },
    ],
    support: [
        { label: "Help Center", href: "#help" },
        { label: "FAQ", href: "#faq" },
        { label: "Contact Us", href: "#contact" },
        { label: "Terms of Service", href: "#terms" },
    ],
    services: [
        { label: "Book a Trip", href: "/search" },
        { label: "Group Bookings", href: "#group" },
        { label: "Corporate", href: "#corporate" },
        { label: "Partner with Us", href: "#partner" },
    ],
} as const;

const SOCIAL_LINKS = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
] as const;

export function Footer() {
    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-primary rounded-lg">
                                <Bus className="size-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">BusGo</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            The easiest way to book bus tickets online. Travel comfortably across
                            the country with our trusted network of bus operators.
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="size-4" />
                                <span>support@busgo.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="size-4" />
                                <span>1900 1234</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                <span>123 Main Street, Hanoi, Vietnam</span>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Support</h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Services</h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.services.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-8" />

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} BusGo. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {SOCIAL_LINKS.map((social) => (
                            <Link
                                key={social.label}
                                href={social.href}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={social.label}
                            >
                                <social.icon className="size-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
