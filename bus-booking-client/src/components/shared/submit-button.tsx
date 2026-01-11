"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

// ============================================================================
// SubmitButton - For Server Actions forms
// ============================================================================

export interface SubmitButtonProps extends ButtonProps {
    pendingText?: string;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
    ({ children, pendingText = "Đang xử lý...", disabled, ...props }, ref) => {
        const { pending } = useFormStatus();

        return (
            <Button ref={ref} type="submit" disabled={pending || disabled} {...props}>
                {pending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {pendingText}
                    </>
                ) : (
                    children
                )}
            </Button>
        );
    }
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
