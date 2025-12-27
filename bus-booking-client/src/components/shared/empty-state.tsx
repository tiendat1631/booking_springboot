import * as React from "react";
import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// EmptyState - When no data to display
// ============================================================================

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center gap-4 text-center",
                className
            )}
        >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                {icon || <FileQuestion className="h-10 w-10 text-muted-foreground" />}
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
                )}
            </div>
            {action && (
                <Button onClick={action.onClick} variant="outline">
                    {action.label}
                </Button>
            )}
        </div>
    );
}

// ============================================================================
// NoResults - Specific for search/filter with no results
// ============================================================================

interface NoResultsProps {
    query?: string;
    suggestion?: string;
    onReset?: () => void;
    className?: string;
}

function NoResults({ query, suggestion, onReset, className }: NoResultsProps) {
    return (
        <EmptyState
            title={query ? `Không tìm thấy kết quả cho "${query}"` : "Không có kết quả"}
            description={
                suggestion ||
                "Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc"
            }
            action={
                onReset
                    ? {
                        label: "Xóa bộ lọc",
                        onClick: onReset,
                    }
                    : undefined
            }
            className={className}
        />
    );
}

export { EmptyState, NoResults };
