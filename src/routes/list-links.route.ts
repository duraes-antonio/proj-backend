'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../services/token.service';
import { authService } from '../services/auth.service';
import { listLinkController } from '../controllers/list-link.controller';

const router = Router();

if (['test', 'test_dev'].indexOf(process.env.NODE_ENV ?? '') < 0) {
    router.delete('/:id', [tokenS.verify, authService.allowAdmin], listLinkController.delete);
    router.get('/', tokenS.verify, listLinkController.get);
    router.get('/:id', tokenS.verify, listLinkController.getById);
    router.post('/', [tokenS.verify, authService.allowAdmin], listLinkController.post);
    router.patch('/:id', [tokenS.verify, authService.allowAdmin], listLinkController.patch);
} else {
    router.delete('/:id', listLinkController.delete);
    router.get('/', listLinkController.get);
    router.get('/:id', listLinkController.getById);
    router.post('/', listLinkController.post);
    router.patch('/:id', listLinkController.patch);
}

export { router as listLinksRoutes };
