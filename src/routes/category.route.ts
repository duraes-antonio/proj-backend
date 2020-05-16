'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/token.service';
import { categoryController as catCtrl } from '../controllers/category.controller';
import { authService } from '../services/auth.service';

const router = Router();

router.delete('/:id', [tokenS.verify, authService.allowAdmin], catCtrl.delete);
router.get('/', catCtrl.get);
router.get('/count', catCtrl.getCount);
router.get('/search', catCtrl.getFilter);
router.get('/:id', catCtrl.getById);
router.post('/', [tokenS.verify, authService.allowAdmin], catCtrl.post);
router.patch('/:id', [tokenS.verify, authService.allowAdmin], catCtrl.patch);

export { router as categoryRoutes };
