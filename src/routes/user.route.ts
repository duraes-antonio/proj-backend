'use strict';
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { tokenService } from '../services/token.service';
import { authService as authS } from '../services/auth.service';

const router = Router();

router.get('/', userController.get);
router.get('/search', userController.search);
router.get('/:id', userController.getById);
router.patch('/:id/roles', [tokenService.verify, authS.allowAdmin], userController.patchRoles);
router.patch('/:id', [tokenService.verify], userController.patch);
router.post('/', userController.post);

export { router as userRoutes };
