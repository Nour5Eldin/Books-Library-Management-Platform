export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  stock: number;
  image: {
    url: string;
    path: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BooksResponse {
  success: boolean;
  data: Book[];
  pagination: Pagination;
}

export interface BookResponse {
  success: boolean;
  data: Book;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  category: string;
  price: number;
  stock: number;
}
export interface CreateBookForm {
  title: string;
  author: string;
  category: string;
  price: number;
  stock: number;
  image: File;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  category?: string;
  price?: number;
  stock?: number;
}

export interface UpdateBookForm {
  title?: string;
  author?: string;
  category?: string;
  price?: number;
  stock?: number;
  image?: File;
}