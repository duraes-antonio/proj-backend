'use strict';
import { tokenService as tokenS } from '../../services/token.service';
import { authService } from '../../services/auth.service';
import { NextFunction, Request, Response, Router } from 'express';
import { listSlideController as listSlideCtrl } from '../../controllers/lists/list-slide.controller';

const router = Router();

router.delete('/:id', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listSlideCtrl.delete(req, res, next)
);

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  listSlideCtrl.get(req, res, next)
);

router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  listSlideCtrl.getById(req, res, next)
);

router.post('/', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listSlideCtrl.post(req, res, next)
);

router.patch('/:id', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listSlideCtrl.patch(req, res, next)
);

export { router as listSlidesRoutes };
