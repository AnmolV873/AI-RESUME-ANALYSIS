import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { createMatch, getHistory, getMatch } from './matching.controller.js';

const router = Router();

router.use(protect);

router.post('/', createMatch);
router.get('/history', getHistory);
router.get('/:id', getMatch);

export default router;