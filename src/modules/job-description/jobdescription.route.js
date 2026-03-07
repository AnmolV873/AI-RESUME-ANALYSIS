import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { create, getAll, getOne, update, remove } from './jobdescription.controller.js';

const router = Router();

router.use(protect);

router.post('/add', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;