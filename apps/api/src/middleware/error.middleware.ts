import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (
    error, _req, res, _next,
) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });

        return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            success: false,
            message: 'Database validation failed',
            errors: Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });

        return;
    }

    if (error instanceof mongoose.Error.CastError) {
        res.status(400).json({
            success: false,
            message: 'Invalid book ID',
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: 'Internal server error',
    })
};