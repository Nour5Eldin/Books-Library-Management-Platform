import { z } from 'zod';

const bookFields = {
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(200, 'Title must be 200 characters or less'),

    author: z
        .string()
        .trim()
        .min(1, 'Author is required')
        .max(200, 'Author must be 200 characters or less'),

    category: z
        .string()
        .trim()
        .min(1, 'Category is required')
        .max(100, 'Category must be 100 characters or less'),

    price: z
        .coerce
        .number()
        .nonnegative('Price cannot be negative'),

    stock: z
        .coerce
        .number()
        .int('Stock must be a non-negative integer')
        .nonnegative('Stock must be a non-negative integer'),
};

export const createBookSchema = z.object(bookFields);

export const updateBookSchema = z
    .object(bookFields)
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: 'At least one field is required for update',
        }
    );

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;