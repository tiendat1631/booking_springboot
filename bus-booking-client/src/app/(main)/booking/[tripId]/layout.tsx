export default function BookingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="pt-20 min-h-screen bg-muted/10">
            {children}
        </div>
    );
}
