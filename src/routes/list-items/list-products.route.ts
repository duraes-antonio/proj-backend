'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { tokenService as tokenS } from '../../services/token.service';
import { authService } from '../../services/auth.service';
import { ListProductSchema } from '../../data/schemas/list-product.schema';
import { listController } from '../../controllers/lists/list.controller';

const router = Router();

router.delete(
  '/:id', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listController.delete(req, res, next, 'Lista de Produtos', ListProductSchema)
);

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  listController.get(req, res, next, 'Lista de Produtos', ListProductSchema)
);

router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  listController.getById(req, res, next, 'Lista de Produtos', ListProductSchema)
);

router.post(
  '/', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listController.post(req, res, next, 'Lista de Produtos', ListProductSchema)
);

router.patch(
  '/:id', [tokenS.verify, authService.allowAdmin],
  (req: Request, res: Response, next: NextFunction) =>
    listController.patch(req, res, next, 'Lista de Produtos', ListProductSchema)
);

export { router as listProductsRoutes };
