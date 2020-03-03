'use strict';
import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.post('/', userController.post);
router.put('/:id', userController.put);

export { router as userRoutes };
