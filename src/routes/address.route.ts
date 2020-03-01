'use strict';
import { Router } from 'express';
import { addressController } from '../controllers/address.controller';
import { tokenService as tokenS } from '../services/tokenService';

const router = Router();

router.delete('/:id', tokenS.verify, addressController.delete);
router.get('/', tokenS.verify, addressController.get);
router.get('/:id', tokenS.verify, addressController.getById);
router.post('/', tokenS.verify, addressController.post);
router.put('/:id', tokenS.verify, addressController.put);

export { router as addressRoutes };
