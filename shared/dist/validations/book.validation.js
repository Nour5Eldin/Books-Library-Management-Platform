"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
const bookFields = {
    title: zod_1.z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(200, 'Title must be 200 characters or less'),
    author: zod_1.z
        .string()
        .trim()
        .min(1, 'Author is required')
        .max(200, 'Author must be 200 characters or less'),
    category: zod_1.z
        .string()
        .trim()
        .min(1, 'Category is required')
        .max(100, 'Category must be 100 characters or less'),
    price: zod_1.z
        .coerce
        .number()
        .nonnegative('Price cannot be negative'),
    stock: zod_1.z
        .coerce
        .number()
        .int('Stock must be a non-negative integer')
        .nonnegative('Stock must be a non-negative integer'),
};
exports.createBookSchema = zod_1.z.object(bookFields);
exports.updateBookSchema = zod_1.z
    .object(bookFields)
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
});
//# sourceMappingURL=book.validation.js.map