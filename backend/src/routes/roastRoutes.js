import express from 'express';
import multer from 'multer';
import { RoastController } from '../controllers/roastController.js';

const router = express.Router();

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, PNG, JPEG, or WEBP files are allowed.'));
    }
  }
});

// API Routes
router.post('/roast', upload.single('resumeFile'), RoastController.roastResume);
router.get('/roasts', RoastController.getRoasts);
router.get('/roasts/:id', RoastController.getRoastById);
router.get('/health', RoastController.healthCheck);

export default router;
