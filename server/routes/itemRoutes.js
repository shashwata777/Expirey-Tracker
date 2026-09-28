import express from 'express';
import { body } from 'express-validator';
import {
  getItems,
  getStats,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  testUpload,
  testEmail,
} from '../controllers/itemController.js';
import { extractDocument, testGemini } from '../controllers/extractionController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Apply auth protection to all item routes
router.use(protect);

// Stats route (must be before /:id)
router.get('/stats', getStats);

// Temporary verification routes (remove before deploying to production)
router.get('/test-gemini', testGemini);
router.post('/test-upload', upload.single('file'), testUpload);
router.post('/test-email', testEmail);

// Extraction endpoint (multipart upload)
router.post('/extract', upload.single('file'), extractDocument);

// Item collection routes
router
  .route('/')
  .get(getItems)
  .post(
    upload.single('file'),
    [
      body('productName').trim().notEmpty().withMessage('Product or document name is required'),
      validateRequest,
    ],
    createItem
  );

// Single item routes
router
  .route('/:id')
  .get(getItemById)
  .put(upload.single('file'), updateItem)
  .delete(deleteItem);

export default router;
