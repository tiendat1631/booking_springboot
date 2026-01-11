import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================================
// Container - Consistent max-width and padding
// ============================================================================

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
    variants: {
        size: {
            sm: "max-w-3xl",
            md: "max-w-5xl",
            lg: "max-w-7xl",
            full: "max-w-full",
        },
    },
    defaultVariants: {
        size: "lg",
    },
});

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> { }

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(containerVariants({ size, className }))}
            {...props}
        />
    )
);
Container.displayName = "Container";

// ============================================================================
// Section - Page sections with consistent spacing
// ============================================================================

const sectionVariants = cva("", {
    variants: {
        spacing: {
            none: "",
            sm: "py-8",
            md: "py-12",
            lg: "py-16",
            xl: "py-24",
        },
        background: {
            default: "",
            muted: "bg-muted/50",
            accent: "bg-accent",
            primary: "bg-primary text-primary-foreground",
        },
    },
    defaultVariants: {
        spacing: "md",
        background: "default",
    },
});

export interface SectionProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> { }

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, spacing, background, ...props }, ref) => (
        <section
            ref={ref}
            className={cn(sectionVariants({ spacing, background, className }))}
            {...props}
        />
    )
);
Section.displayName = "Section";

// ============================================================================
// PageHeader - Consistent page titles
// ============================================================================

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
    ({ title, description, children, className }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-col gap-4 pb-8 md:flex-row md:items-center md:justify-between",
                className
            )}
        >
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground">{description}</p>
                )}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
);
PageHeader.displayName = "PageHeader";

// ============================================================================
// Stack - Vertical/Horizontal spacing utility
// ============================================================================

const stackVariants = cva("flex", {
    variants: {
        direction: {
            row: "flex-row",
            column: "flex-col",
            rowReverse: "flex-row-reverse",
            columnReverse: "flex-col-reverse",
        },
        gap: {
            none: "gap-0",
            xs: "gap-1",
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6",
            xl: "gap-8",
        },
        align: {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
            baseline: "items-baseline",
        },
        justify: {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
            around: "justify-around",
            evenly: "justify-evenly",
        },
        wrap: {
            wrap: "flex-wrap",
            nowrap: "flex-nowrap",
            wrapReverse: "flex-wrap-reverse",
        },
    },
    defaultVariants: {
        direction: "column",
        gap: "md",
        align: "stretch",
        justify: "start",
        wrap: "nowrap",
    },
});

export interface StackProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> { }

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
    ({ className, direction, gap, align, justify, wrap, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                stackVariants({ direction, gap, align, justify, wrap, className })
            )}
            {...props}
        />
    )
);
Stack.displayName = "Stack";

// ============================================================================
// Grid - Responsive grid utility
// ============================================================================

const gridVariants = cva("grid", {
    variants: {
        cols: {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
            5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
            6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
        },
        gap: {
            none: "gap-0",
            xs: "gap-1",
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6",
            xl: "gap-8",
        },
    },
    defaultVariants: {
        cols: 3,
        gap: "md",
    },
});

export interface GridProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> { }

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, cols, gap, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(gridVariants({ cols, gap, className }))}
            {...props}
        />
    )
);
Grid.displayName = "Grid";

export { Container, Section, PageHeader, Stack, Grid };
