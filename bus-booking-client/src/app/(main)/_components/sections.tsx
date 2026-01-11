import Link from "next/link";
import { ArrowRight, Shield, Clock, CreditCard, Headphones, MapPin, Bus, Search, Ticket, CheckCircle } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { HeroSearchForm } from "./hero-search-form";
import { getVNProvinces } from "@/queries";

// ============================================================================
// Hero Section with Stats
// ============================================================================

const STATS = [
    { value: "100K+", label: "Hành khách hài lòng" },
    { value: "500+", label: "Nhà xe đối tác" },
    { value: "1000+", label: "Tuyến đường" },
    { value: "4.8★", label: "Đánh giá trung bình" },
] as const;



export async function HeroSection() {
    const promises = Promise.all([
        getVNProvinces(),
    ]);
    return (
        <section className="relative min-h-screen flex flex-col pt-20 pb-8 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 gradient-subtle" />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Bus className="size-4" />
                            <span>Được 100,000+ hành khách tin tưởng</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                            Đặt Vé Xe Khách
                            <br />
                            <span className="text-primary">Chỉ Trong Vài Phút</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Khám phá hàng ngàn tuyến đường trên khắp cả nước. Đặt vé dễ dàng,
                            thanh toán an toàn, và di chuyển thoải mái với các nhà xe uy tín hàng đầu.
                        </p>

                        {/* Search Form */}
                        <div className="pt-2">
                            <HeroSearchForm promises={promises} />
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Shield className="size-4 text-primary" />
                                <span>Thanh toán an toàn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="size-4 text-primary" />
                                <span>Xác nhận ngay lập tức</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Headphones className="size-4 text-primary" />
                                <span>Hỗ trợ 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar - Bottom of Hero */}
            <div className="relative z-10 mt-auto pt-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className="group relative bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all duration-300"
                            >
                                {/* Subtle gradient accent */}
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative text-center">
                                    <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// Features Section
// ============================================================================

const FEATURES = [
    {
        id: "coverage",
        icon: MapPin,
        title: "Phủ sóng rộng khắp",
        description: "Tiếp cận hàng ngàn tuyến đường kết nối các thành phố lớn trên khắp cả nước. Mạng lưới rộng khắp đảm bảo bạn có thể di chuyển đến bất cứ đâu một cách dễ dàng.",
    },
    {
        id: "security",
        icon: Shield,
        title: "Đặt vé an toàn",
        description: "Thanh toán của bạn được bảo vệ với mức độ bảo mật cấp ngân hàng. Chúng tôi sử dụng chứng chỉ SSL tiêu chuẩn và hợp tác với các nhà cung cấp thanh toán uy tín.",
    },
    {
        id: "confirmation",
        icon: Clock,
        title: "Xác nhận tức thì",
        description: "Nhận vé điện tử ngay sau khi đặt. Không cần xếp hàng, không cần vé giấy. Chỉ cần xuất trình vé điện tử trên điện thoại khi lên xe.",
    },
    {
        id: "payment",
        icon: CreditCard,
        title: "Thanh toán dễ dàng",
        description: "Nhiều phương thức thanh toán bao gồm VNPay, thẻ tín dụng, thẻ ghi nợ và chuyển khoản ngân hàng. Chọn phương thức phù hợp nhất với bạn.",
    },
    {
        id: "support",
        icon: Headphones,
        title: "Hỗ trợ 24/7",
        description: "Đội ngũ hỗ trợ khách hàng tận tâm luôn sẵn sàng suốt ngày đêm để giúp bạn với các vấn đề đặt vé, hoàn tiền, hoặc bất kỳ câu hỏi nào về chuyến đi.",
    },
    {
        id: "operators",
        icon: Bus,
        title: "Nhà xe hàng đầu",
        description: "Chúng tôi chỉ hợp tác với các nhà xe uy tín và được xác minh, nổi tiếng với lịch sử an toàn, xe thoải mái và dịch vụ xuất sắc.",
    },
] as const;

export function FeaturesSection() {
    return (
        <section className="py-16 lg:py-24 bg-muted/30" id="about">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left - Header */}
                    <div className="lg:sticky lg:top-24">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
                            Tại sao chọn BusGo?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Chúng tôi giúp việc đi xe khách trở nên đơn giản, an toàn và thú vị với nền tảng đặt vé hiện đại.
                        </p>
                        <div className="hidden lg:block">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <Bus className="size-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">100,000+ Hành khách</div>
                                    <div className="text-sm text-muted-foreground">Tin tưởng BusGo cho mọi chuyến đi</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Accordion */}
                    <div>
                        <Accordion type="single" collapsible className="w-full" defaultValue="coverage">
                            {FEATURES.map((feature) => (
                                <AccordionItem key={feature.id} value={feature.id} className="border-b border-border">
                                    <AccordionTrigger className="hover:no-underline py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <feature.icon className="size-5 text-primary" />
                                            </div>
                                            <span className="text-base font-semibold text-foreground text-left">
                                                {feature.title}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-14 text-muted-foreground">
                                        {feature.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// Popular Routes Section
// ============================================================================

const POPULAR_ROUTES = [
    { from: "Hà Nội", to: "TP. Hồ Chí Minh", price: "500K", duration: "30h" },
    { from: "Hà Nội", to: "Đà Nẵng", price: "350K", duration: "12h" },
    { from: "TP. HCM", to: "Nha Trang", price: "280K", duration: "8h" },
    { from: "Đà Nẵng", to: "Huế", price: "120K", duration: "2.5h" },
] as const;

export function PopularRoutesSection() {
    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-1">
                            Tuyến đường phổ biến
                        </h2>
                        <p className="text-muted-foreground">
                            Khám phá các tuyến đường được đặt nhiều nhất trên khắp Việt Nam
                        </p>
                    </div>
                    <Link href={ROUTES.SEARCH}>
                        <Button variant="outline" className="gap-2">
                            Xem tất cả
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>

                {/* Routes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {POPULAR_ROUTES.map((route) => (
                        <Link
                            key={`${route.from}-${route.to}`}
                            href={`/search?from=${route.from}&to=${route.to}`}
                            className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                        >
                            {/* Gradient header with icon */}
                            <div className="relative h-28 bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
                                <Bus className="size-10 text-primary/40 group-hover:text-primary/60 transition-colors" />
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
                                    <span>{route.from}</span>
                                    <ArrowRight className="size-4 text-primary" />
                                    <span>{route.to}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{route.duration}</span>
                                    <span className="text-primary font-semibold">Từ {route.price}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// How It Works Section
// ============================================================================

const STEPS = [
    {
        step: "1",
        icon: Search,
        title: "Tìm kiếm",
        description: "Nhập điểm đến và ngày đi",
    },
    {
        step: "2",
        icon: Ticket,
        title: "Chọn ghế",
        description: "Chọn xe và chỗ ngồi yêu thích",
    },
    {
        step: "3",
        icon: CreditCard,
        title: "Thanh toán",
        description: "Thanh toán an toàn qua VNPay",
    },
    {
        step: "4",
        icon: CheckCircle,
        title: "Lên đường",
        description: "Xuất trình vé điện tử và tận hưởng!",
    },
] as const;

export function HowItWorksSection() {
    return (
        <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
                        Cách thức hoạt động
                    </h2>
                    <p className="text-muted-foreground">
                        Đặt vé xe khách chỉ với 4 bước đơn giản
                    </p>
                </div>

                {/* Steps - Horizontal on desktop */}
                <div className="relative">
                    {/* Connector line - desktop only */}
                    <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-primary/20 via-primary/40 to-primary/20" />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                        {STEPS.map((step) => (
                            <div key={step.step} className="relative text-center">
                                {/* Step circle with icon */}
                                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-card border-2 border-primary/20 mb-4 mx-auto">
                                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                                        {step.step}
                                    </div>
                                    <step.icon className="size-8 text-primary" />
                                </div>
                                {/* Content */}
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// CTA Section
// ============================================================================

export function CTASection() {
    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-2xl overflow-hidden">
                    {/* Background with gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-emerald-600" />

                    {/* Decorative pattern */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                backgroundSize: '32px 32px'
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-center">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                            Sẵn sàng cho chuyến đi của bạn?
                        </h2>
                        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-6">
                            Tham gia cùng hàng ngàn hành khách hài lòng. Tạo tài khoản miễn phí và đặt chuyến đi đầu tiên ngay hôm nay.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href={ROUTES.REGISTER}>
                                <Button size="lg" variant="secondary" className="h-11 px-6">
                                    Bắt đầu miễn phí
                                    <ArrowRight className="size-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href={ROUTES.SEARCH}>
                                <Button size="lg" variant="outline" className="h-11 px-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
                                    Tìm chuyến xe
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

