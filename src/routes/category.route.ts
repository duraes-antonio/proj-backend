'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/tokenService';
import { categoryController as catCtrl } from '../controllers/category.controller';
import { authService } from '../services/auth.service';

const router = Router();

if (['test', 'test_dev'].indexOf(process.env.NODE_ENV ?? '') < 0) {
    router.delete('/:id', [tokenS.verify, authService.allowAdmin], catCtrl.delete);
    router.get('/', tokenS.verify, catCtrl.get);
    router.get('/:id', tokenS.verify, catCtrl.getById);
    router.post('/', [tokenS.verify, authService.allowAdmin], catCtrl.post);
    router.patch('/:id', [tokenS.verify, authService.allowAdmin], catCtrl.patch);
} else {
    router.delete('/:id', catCtrl.delete);
    router.get('/', catCtrl.get);
    router.get('/:id', catCtrl.getById);
    router.post('/', catCtrl.post);
    router.patch('/:id', catCtrl.patch);
}

export { router as categoryRoutes };
