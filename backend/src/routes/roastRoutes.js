import express from 'express';
import multer from 'multer';

import { RoastController } from '../controllers/roastController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error('Only PDF, JPG, PNG, and WebP files are allowed.')
      );
    }

    cb(null, true);
  }
});

router.get(
  '/health',
  RoastController.healthCheck
);

router.post(
  '/roast',
  authenticate,
  upload.single('resumeFile'),
  RoastController.roastResume
);

router.get(
  '/roasts',
  authenticate,
  RoastController.getRoasts
);

router.get(
  '/roasts/:id',
  authenticate,
  RoastController.getRoastById
);

export default router;