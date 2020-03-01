'use strict';
import { Router } from 'express';
import { addressController } from '../controllers/address.controller';
import { tokenService } from '../services/tokenService';

const router = Router();

router.delete('/:id', tokenService.verify, addressController.delete);
router.get('/', tokenService.verify, addressController.get);
router.get('/:id', tokenService.verify, addressController.getById);
router.post('/', tokenService.verify, addressController.post);
router.put('/:id', tokenService.verify, addressController.put);

export { router as addressRoutes };
