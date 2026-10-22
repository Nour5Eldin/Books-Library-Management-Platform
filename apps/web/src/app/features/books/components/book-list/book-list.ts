import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.html',
})
export class BookList {
  @Input({ required: true }) books: Book[] = [];
  @Input() loading = false;
  @Input() deletingBookId: string | null = null;

  @Output() edit = new EventEmitter<Book>();
  @Output() delete = new EventEmitter<Book>();
}