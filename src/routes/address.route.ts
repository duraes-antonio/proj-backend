'use strict';
import { Router } from 'express';
import { addressController } from '../controllers/address.controller';

const router = Router();

router.delete('/:id', addressController.delete);
router.get('/', addressController.get);
router.get('/:id', addressController.getById);
router.post('/', addressController.post);
router.put('/:id', addressController.put);

export { router as addressRoutes };
