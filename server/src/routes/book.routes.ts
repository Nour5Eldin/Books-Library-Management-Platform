import { Router } from "express";
import { createBook, deleteBook, getBooks, updateBook } from "../controllers/book.controller";
import { upload } from "../config/multer";

const router = Router();

router.get('/', getBooks);
router.post('/', upload.single('image'), createBook);
router.patch('/:id', upload.single('image'), updateBook);
router.delete('/:id', deleteBook);

export default router;