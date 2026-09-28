import express from 'express';
import {
  updateProfile,
  updatePassword,
  updatePreferences,
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/preferences', updatePreferences);

export default router;
