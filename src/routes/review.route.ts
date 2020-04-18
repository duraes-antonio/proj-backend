'use strict';
import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { tokenService as tokenS } from '../services/token.service';

const router = Router();

router.delete('/:id', tokenS.verify, reviewController.delete);
router.get('/', reviewController.get);
router.post('/', tokenS.verify, reviewController.post);
router.put('/:id', tokenS.verify, reviewController.patch);


export { router as reviewRoutes };
