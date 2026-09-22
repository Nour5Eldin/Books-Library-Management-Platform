# BookNest

BookNest is a full-stack library management application built with Angular, Node.js, Express, TypeScript, MongoDB, and Supabase Storage.

The application allows users to browse the available books and provides a dedicated management interface for creating, editing, searching, and deleting books.

Book cover images are uploaded through the backend and stored securely in Supabase Storage.

---

# Features

## Book Browsing

* Display the complete book collection.
* Responsive four-column grid on large screens.
* Responsive layout across different screen sizes.
* Display book cover, title, author, category, price, and stock.
* Loading state while retrieving books.
* Empty state when no books are available.
* API error handling.

## Book Search

Books can be searched by:

* Title
* Author
* Category

Search can be executed by:

* Pressing `Enter`
* Clicking the search icon

When the search input is cleared and the search is executed, the complete book collection is displayed again.

## Book Management

The management page provides:

* Add a new book
* Edit an existing book
* Delete a book
* Upload a book cover image
* Replace an existing book cover
* Delete confirmation modal
* Loading states during operations
* Server validation error handling
* Form validation
* Image type and size validation
* Search and filtering
* Responsive layout

## Book Cover Storage

Book cover images are stored using Supabase Storage.

The backend is responsible for:

* Receiving uploaded images.
* Validating the uploaded file.
* Uploading the file to Supabase Storage.
* Generating the corresponding public image URL.
* Saving the image URL with the book document.
* Replacing an existing image when a book cover is updated.
* Removing the previous image when required.

---

# Technology Stack

## Frontend

* Angular 22
* TypeScript
* RxJS
* Tailwind CSS
* Angular Router
* Angular Forms

## Backend

* Node.js
* Express 5
* TypeScript
* MongoDB
* Mongoose
* Zod
* Multer
* Helmet
* CORS
* dotenv

## Storage

* Supabase Storage
* `@supabase/supabase-js`

Supabase Storage is used exclusively for book cover image storage.

The Angular application does not communicate directly with Supabase using the server secret key.

All storage operations are performed through the Express backend.

## Architecture

The project uses an npm workspace structure consisting of:

```text
Client
   ↓
Angular application
   ↓
REST API
   ↓
Express server
   ├── MongoDB / Mongoose
   │
   └── Supabase Storage
           ↓
       book-covers
```

The application separates book data from binary file storage:

```text
Book metadata
     ↓
MongoDB Atlas

Book cover image
     ↓
Supabase Storage
```

MongoDB stores the book information and the URL associated with its cover image.

Supabase Storage stores the actual image file.

A shared validation package is used between the project workspaces.

---

# Requirements

Before running BookNest, install:

* Node.js
* npm
* MongoDB Atlas account
* Supabase account

No global Angular CLI installation is required because Angular CLI is installed as a project dependency.

---

# Project Setup

After extracting or cloning the project, open a terminal in the project root:

```bash
npm install
```

The project uses npm workspaces, so running `npm install` from the root installs the dependencies required by the client and server workspaces.

---

# MongoDB Atlas Configuration

BookNest requires MongoDB to store the book collection.

The delivered project does not contain database credentials.

The client should create their own MongoDB Atlas database and provide the connection string through the server environment configuration.

## 1. Create a MongoDB Atlas Account

Create an account on MongoDB Atlas.

## 2. Create a Project

Create a new project for the BookNest application.

## 3. Create a Cluster

Create a MongoDB cluster.

A standard development cluster is sufficient for local development.

## 4. Create a Database User

Open:

```text
Database Access
```

Create a database user with the required database permissions.

Keep the username and password secure.

## 5. Configure Network Access

Open:

```text
Network Access
```

Add the IP address from which the backend will connect to MongoDB Atlas.

For development purposes, MongoDB Atlas can be configured to allow access from any IP address, but restricting access to known IP addresses is recommended for production environments.

## 6. Get the MongoDB Connection String

In MongoDB Atlas:

```text
Database
→ Connect
→ Drivers
```

Copy the generated connection string.

---

# Supabase Storage Configuration

BookNest uses Supabase Storage for book cover images.

The backend communicates with Supabase using server-side credentials.

The Supabase credentials must never be exposed to the Angular application or committed to source control.

## 1. Create a Supabase Project

Create a new project in Supabase for the BookNest application.

## 2. Create the `book-covers` Bucket

Open:

```text
Storage
```

Create a storage bucket named:

```text
book-covers
```

The bucket is used exclusively for storing book cover images.

## 3. Bucket Configuration

The `book-covers` bucket should be configured according to the application's image requirements.

Supported image formats:

```text
JPEG
PNG
WebP
```

Maximum file size:

```text
2 MB
```

The backend validates uploaded files before sending them to Supabase Storage.

## 4. Storage Access

Book cover uploads are performed by the Express backend.

The Angular client sends the image to the backend through the Book API.

The backend then uploads the file to Supabase Storage.

The Supabase server secret must remain on the backend.

```text
Angular Client
      ↓
POST /api/books
      ↓
Express Backend
      ↓
Storage Service
      ↓
Supabase Storage
      ↓
book-covers
```

---

# Environment Configuration

The backend contains an example environment file:

```text
server/.env.example
```

Create the actual environment file:

```text
server/.env
```

Add:

```env
MONGODB_URI=your_mongodb_connection_string

PORT=5000

SUPABASE_URL=your_supabase_project_url

SUPABASE_SECRET_KEY=your_supabase_secret_key
```

Replace:

```text
your_mongodb_connection_string
```

with the MongoDB Atlas connection string.

Replace:

```text
your_supabase_project_url
```

with the URL of the Supabase project.

Replace:

```text
your_supabase_secret_key
```

with the server-side Supabase secret key.

## Important

The `.env` file contains sensitive configuration and should never be committed to source control or shared publicly.

In particular:

```text
SUPABASE_SECRET_KEY
```

must never be exposed to the Angular frontend.

It must only be available to the backend.

---

# Book Cover Upload Rules

Book cover uploads are validated by the backend before being stored.

## Supported Formats

The following image formats are supported:

```text
JPEG
PNG
WebP
```

## Maximum File Size

The maximum allowed image size is:

```text
2 MB
```

Files larger than 2 MB are rejected.

## Upload Validation

The upload layer validates:

1. File existence.
2. MIME type.
3. Supported image format.
4. Maximum file size.

Invalid files are rejected before being uploaded to Supabase Storage.

This prevents unsupported or unnecessarily large files from reaching the storage layer.

---

# Storage Architecture

The application uses a small storage abstraction instead of placing Supabase-specific logic directly inside the book controller.

```text
HTTP Request
     ↓
Book Controller
     ↓
Multer
     ↓
Storage Service
     ↓
Supabase Client
     ↓
Supabase Storage
```

The responsibilities are separated as follows:

```text
multer.ts
    ↓
Receive and validate multipart file

supabase.ts
    ↓
Create/configure Supabase client

storage.service.ts
    ↓
Handle upload/storage operations

book.controller.ts
    ↓
Coordinate book creation/update and storage
```

This keeps the controller focused on application operations while storage-specific logic remains isolated.

---

# Storage Files

## `server/src/middleware/multer.ts`

Handles incoming multipart/form-data uploads.

Responsibilities include:

* Receiving uploaded files.
* Restricting uploads to supported image types.
* Enforcing the 2 MB file size limit.
* Rejecting invalid files before storage processing.

Supported image types:

```text
image/jpeg
image/png
image/webp
```

Maximum file size:

```text
2 MB
```

Multer is responsible for handling the incoming file before the application passes it to the storage service.

---

## `server/src/config/supabase.ts`

Creates and exports the server-side Supabase client.

Responsibilities include:

* Reading `SUPABASE_URL`.
* Reading `SUPABASE_SECRET_KEY`.
* Creating the Supabase client.
* Providing the configured client to storage-related services.

The Supabase secret key is server-side only.

It must not be imported into Angular code or exposed through frontend environment files.

---

## `server/src/services/storage.service.ts`

Provides the application's storage abstraction.

Responsibilities include:

* Uploading book cover images.
* Generating storage paths.
* Retrieving the public URL for an uploaded image.
* Removing existing book cover files when required.
* Encapsulating Supabase Storage implementation details.

The book controller should interact with the storage service rather than directly calling the Supabase SDK for every storage operation.

This keeps the application easier to maintain if the storage provider or storage strategy changes in the future.

---

# Book Cover Storage Structure

Book covers are stored inside the Supabase bucket:

```text
book-covers
```

The storage path should uniquely identify each uploaded image.

A typical structure is:

```text
book-covers/
    <book-id>/
        <unique-file-name>
```

This keeps files associated with their corresponding book while allowing multiple versions of a cover to be managed without relying on the original filename.

The application should avoid using user-provided filenames directly as the storage path.

---

# Development

From the project root, run:

```bash
npm run dev
```

This starts both the Angular frontend and the Express backend.

## Frontend

```text
http://localhost:4200
```

## Backend

```text
http://localhost:5000
```

## Books API

```text
http://localhost:5000/api/books
```

---

# Application Routes

The Angular application currently contains the following routes:

| Route           | Purpose                             |
| --------------- | ----------------------------------- |
| `/books`        | Browse the book collection          |
| `/manage-books` | Add, edit, search, and delete books |
| `/`             | Redirects to `/books`               |
| Unknown routes  | Redirect to `/books`                |

---

# API

The backend exposes the following REST endpoints.

## Get Books

```http
GET /api/books
```

Returns all books.

---

## Search Books

```http
GET /api/books?search=clean
```

Searches books using the provided search term.

The backend handles the search request and returns matching books.

---

## Create Book

```http
POST /api/books
```

Creates a new book.

The endpoint accepts `multipart/form-data` when a book cover is included.

Example fields:

```text
title
author
category
price
stock
cover
```

Example book data:

```text
title: Clean Code
author: Robert C. Martin
category: Technology
price: 650
stock: 10
cover: <image file>
```

When a cover image is provided:

```text
Client
   ↓
POST /api/books
   ↓
Multer
   ↓
Image validation
   ↓
Storage Service
   ↓
Supabase Storage
   ↓
Image URL
   ↓
MongoDB Book Document
```

The stored book document contains the resulting cover URL rather than the binary image itself.

---

## Update Book

```http
PATCH /api/books/:id
```

Updates an existing book.

The endpoint accepts `multipart/form-data` when a new book cover is provided.

Example fields:

```text
title
author
category
price
stock
cover
```

When a new cover is uploaded, the backend can:

1. Validate the new image.
2. Upload the new image to Supabase Storage.
3. Update the book document with the new cover URL.
4. Remove the previous cover when appropriate.

If no new cover is provided, the existing cover remains unchanged.

---

## Delete Book

```http
DELETE /api/books/:id
```

Deletes an existing book.

When a book is deleted, its associated cover file should also be removed from Supabase Storage when applicable.

This prevents unused files from accumulating in the storage bucket.

---

# Production Configuration

The Angular application has separate environment configurations for development and production.

## Development

File:

```text
client/src/environments/environment.development.ts
```

This environment is configured to communicate with the local backend:

```text
http://localhost:5000/api
```

## Production

File:

```text
client/src/environments/environment.ts
```

Before creating a production build, replace the production API URL with the URL of the deployed backend.

Example:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-domain.com/api',
};
```

The actual production API domain should be provided after deploying the backend.

Supabase credentials should remain configured only on the backend.

They should not be added to:

```text
client/src/environments/
```

---

# Production Build

From the project root:

```bash
npm run build
```

The root build command runs both workspace builds:

```text
Angular Client

      ↓

client/dist/client


Express Server

      ↓

server/dist
```

The generated `dist` directories are build output and are not included in the delivered source package.

---

# Production Start

After creating the production build:

```bash
npm start
```

The root `start` script starts the compiled Express server.

The Express application is configured to:

1. Serve the Angular production files from:

```text
client/dist/client
```

2. Handle Angular client-side routes through the Angular `index.html`.

3. Serve the REST API under:

```text
/api/books
```

4. Communicate with MongoDB Atlas.

5. Communicate with Supabase Storage for book cover operations.

Therefore, after deployment, the Express server can serve both the Angular application and the API while the backend communicates with the external storage and database services.

---

# Production Architecture

The production application follows this structure:

```text
                         User Browser
                              │
                              ▼
                     Express Server
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
       Angular Application             /api/books
                                            │
                              ┌─────────────┴─────────────┐
                              │                           │
                              ▼                           ▼
                       MongoDB Atlas              Supabase Storage
                                                       │
                                                       ▼
                                                  book-covers
```

The frontend does not connect directly to MongoDB.

The frontend also does not use the Supabase secret key.

All database communication is handled by the backend.

All protected storage operations are handled by the backend.

---

# Architecture Decisions

## 1. MongoDB for Book Metadata

MongoDB is responsible for storing structured book information such as:

* Title
* Author
* Category
* Price
* Stock
* Cover URL

The database does not store the binary image itself.

This keeps book documents lightweight and separates structured application data from file storage.

---

## 2. Supabase Storage for Book Covers

Supabase Storage is used for binary book cover files.

This avoids storing images directly inside MongoDB and provides a dedicated storage layer for uploaded assets.

The application stores the resulting image URL in the book document.

```text
Image File
   ↓
Supabase Storage

Image URL
   ↓
MongoDB
```

---

## 3. Backend-Controlled Uploads

The Angular client does not upload directly to Supabase.

Instead:

```text
Angular
   ↓
Express API
   ↓
Multer
   ↓
Storage Service
   ↓
Supabase
```

This centralizes validation and storage behavior in the backend.

It also prevents the Supabase server secret from being exposed to the browser.

---

## 4. Dedicated Storage Service

Supabase operations are isolated inside:

```text
storage.service.ts
```

The controller coordinates the application operation without becoming tightly coupled to the Supabase SDK.

This makes the storage implementation easier to replace or extend later.

---

## 5. Server-Side File Validation

Image validation is performed before storage.

The application only accepts:

```text
JPEG
PNG
WebP
```

with a maximum size of:

```text
2 MB
```

This prevents unsupported files and oversized uploads from entering the storage layer.

---

## 6. Shared Validation

Book data validation is maintained through the shared validation package.

The application separates:

```text
Book data validation
```

from:

```text
File upload validation
```

Zod handles structured book data while Multer handles incoming file constraints.

---

## 7. Storage and Database Separation

The application intentionally keeps database records and binary files in separate systems.

MongoDB is responsible for:

```text
Book metadata
```

Supabase Storage is responsible for:

```text
Book cover files
```

This separation makes each system responsible for the type of data it is designed to manage.

---

# Project Structure

```text
booknest/

│
├── client/
│   │
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   │
│   │   ├── app/
│   │   │   │
│   │   │   ├── core/
│   │   │   │   └── interceptors/
│   │   │   │       └── http-error.interceptor.ts
│   │   │   │
│   │   │   ├── features/
│   │   │   │   └── books/
│   │   │   │       │
│   │   │   │       ├── components/
│   │   │   │       │   │
│   │   │   │       │   ├── book-form/
│   │   │   │       │   │   ├── book-form.ts
│   │   │   │       │   │   ├── book-form.html
│   │   │   │       │   │   ├── book-form.css
│   │   │   │       │   │   └── book-form.spec.ts
│   │   │   │       │   │
│   │   │   │       │   └── book-list/
│   │   │   │       │       ├── book-list.ts
│   │   │   │       │       ├── book-list.html
│   │   │   │       │       ├── book-list.css
│   │   │   │       │       └── book-list.spec.ts
│   │   │   │       │
│   │   │   │       ├── models/
│   │   │   │       │   ├── api-error.model.ts
│   │   │   │       │   └── book.model.ts
│   │   │   │       │
│   │   │   │       └── pages/
│   │   │   │           │
│   │   │   │           ├── books-page/
│   │   │   │           │   ├── books-page.ts
│   │   │   │           │   ├── books-page.html
│   │   │   │           │   ├── books-page.css
│   │   │   │           │   └── books-page.spec.ts
│   │   │   │           │
│   │   │   │           └── manage-books-page/
│   │   │   │               ├── manage-books-page.ts
│   │   │   │               ├── manage-books-page.html
│   │   │   │               ├── manage-books-page.css
│   │   │   │               └── manage-books-page.spec.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── book.service.ts
│   │   │   │   └── book.service.spec.ts
│   │   │   │
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── app.ts
│   │   │   ├── app.html
│   │   │   └── app.css
│   │   │
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.development.ts
│   │   │
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   │
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   ├── .postcssrc.json
│   ├── .prettierrc
│   ├── .editorconfig
│   ├── .gitignore
│   └── README.md
│
├── server/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── supabase.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── book.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts
│   │   │   └── multer.ts
│   │   │
│   │   ├── models/
│   │   │   └── book.model.ts
│   │   │
│   │   ├── routes/
│   │   │   └── book.routes.ts
│   │   │
│   │   ├── services/
│   │   │   └── storage.service.ts
│   │   │
│   │   ├── validators/
│   │   │   └── book.validator.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   │
│   ├── validations/
│   │   └── book.validation.ts
│   │
│   └── package.json
│
├── .gitignore
├── package.json
└── package-lock.json
```

---

# Frontend Structure

## `client/src/app/core`

Contains application-wide functionality that is not specific to the books feature.

### `interceptors/http-error.interceptor.ts`

Handles HTTP errors at the Angular HTTP layer.

---

## `client/src/app/features/books`

Contains functionality related to books.

### `components/book-form`

Responsible for the book creation and editing form.

Files:

* `book-form.ts` — component logic
* `book-form.html` — form template
* `book-form.css` — component-specific styles
* `book-form.spec.ts` — component tests

The form supports book cover selection when creating or editing a book.

### `components/book-list`

Responsible for displaying the collection of books and book actions.

Files:

* `book-list.ts` — component logic
* `book-list.html` — list template
* `book-list.css` — component-specific styles
* `book-list.spec.ts` — component tests

### `models`

Contains frontend TypeScript models.

* `book.model.ts` — Book data model
* `api-error.model.ts` — API error model

### `pages/books-page`

The public-facing page used to browse the book collection.

### `pages/manage-books-page`

The management page used to:

* Add books
* Edit books
* Delete books
* Search books
* Upload book covers

---

## `client/src/app/services`

### `book.service.ts`

Provides the Angular client with the API operations required to communicate with the backend.

It is responsible for book-related HTTP requests, including multipart requests when a book cover is uploaded.

### `book.service.spec.ts`

Contains tests for the book service.

---

## `client/src/environments`

Contains Angular environment configurations.

* `environment.development.ts` — local development configuration
* `environment.ts` — production configuration

Supabase secret credentials must not be stored in these files.

---

# Backend Structure

## `server/src/config`

### `database.ts`

Contains the MongoDB connection configuration.

### `supabase.ts`

Creates the server-side Supabase client using:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
```

This module is server-only and must never be imported into frontend code.

---

## `server/src/controllers`

### `book.controller.ts`

Contains the business logic for book API operations:

* Get books
* Create book
* Update book
* Delete book
* Process book cover uploads
* Associate stored cover URLs with books

The controller coordinates storage operations through `storage.service.ts`.

---

## `server/src/models`

### `book.model.ts`

Defines the Mongoose model used to represent books in MongoDB.

The book document contains the book metadata and the stored cover URL when a cover is available.

---

## `server/src/routes`

### `book.routes.ts`

Defines the REST API routes:

```text
GET     /api/books

POST    /api/books

PATCH   /api/books/:id

DELETE  /api/books/:id
```

Create and update routes support multipart form submissions when a book cover is included.

---

## `server/src/validators`

### `book.validator.ts`

Handles server-side validation for book data using the shared validation schema.

Structured book fields are validated independently from uploaded file constraints.

---

## `server/src/middleware`

### `error.middleware.ts`

Provides centralized backend error handling.

### `multer.ts`

Handles multipart file uploads for book covers.

It validates:

* File type
* File size
* Uploaded file presence when required

Supported MIME types:

```text
image/jpeg
image/png
image/webp
```

Maximum file size:

```text
2 MB
```

---

## `server/src/services`

### `storage.service.ts`

Encapsulates Supabase Storage operations.

Responsibilities include:

* Uploading book covers.
* Generating storage paths.
* Returning stored image URLs.
* Removing previous cover files when required.
* Keeping Supabase-specific implementation details outside the controller.

---

## `server/src/app.ts`

Creates and configures the Express application.

Responsibilities include:

* Security headers through Helmet
* CORS
* JSON request parsing
* Book API routes
* Angular production static files
* Angular client-side route fallback
* Error middleware

---

## `server/src/server.ts`

Application entry point.

Responsibilities include:

1. Loading environment variables.
2. Connecting to MongoDB.
3. Initializing the application.
4. Starting the Express server.

Supabase configuration is loaded by the server-side storage configuration.

---

# Shared Package

## `shared/validations/book.validation.ts`

Contains the shared Zod validation schema for book data.

This allows validation rules to be maintained separately from the frontend and backend application code.

The shared validation package handles structured book fields.

File upload validation remains in the backend upload layer because binary file handling is an HTTP/storage concern rather than a book-data schema concern.

## `shared/package.json`

Defines the shared workspace package and its Zod dependency.

---

# Root Workspace

## `package.json`

Defines the BookNest npm workspace and root-level scripts.

Available commands:

```bash
npm run dev

npm run build

npm start
```

## `package-lock.json`

Locks the installed dependency versions for reproducible npm installations.

## `.gitignore`

Prevents sensitive files, generated files, dependencies, logs, and operating-system files from being included in source control.

---

# Troubleshooting

## MongoDB connection error

Check:

1. `server/.env` exists.
2. `MONGODB_URI` is correct.
3. The MongoDB Atlas database user exists.
4. The database user's password is correct.
5. The current IP address is allowed in MongoDB Atlas Network Access.

---

## Supabase connection error

Check:

1. `server/.env` exists.
2. `SUPABASE_URL` is correct.
3. `SUPABASE_SECRET_KEY` is correct.
4. The backend process has access to the environment variables.
5. The Supabase project is active.
6. The `book-covers` bucket exists.

Restart the backend after changing environment variables.

---

## Supabase bucket not found

Verify that the storage bucket is named exactly:

```text
book-covers
```

The bucket name used by the backend must match the Supabase Storage bucket name.

---

## Book cover upload fails

Check:

1. The selected file is JPEG, PNG, or WebP.
2. The file size does not exceed 2 MB.
3. `SUPABASE_URL` is configured correctly.
4. `SUPABASE_SECRET_KEY` is configured correctly.
5. The `book-covers` bucket exists.
6. The backend is running with the latest environment configuration.

If the request is rejected before reaching Supabase, inspect the backend response for Multer validation errors.

---

## Invalid image type

Only the following image formats are supported:

```text
JPEG
PNG
WebP
```

Other file types are rejected by the upload middleware.

---

## Image exceeds the 2 MB limit

Book covers are limited to:

```text
2 MB
```

Reduce the image size and upload it again.

---

## Cover uploads successfully but the image cannot be displayed

Verify:

1. The cover URL stored in MongoDB is valid.
2. The `book-covers` bucket configuration allows the application to access the stored file as intended.
3. The generated storage URL points to the correct Supabase project.
4. The file exists inside the `book-covers` bucket.
5. The frontend receives the cover URL correctly from the API.

---

## Existing cover is not replaced

Check:

1. The update request is being sent as `multipart/form-data`.
2. The uploaded file is reaching the backend.
3. `storage.service.ts` is being called during the update operation.
4. The new cover URL is saved to the MongoDB book document.
5. The previous storage object is handled correctly after the new file is uploaded.

---

## Supabase secret exposed in frontend

The `SUPABASE_SECRET_KEY` must never be placed inside:

```text
client/src/environments/
```

or any Angular source file.

The correct architecture is:

```text
Angular
   ↓
Express API
   ↓
Supabase
```

The secret remains on the server.

If the secret has accidentally been committed or exposed, it should be rotated immediately in Supabase and replaced in the backend environment configuration.

---

## Frontend cannot connect to the API

For local development, verify that the backend is running on:

```text
http://localhost:5000
```

and that the development environment uses:

```text
http://localhost:5000/api
```

For production, verify that:

```text
client/src/environments/environment.ts
```

contains the correct deployed backend URL.

---

## Port 4200 is already in use

Stop the existing Angular development server before running the application again.

---

## Port 5000 is already in use

Stop the process using port 5000 or change the backend `PORT` environment variable.

---

# Delivery Notes

The source package intentionally does not include:

* `node_modules`
* Angular build output
* Server build output
* `.env` files containing credentials
* local VS Code configuration
* local Angular cache
* `.DS_Store` files

These files are either generated automatically, environment-specific, or contain local configuration.

The client should run:

```bash
npm install
```

after receiving the project to install the required dependencies.

The client must also create their own:

```text
server/.env
```

and provide their own MongoDB Atlas and Supabase configuration.

---

# Recommended Setup Order

For a new environment, follow this order:

```text
1. Install Node.js

        ↓

2. Extract / clone BookNest

        ↓

3. Run npm install

        ↓

4. Create MongoDB Atlas database

        ↓

5. Create Supabase project

        ↓

6. Create book-covers bucket

        ↓

7. Create server/.env

        ↓

8. Add MONGODB_URI

        ↓

9. Add SUPABASE_URL

        ↓

10. Add SUPABASE_SECRET_KEY

        ↓

11. Run npm run dev

        ↓

12. Open http://localhost:4200
```

For production:

```text
1. Deploy backend

        ↓

2. Configure production MongoDB credentials

        ↓

3. Configure production Supabase credentials

        ↓

4. Verify book-covers bucket

        ↓

5. Update Angular production API URL

        ↓

6. Run npm run build

        ↓

7. Start the production server
```

---

# Storage Request Flow

## Create Book With Cover

```text
Angular Book Form
       │
       │ multipart/form-data
       ▼
POST /api/books
       │
       ▼
Multer
       │
       ├── Validate MIME type
       └── Validate 2 MB limit
       │
       ▼
Book Validator
       │
       ▼
Book Controller
       │
       ▼
Storage Service
       │
       ▼
Supabase Storage
       │
       ▼
book-covers/<book-id>/<file>
       │
       ▼
Cover URL
       │
       ▼
MongoDB
       │
       ▼
Book Document
```

## Update Book With New Cover

```text
Angular Book Form
       │
       ▼
PATCH /api/books/:id
       │
       ▼
Multer
       │
       ▼
Validate Image
       │
       ▼
Storage Service
       │
       ├── Upload new cover
       │
       └── Handle previous cover
       │
       ▼
Supabase Storage
       │
       ▼
New Cover URL
       │
       ▼
MongoDB
       │
       ▼
Updated Book
```

This keeps the upload lifecycle explicit and separates HTTP handling, validation, storage, and database responsibilities.
