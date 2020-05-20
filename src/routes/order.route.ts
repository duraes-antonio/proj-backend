'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { OrderSchema } from '../data/schemas/order.schema';
import { orderService } from '../services/order.service';
import { responseFunctions } from '../controllers/base/response.functions';
import { controllerFunctions, extractFilter } from '../controllers/base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { Order } from '../domain/models/order';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    controllerFunctions.get<Order>(
      req, res, next, (filter) =>
        repoFunc.find(OrderSchema, filter, undefined, undefined,
          {
              path: 'items addressTarget',
              populate: {
                  path: 'product',
                  populate: {
                      path: 'categories'
                  }
              }
          })
    );
});

router.get('/purchased', async (req: Request, res: Response) => {
      try {
          const purchasedProduct = await orderService.productPurchased(req.query.productId, req.query.userId);
          return responseFunctions.success(res, purchasedProduct);
      } catch (e) {
          return res.status(e.code).send(e.message);
      }
  }
);

router.get('/search', async (req: Request, res: Response) => {
      try {
          const purchasedProduct = await orderService.search(extractFilter(req));
          return responseFunctions.success(res, purchasedProduct);
      } catch (e) {
          return res.status(e.code).send(e.message);
      }
  }
);

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const order = await orderService.findById(req.params.id);
        return responseFunctions.success(res, order);
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
});

export { router as orderRoutes };
