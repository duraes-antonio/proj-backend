'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/token.service';
import { authService } from '../services/auth.service';
import { listLinkController } from '../controllers/list-link.controller';

const router = Router();

router.delete('/:id', [tokenS.verify, authService.allowAdmin], listLinkController.delete);
router.get('/', tokenS.verify, listLinkController.get);
router.get('/:id', tokenS.verify, listLinkController.getById);
router.post('/', [tokenS.verify, authService.allowAdmin], listLinkController.post);
router.patch('/:id', [tokenS.verify, authService.allowAdmin], listLinkController.patch);

export { router as listLinksRoutes };
