'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/token.service';
import { productController as prodCtrl } from '../controllers/product.controller';
import { authService } from '../services/auth.service';

const router = Router();

router.delete('/:id', [tokenS.verify, authService.allowAdmin], prodCtrl.delete);
router.get('/', prodCtrl.get);
router.get('/:id', prodCtrl.getById);
router.post('/', [tokenS.verify, authService.allowAdmin], prodCtrl.post);
router.patch('/:id', [tokenS.verify, authService.allowAdmin], prodCtrl.patch);

export { router as productRoutes };
