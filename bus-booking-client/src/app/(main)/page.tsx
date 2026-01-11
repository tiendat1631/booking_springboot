import type { Metadata } from "next";

import {
    HeroSection,
    FeaturesSection,
    PopularRoutesSection,
    HowItWorksSection,
    CTASection,
} from "./_components/sections";

export const metadata: Metadata = {
    title: "BusGo - Book Bus Tickets Online",
    description: "The easiest way to book bus tickets online. Discover thousands of routes, book in minutes, and travel comfortably across the country.",
};

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <PopularRoutesSection />
            <HowItWorksSection />
            <CTASection />
        </>
    );
}
