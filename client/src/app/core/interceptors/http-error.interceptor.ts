import { HttpErrorResponse, HttpInterceptorFn, } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { ApiErrorResponse } from '../../features/books/models/api-error.model';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const apiError = error.error as ApiErrorResponse | undefined;

            console.error('HTTP Error', {
                status: error.status,
                message: apiError?.message || error.message,
                errors: apiError?.errors,
            });

            return throwError(() => error);
        }),
    );
};