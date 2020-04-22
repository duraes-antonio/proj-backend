'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { tokenService as tokenS } from '../../services/token.service';
import { authService as authS } from '../../services/auth.service';
import { SlideAdd } from '../../domain/models/lists-item/slide';
import { SlideSchema } from '../../data/schemas/list-items/slide.schema';
import { slideService } from '../../services/list-items/slide.service';
import { builderGenericController as buildCtrl } from '../../controllers/base/builder-generic-controller';

const router = Router();
const entityName = 'Slide';

router.delete(
  '/:id', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.delete(req, res, next, SlideSchema, entityName)
);

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  buildCtrl.get(req, res, next, SlideSchema, entityName)
);

router.post(
  '/', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.post(req, res, next, SlideSchema, slideService.validate)
);

router.patch(
  '/:id', [tokenS.verify, authS.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    buildCtrl.patch(
      req, res, next, SlideSchema,
      (data: SlideAdd) => slideService.validate(data, true),
      entityName,
      ['btnTitle', 'desc', 'imageUrl', 'index', 'title', 'url']
    )
);

export { router as slideRoutes };
