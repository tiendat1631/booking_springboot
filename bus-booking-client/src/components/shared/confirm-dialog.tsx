"use client";

import * as React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

// ============================================================================
// ConfirmDialog - Reusable confirmation dialog
// ============================================================================

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
}

function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "default",
    onConfirm,
    loading = false,
}: ConfirmDialogProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } finally {
            setIsLoading(false);
        }
    };

    const isPending = loading || isLoading;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isPending}
                        className={buttonVariants({
                            variant: variant === "destructive" ? "destructive" : "default",
                        })}
                    >
                        {isPending ? "Đang xử lý..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ============================================================================
// useConfirmDialog - Hook for easy dialog management
// ============================================================================

interface UseConfirmDialogOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
}

function useConfirmDialog(options: UseConfirmDialogOptions) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [onConfirm, setOnConfirm] = React.useState<(() => void | Promise<void>) | null>(null);

    const confirm = React.useCallback((callback: () => void | Promise<void>) => {
        setOnConfirm(() => callback);
        setIsOpen(true);
    }, []);

    const dialog = React.useMemo(
        () => (
            <ConfirmDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title={options.title}
                description={options.description}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                variant={options.variant}
                onConfirm={onConfirm || (() => { })}
            />
        ),
        [isOpen, onConfirm, options]
    );

    return { confirm, dialog };
}

export { ConfirmDialog, useConfirmDialog };
