import type { Metadata } from "next";

import { getVNProvinces } from "@/data";
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

export default async function HomePage() {
    const provinces = await getVNProvinces();

    return (
        <>
            <HeroSection provinces={provinces} />
            <FeaturesSection />
            <PopularRoutesSection />
            <HowItWorksSection />
            <CTASection />
        </>
    );
}
