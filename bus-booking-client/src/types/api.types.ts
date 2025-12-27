// Discriminated Union for API Response - avoids TypeScript warnings on null data
export type ApiResponse<T> =
    | {
        success: true;
        message: string;
        data: T;
        timestamp: string;
    }
    | {
        success: false;
        message: string;
        data: null;
        errorCode?: string;
        timestamp: string;
    };

// Paginated response from backend
export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
}

// Server Action result - discriminated union
export type ActionResult<T = void> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: string;
        fieldErrors?: Record<string, string[]>;
    };

// Helper type guards
export function isApiSuccess<T>(
    response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } {
    return response.success === true;
}

export function isActionSuccess<T>(
    result: ActionResult<T>
): result is { success: true; data: T } {
    return result.success === true;
}
