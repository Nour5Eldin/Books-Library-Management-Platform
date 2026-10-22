import { model, Schema } from "mongoose";

export interface IBook {
    title: string;
    author: string;
    category: string;
    price: number;
    stock: number;
    image: {
        url: string;
        path: string;
    };
}

const bookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        author: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: 'Stock must be an integer',
            },
        },
        image: {
            url: {
                type: String,
                required: false,
            },
            path: {
                type: String,
                required: false,
            }
        }
    }, {
    timestamps: true,
},
);

export const Book = model<IBook>('Book', bookSchema);