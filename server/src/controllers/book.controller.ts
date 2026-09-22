import type { Request, Response } from 'express';
import { Book } from '../models/book.model';
import { createBookSchema, updateBookSchema } from '../validators/book.validator';
import { deleteBookCover, uploadBookCover } from '../services/storage.service';
import path from 'path/win32';

export const getBooks = async (
    req: Request, res: Response
): Promise<void> => {
    const search = req.query.search;
    const pageParam = Number(req.query.page);
    const limitParam = Number(req.query.limit);

    const page =
        Number.isInteger(pageParam) && pageParam > 0
            ? pageParam
            : 1;

    const limit =
        Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 100
            ? limitParam
            : 20;
    const filter = typeof search === 'string' && search.trim() ? {
        $or: [
            {
                title: {
                    $regex: search.trim(),
                    $options: 'i',
                },
            },
            {
                author: {
                    $regex: search.trim(),
                    $options: 'i',
                },
            },
            {
                category: {
                    $regex: search.trim(),
                    $options: 'i',
                },
            },
        ],
    } : {};

    const totalItems = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const skip = (page - 1) * limit;

    const books = await Book.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        data: books,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    });
};

export const createBook = async (
    req: Request, res: Response,
): Promise<void> => {
    const validatedData = createBookSchema.parse(req.body);

    if (!req.file) {
        res.status(400).json({
            success: false,
            message: 'Book cover image is required',
        });
        return;
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    const filePath = `books/${crypto.randomUUID()}${extension}`;

    const image = await uploadBookCover(req.file, filePath);

    try {
        const book = await Book.create({
            ...validatedData,
            image,
        });

        res.status(201).json({
            success: true,
            data: book,
        });
    } catch (error) {
        await deleteBookCover(image.path);
        throw error;
    }
};

export const updateBook = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const validatedData = updateBookSchema.parse(req.body);

    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404).json({
            success: false,
            message: 'Book not found',
        });
        return;
    }

    // No new image: update book data only
    if (!req.file) {
        Object.assign(book, validatedData);

        await book.save();

        res.status(200).json({
            success: true,
            data: book,
        });

        return;
    }

    // New image provided
    const extension = path.extname(req.file.originalname).toLowerCase();
    const newFilePath = `books/${crypto.randomUUID()}${extension}`;

    const newImage = await uploadBookCover(
        req.file,
        newFilePath,
    );

    try {
        const oldImagePath = book.image?.path;

        Object.assign(book, validatedData);
        book.image = newImage;

        await book.save();

        if (oldImagePath) {
            await deleteBookCover(oldImagePath);
        }

        res.status(200).json({
            success: true,
            data: book,
        });
    } catch (error) {
        await deleteBookCover(newImage.path);

        throw error;
    }
};

export const deleteBook = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404).json({
            success: false,
            message: 'Book not found',
        });
        return;
    }

    if (book.image?.path) {
        await deleteBookCover(book.image.path);
    }

    await book.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Book deleted successfully',
    });
};
