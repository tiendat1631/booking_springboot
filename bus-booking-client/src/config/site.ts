export const siteConfig = {
    name: "Bus Booking",
    description: "Hệ thống đặt vé xe khách trực tuyến",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ogImage: "/og.jpg",
    links: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
    },
    creator: "Bus Booking Team",
    keywords: [
        "đặt vé xe",
        "xe khách",
        "vé xe online",
        "bus booking",
        "đặt vé trực tuyến",
    ],
} as const;

export type SiteConfig = typeof siteConfig;
