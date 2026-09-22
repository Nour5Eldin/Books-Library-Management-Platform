export interface ApiValidationError {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: ApiValidationError[];
}