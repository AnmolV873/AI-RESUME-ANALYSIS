import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected route - test that auth middleware works
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;