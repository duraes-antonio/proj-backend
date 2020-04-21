'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { tokenService as tokenS } from '../../services/token.service';
import { authService as authS } from '../../services/auth.service';
import { LinkAdd } from '../../domain/models/link';
import { LinkSchema } from '../../data/schemas/link.schema';
import { linkService } from '../../services/link.service';
import { builderGenericController as buildCtrl } from '../../controllers/base/builder-generic-controller';

const router = Router();
const entityName = 'Link';

router.delete(
  '/:id', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.delete(req, res, next, LinkSchema, entityName)
);

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  buildCtrl.get(req, res, next, LinkSchema, entityName)
);

router.post(
  '/', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.post(req, res, next, LinkSchema, linkService.validate)
);

router.patch(
  '/:id', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.patch(
      req, res, next, LinkSchema,
      (data: LinkAdd) => linkService.validate(data, true),
      entityName, ['title', 'url']
    )
);

export { router as linkRoutes };
