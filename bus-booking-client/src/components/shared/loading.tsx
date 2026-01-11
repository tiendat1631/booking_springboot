import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ============================================================================
// LoadingSpinner
// ============================================================================

const spinnerVariants = cva("animate-spin text-muted-foreground", {
    variants: {
        size: {
            sm: "h-4 w-4",
            md: "h-6 w-6",
            lg: "h-8 w-8",
            xl: "h-12 w-12",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

export interface LoadingSpinnerProps
    extends React.HTMLAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> { }

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
    ({ className, size, ...props }, ref) => (
        <Loader2
            ref={ref}
            className={cn(spinnerVariants({ size, className }))}
            {...props}
        />
    )
);
LoadingSpinner.displayName = "LoadingSpinner";

// ============================================================================
// LoadingOverlay - Full page/container loading
// ============================================================================

interface LoadingOverlayProps {
    message?: string;
    className?: string;
}

function LoadingOverlay({ message = "Đang tải...", className }: LoadingOverlayProps) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center gap-4",
                className
            )}
        >
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

// ============================================================================
// LoadingDots - Inline loading indicator
// ============================================================================

function LoadingDots({ className }: { className?: string }) {
    return (
        <span className={cn("inline-flex items-center gap-1", className)}>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
        </span>
    );
}

export { LoadingSpinner, LoadingOverlay, LoadingDots };
