'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/token.service';
import { productController as prodCtrl } from '../controllers/product.controller';


const router = Router();

router.delete('/:id', tokenS.verify, prodCtrl.delete);
router.get('/', prodCtrl.get);
router.get('/:id', prodCtrl.getById);
router.post('/', tokenS.verify, prodCtrl.post);
router.put('/:id', tokenS.verify, prodCtrl.put);

export { router as productRoutes };
