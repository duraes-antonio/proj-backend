'use strict';
import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.ts';
import { tokenService as tokenS } from '../services/tokenService.ts';

const router = Router();

if (process.env.NODE_ENV !== 'test') {
    router.delete('/:id', tokenS.verify, reviewController.delete);
    router.get('/', tokenS.verify, reviewController.get);
    router.post('/', tokenS.verify, reviewController.post);
    router.put('/:id', tokenS.verify, reviewController.put);
} else {
    router.delete('/:id', reviewController.delete);
    router.get('/', reviewController.get);
    router.post('/', reviewController.post);
    router.put('/:id', reviewController.put);
}


export { router as reviewRoutes };
