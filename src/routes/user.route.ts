'use strict';
import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

// router.get('/', userController.);
router.post('/', userController.post);

export { router as userRoutes };
