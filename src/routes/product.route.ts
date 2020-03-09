'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/tokenService';
import { productController as prodCtrl } from '../controllers/product.controller';


const router = Router();

if (process.env.NODE_ENV !== 'test') {
    router.delete('/:id', tokenS.verify, prodCtrl.delete);
    router.get('/', prodCtrl.get);
    router.get('/:id', prodCtrl.getById);
    router.post('/', tokenS.verify, prodCtrl.post);
    router.put('/:id', tokenS.verify, prodCtrl.put);
} else {
    router.delete('/:id', prodCtrl.delete);
    router.get('/', prodCtrl.get);
    router.get('/:id', prodCtrl.getById);
    router.post('/', prodCtrl.post);
    router.put('/:id', prodCtrl.put);
}
export { router as productRoutes };
