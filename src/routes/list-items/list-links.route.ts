'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { tokenService as tokenS } from '../../services/token.service';
import { authService } from '../../services/auth.service';
import { listController } from '../../controllers/lists/list.controller';
import { ListLinkSchema } from '../../data/schemas/list-link.schema';

const router = Router();

router.delete(
  '/:id', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listController.delete(req, res, next, 'Lista de Links', ListLinkSchema)
);
router.get(
  '/', tokenS.verify,
  (req: Request, res: Response, next: NextFunction) =>
    listController.get(req, res, next, 'Lista de Links', ListLinkSchema)
);
router.get(
  '/:id', tokenS.verify,
  (req: Request, res: Response, next: NextFunction) =>
    listController.getById(req, res, next, 'Lista de Links', ListLinkSchema)
);
router.post(
  '/', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listController.post(req, res, next, 'Lista de Links', ListLinkSchema)
);
router.patch(
  '/:id', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listController.patch(req, res, next, 'Lista de Links', ListLinkSchema)
);

export { router as listLinksRoutes };
