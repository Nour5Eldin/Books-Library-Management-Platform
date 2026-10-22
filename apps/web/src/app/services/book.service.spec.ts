import { TestBed } from '@angular/core/testing';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { BookService } from './book.service';

describe('BookService', () => {
    let service: BookService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BookService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(BookService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should fetch books', () => {
        const mockResponse = {
            success: true,
            data: [],
        };

        service.getBooks().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const request = httpTesting.expectOne(
            'http://localhost:5000/api/books',
        );

        expect(request.request.method).toBe('GET');

        request.flush(mockResponse);
    });
});