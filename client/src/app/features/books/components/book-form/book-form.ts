import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, } from '@angular/forms';
import type { Book, CreateBookForm, CreateBookRequest, UpdateBookForm, UpdateBookRequest } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
})
export class BookForm implements OnChanges {
  private readonly fb = inject(FormBuilder);
  @Input() editingBook: Book | null = null;
  @Input() saving = false;
  @Input() serverErrors: Record<string, string> = {};
  @Output() save = new EventEmitter<CreateBookForm | UpdateBookForm>();
  @Output() cancel = new EventEmitter<void>();
  @Input() resetTrigger = 0;
  submitted = false;
  selectedImage: File | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    author: ['', [Validators.required, Validators.maxLength(200)]],
    category: ['', [Validators.required, Validators.maxLength(100)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
  });
  get isEditMode(): boolean {
    return !!this.editingBook?._id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.resetForm();
      return;
    }

    if (!changes['editingBook']) {
      return;
    }

    if (this.editingBook) {
      this.form.patchValue({
        title: this.editingBook.title,
        author: this.editingBook.author,
        category: this.editingBook.category,
        price: this.editingBook.price,
        stock: this.editingBook.stock,
      });

      return;
    }

    this.resetForm();
  }

  submit(): void {
    if (this.saving) {
      return;
    }
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.price === null || value.stock === null) {
      return;
    }

    if (!this.isEditMode && !this.selectedImage) {
      return;
    }

    if (this.isEditMode) {
      const data: UpdateBookForm = {
        title: value.title.trim(),
        author: value.author.trim(),
        category: value.category.trim(),
        price: value.price,
        stock: value.stock,
      };

      if (this.selectedImage) {
        data.image = this.selectedImage;
      }

      this.save.emit(data);
      return;
    }

    const data: CreateBookForm = {
      title: value.title.trim(),
      author: value.author.trim(),
      category: value.category.trim(),
      price: value.price,
      stock: value.stock,
      image: this.selectedImage!,
    };

    this.save.emit(data);
  }

  resetForm(): void {
    this.selectedImage = null;

    this.form.reset({
      title: '',
      author: '',
      category: '',
      price: null,
      stock: null,
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.submitted = false;
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedImage = file;
  }
}