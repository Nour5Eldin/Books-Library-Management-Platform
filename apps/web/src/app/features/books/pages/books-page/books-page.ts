import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import type { Book } from '../../models/book.model';
import { BookService } from '../../../../services/book.service';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [FormsModule, Pagination],
  templateUrl: './books-page.html',
})

export class BooksPage implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly cdr = inject(ChangeDetectorRef);

  books = signal<Book[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchTerm = '';

  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalItems = 0;

  ngOnInit(): void {
    this.fetchBooks();
  }

  searchBooks(): void {
    this.currentPage = 1;
    this.fetchBooks();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchBooks();
  }
  goToPage(page: number): void {
  if (
    page < 1 ||
    page > this.totalPages ||
    page === this.currentPage
  ) {
    return;
  }

  this.currentPage = page;
  this.fetchBooks();
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
        },

        error: () => {
          this.errorMessage.set(
            'Could not load books. Is the backend running?',
          );
        },
      });
  }
}