'use strict';
import { Router } from 'express';
import { authController as authCtrl } from '../controllers/auth.controller';
import { tokenService as tokenS } from '../services/tokenService';

const router = Router();

router.post('/authenticate', authCtrl.authenticate);
router.post('/signout', tokenS.verify, authCtrl.invalidateToken);
router.post('/refresh', tokenS.verify, authCtrl.refreshToken);

export { router as authRoutes };
