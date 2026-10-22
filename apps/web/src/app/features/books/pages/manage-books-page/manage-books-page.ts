import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookList } from '../../components/book-list/book-list';
import { BookForm } from '../../components/book-form/book-form';
import type { Book, CreateBookForm, UpdateBookForm, UpdateBookRequest, } from '../../models/book.model';
import { BookService } from '../../../../services/book.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, Subject, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../models/api-error.model';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-manage-books-page',
  standalone: true,
  imports: [FormsModule, BookList, BookForm, Pagination],
  templateUrl: './manage-books-page.html',
})
export class ManageBooksPage implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly bookService = inject(BookService);
  private readonly searchSubject = new Subject<string>();
  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const apiError = error.error as ApiErrorResponse | undefined;

      if (apiError?.errors?.length) {
        return apiError.errors
          .map((item) => `${item.field}: ${item.message}`)
          .join(' ');
      }

      if (apiError?.message) {
        return apiError.message;
      }
    }

    return fallback;
  }

  books = signal<Book[]>([]);
  loading = signal(false);
  searchTerm = '';
  editingBook: Book | null = null;
  errorMessage = signal('');
  saving = signal(false);
  deletingBookId = signal<string | null>(null);
  deleteCandidate = signal<Book | null>(null);
  serverErrors = signal<Record<string, string>>({});
  formResetTrigger = signal(0);

  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalItems = 0;

  ngOnInit(): void {
    this.setupSearch();

    this.fetchBooks();
  }
  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),

        switchMap((search) => {
          this.loading.set(true);
          this.errorMessage.set('');

          return this.bookService
            .getBooks(1, this.pageSize, search)
            .pipe(
              catchError((error) => {
                this.errorMessage.set(
                  this.getErrorMessage(
                    error,
                    'Could not load books. Please try again.',
                  ),
                );

                return of({
                  success: false,
                  data: [],
                  pagination: {
                    page: 1,
                    limit: this.pageSize,
                    totalItems: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                  },
                });
              }),

              finalize(() => {
                this.loading.set(false);
              }),
            );
        }),
      )
      .subscribe((response) => {
        this.books.set(response.data);
        this.totalPages = response.pagination.totalPages;
        this.totalItems = response.pagination.totalItems;
        this.currentPage = 1;
        this.cdr.markForCheck();
      });
  }

  fetchBooks(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.bookService
      .getBooks(
        this.currentPage,
        this.pageSize,
        this.searchTerm.trim(),
      )
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.books.set(response.data);
          this.totalPages = response.pagination.totalPages;
          this.totalItems = response.pagination.totalItems;
          this.cdr.markForCheck();
        },

        error: () => {
          this.errorMessage.set(
            'Could not load books. Is the backend running?',
          );
          this.cdr.markForCheck();
        },
      });
  }
  goToPage(page: number): void {
  if (page < 1 || page > this.totalPages || page === this.currentPage) {
    return;
  }

  this.currentPage = page;
  this.fetchBooks();
  }
  
  onSearch(): void {
    this.searchTerm = this.searchTerm.trim();
    this.currentPage = 1;
    this.fetchBooks();
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }
  onEdit(book: Book): void {
    this.editingBook = book;
    this.cdr.markForCheck();
  }

  onCancelEdit(): void {
    this.editingBook = null;
    this.cdr.markForCheck();
  }

  onDelete(book: Book): void {
    if (!book._id || this.deletingBookId()) {
      return;
    }

    this.deleteCandidate.set(book);
    this.cdr.markForCheck();
  }

  cancelDelete(): void {
    this.deleteCandidate.set(null);
  }

  confirmDelete(): void {
    const book = this.deleteCandidate();

    if (!book?._id || this.deletingBookId()) {
      return;
    }

    this.deleteCandidate.set(null);
    this.deletingBookId.set(book._id);
    this.errorMessage.set('');

    this.bookService
      .deleteBook(book._id)
      .pipe(
        finalize(() => {
          this.deletingBookId.set(null);
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.books.update((books) =>
            books.filter((item) => item._id !== book._id)
          );
        },

        error: () => {
          this.errorMessage.set(
            'Could not delete the book. Please try again.',
          );
        },
      });
  }

  onSave(data: CreateBookForm | UpdateBookForm): void {
  if (this.saving()) {
    return;
  }

  this.saving.set(true);
  this.errorMessage.set('');
  this.serverErrors.set({});

  const isEditing = !!this.editingBook?._id;

  const request = isEditing
    ? this.bookService.updateBook(
        this.editingBook!._id,
        {
          title: data.title,
          author: data.author,
          category: data.category,
          price: data.price,
          stock: data.stock,
        },
        'image' in data ? data.image : undefined,
      )
    : this.bookService.createBook(data as CreateBookForm);

  request
    .pipe(
      finalize(() => {
        this.saving.set(false);
        this.cdr.markForCheck();
      }),
    )
    .subscribe({
      next: (response) => {
        if (response.data) {
          if (isEditing) {
            this.books.update((books) =>
              books.map((book) =>
                book._id === response.data._id
                  ? response.data
                  : book
              )
            );
          } else {
            this.books.update((books) => [response.data, ...books]);
            this.formResetTrigger.update((value) => value + 1);
          }
        }

        this.editingBook = null;
        this.cdr.markForCheck();
      },

      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          const apiError = error.error as ApiErrorResponse | undefined;

          if (apiError?.errors?.length) {
            const fieldErrors: Record<string, string> = {};

            for (const item of apiError.errors) {
              fieldErrors[item.field] = item.message;
            }

            this.serverErrors.set(fieldErrors);
          }
        }

        this.errorMessage.set(
          this.getErrorMessage(
            error,
            isEditing
              ? 'Could not update the book. Please try again.'
              : 'Could not create the book. Please try again.',
          ),
        );
        this.cdr.markForCheck();
      },
    });
}
}