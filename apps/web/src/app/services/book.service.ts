import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookResponse, BooksResponse, CreateBookForm, CreateBookRequest, UpdateBookRequest } from "../features/books/models/book.model";
import { environment } from "../../environments/environment";
@Injectable({
    providedIn: 'root'
})
export class BookService {
    private readonly apiUrl = `${environment.apiUrl}/books`;
    constructor(private readonly http: HttpClient) { }

    getBooks(page = 1, limit = 20, search = ''): Observable<BooksResponse> {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        if (search.trim()) {
            params.set('search', search.trim());
        }
        return this.http.get<BooksResponse>(
            `${this.apiUrl}?${params.toString()}`
        );
    }

    createBook(data: CreateBookForm): Observable<BookResponse> {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('author', data.author);
        formData.append('category', data.category);
        formData.append('price', data.price.toString());
        formData.append('stock', data.stock.toString());
        formData.append('image', data.image);

        return this.http.post<BookResponse>(this.apiUrl, formData);
    }

    updateBook(id: string, data: UpdateBookRequest, image?: File,): Observable<BookResponse> {
        if (!image) {
            return this.http.patch<BookResponse>(
                `${this.apiUrl}/${id}`,
                data,
            );
        }

        const formData = new FormData();

        if (data.title !== undefined) {
            formData.append('title', data.title);
        }

        if (data.author !== undefined) {
            formData.append('author', data.author);
        }

        if (data.category !== undefined) {
            formData.append('category', data.category);
        }

        if (data.price !== undefined) {
            formData.append('price', data.price.toString());
        }

        if (data.stock !== undefined) {
            formData.append('stock', data.stock.toString());
        }

        formData.append('image', image);

        return this.http.patch<BookResponse>(
            `${this.apiUrl}/${id}`,
            formData,
        );
    }

    deleteBook(id: string): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`,);
    };

};