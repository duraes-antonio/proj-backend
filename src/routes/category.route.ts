'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/tokenService';
import { categoryController as catCtrl } from '../controllers/category.controller';

const router = Router();

if (process.env.NODE_ENV !== 'test') {
    router.delete('/:id', tokenS.verify, catCtrl.delete);
    router.get('/', tokenS.verify, catCtrl.get);
    router.get('/:id', tokenS.verify, catCtrl.getById);
    router.post('/', tokenS.verify, catCtrl.post);
    router.put('/:id', tokenS.verify, catCtrl.put);
} else {
    router.delete('/:id', catCtrl.delete);
    router.get('/', catCtrl.get);
    router.get('/:id', catCtrl.getById);
    router.post('/', catCtrl.post);
    router.put('/:id', catCtrl.put);
}

export { router as categoryRoutes };
