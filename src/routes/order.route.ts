'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { builderGenericController as buildCtrl } from '../controllers/base/builder-generic-controller';
import { OrderSchema } from '../data/schemas/order.schema';
import { orderService } from '../services/order.service';
import { OrderInput } from '../domain/models/order';

const router = Router();
const entityName = 'Order';

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  buildCtrl.get(req, res, next, OrderSchema, entityName)
);

router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  buildCtrl.getById(req, res, next, OrderSchema, entityName)
);

router.patch('/:id', (req: Request, res: Response, next: NextFunction) =>
  buildCtrl.patch(
    req, res, next, OrderSchema,
    (order: OrderInput) => orderService.validate(order, true),
    entityName, ['paymentStatus', 'transactionId'])
);

export { router as orderRoutes };
