'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/token.service';
import { productController as prodCtrl } from '../controllers/product.controller';
import { authService } from '../services/auth.service';

/* eslint-disable @typescript-eslint/no-var-requires */
const router = Router();
const multer = require('multer');
const upload = multer({ dest: 'temp/' });

router.delete('/:id', [tokenS.verify, authService.allowAdmin], prodCtrl.delete);
router.get('/', prodCtrl.get);
router.get('/count', prodCtrl.getCount);
router.get('/search', prodCtrl.getFilter);
router.get('/:id', prodCtrl.getById);
router.post('/', [tokenS.verify, authService.allowAdmin], prodCtrl.post);
router.post(
  '/image-temp',
  [upload.single('image'), tokenS.verify, authService.allowAdmin],
  prodCtrl.postImageTemp
);
router.patch('/:id', [tokenS.verify, authService.allowAdmin], prodCtrl.patch);

export { router as productRoutes };
