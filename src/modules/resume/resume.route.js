import { Router } from 'express';
import { upload as uploadMiddleware } from '../../middleware/upload.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';
import { upload, getMyResumes, getResume } from './resume.controller.js';

const router = Router();

// All resume routes require login
router.use(protect);

router.post('/upload', uploadMiddleware.single('resume'), upload);
router.get('/', getMyResumes);
router.get('/:id', getResume);

export default router;