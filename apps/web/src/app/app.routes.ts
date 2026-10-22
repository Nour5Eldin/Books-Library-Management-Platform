import { Routes } from '@angular/router';
import { BooksPage } from './features/books/pages/books-page/books-page';
import { ManageBooksPage } from './features/books/pages/manage-books-page/manage-books-page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'books',
        pathMatch: 'full',
    },
    {
        path: 'books',
        component: BooksPage,
    },
    {
        path: 'manage-books',
        component: ManageBooksPage,
    },
    {
        path: '**',
        redirectTo: 'books',
    },
];
