'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { tokenService as tokenS } from '../../services/token.service';
import { authService as authS } from '../../services/auth.service';
import { MarketSchema } from '../../data/schemas/list-items/market.schema';
import { marketService } from '../../services/list-items/market.service';
import { builderGenericController as buildCtrl } from '../../controllers/base/builder-generic-controller';
import { MarketAdd } from '../../domain/models/lists-item/market';

const router = Router();
const entityName = 'Market';

router.delete(
  '/:id', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.delete(req, res, next, MarketSchema, entityName)
);

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  buildCtrl.get(req, res, next, MarketSchema, entityName)
);

router.post(
  '/', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.post(req, res, next, MarketSchema, marketService.validate)
);

router.patch(
  '/:id', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.patch(
      req, res, next, MarketSchema,
      (data: MarketAdd) => marketService.validate(data, true),
      entityName, ['avatarUrl', 'backgroundUrl', 'index', 'name', 'url']
    )
);

export { router as marketRoutes };
