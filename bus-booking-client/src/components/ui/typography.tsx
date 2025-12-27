import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================================
// Text - Typography component for consistent text styling
// ============================================================================

const textVariants = cva("", {
    variants: {
        variant: {
            // Headings
            h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
            h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
            h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
            h4: "scroll-m-20 text-xl font-semibold tracking-tight",
            // Body
            p: "leading-7",
            lead: "text-xl text-muted-foreground",
            large: "text-lg font-semibold",
            small: "text-sm font-medium leading-none",
            muted: "text-sm text-muted-foreground",
            // Special
            blockquote: "mt-6 border-l-2 pl-6 italic",
            code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        },
        align: {
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
        },
        weight: {
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
        },
        textColor: {
            default: "",
            muted: "text-muted-foreground",
            primary: "text-primary",
            destructive: "text-destructive",
            success: "text-green-600 dark:text-green-400",
            warning: "text-yellow-600 dark:text-yellow-400",
        },
    },
    defaultVariants: {
        variant: "p",
        align: "left",
        textColor: "default",
    },
});

type TextElement = "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote" | "code";

export interface TextProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
    as?: TextElement;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
    ({ className, variant, align, weight, textColor, as, ...props }, ref) => {
        // Determine the element to render
        let Comp: TextElement = "p";
        if (as) {
            Comp = as;
        } else if (variant) {
            const headingMatch = variant.match(/^h[1-4]$/);
            if (headingMatch) {
                Comp = variant as TextElement;
            } else if (variant === "blockquote") {
                Comp = "blockquote";
            } else if (variant === "code") {
                Comp = "code";
            }
        }

        return React.createElement(Comp, {
            ref,
            className: cn(textVariants({ variant, align, weight, textColor, className })),
            ...props,
        });
    }
);
Text.displayName = "Text";

// ============================================================================
// Heading - Semantic headings
// ============================================================================

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ level = 2, className, ...props }, ref) => {
        const variants: Record<number, VariantProps<typeof textVariants>["variant"]> = {
            1: "h1",
            2: "h2",
            3: "h3",
            4: "h4",
        };
        const Comp = `h${level}` as "h1" | "h2" | "h3" | "h4";

        return (
            <Comp
                ref={ref}
                className={cn(textVariants({ variant: variants[level] }), className)}
                {...props}
            />
        );
    }
);
Heading.displayName = "Heading";

export { Text, Heading, textVariants };
