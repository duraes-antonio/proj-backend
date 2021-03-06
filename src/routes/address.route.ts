'use strict';
import { Router } from 'express';
import { addressController } from '../controllers/address.controller';
import { tokenService as tokenS } from '../services/token.service';

const router = Router();

router.delete('/:id', tokenS.verify, addressController.delete);
router.get('/', tokenS.verify, addressController.get);
router.get('/:id', tokenS.verify, addressController.getById);
router.patch('/:id', tokenS.verify, addressController.patch);
router.post('/', tokenS.verify, addressController.post);

export { router as addressRoutes };
