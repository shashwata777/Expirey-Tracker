import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, googleAuth, getMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Input validations
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validateRequest,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

const googleValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  validateRequest,
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/google', googleValidation, googleAuth);
router.get('/me', protect, getMe);

export default router;
