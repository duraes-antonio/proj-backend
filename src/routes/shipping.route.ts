'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { shippingService } from '../services/shipping/shipping.service';
import { productRepository } from '../data/repository/product.repository';
import { Product } from '../domain/models/product';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const json = { ...req.query, itemsOrder: JSON.parse(req.query.itemsOrder) };
    try {
        const fnGetProd = (ids: string[]): Promise<Product[]> =>
          productRepository.find({
              currentPage: 1,
              perPage: 100,
              ids
          });
        const deliveryOptions = await shippingService.calcCostDaysOrder(json, fnGetProd);
        res.status(200).send(deliveryOptions);
    } catch (err) {
        res.status(500).send({ data: err.message });
    }
});

export { router as shippingRoutes };
