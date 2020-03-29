'use strict';
import { Request, Response, Router } from 'express';
import { paymentService } from '../services/payment.service';

const router = Router();

router.post(
  '/paypal',
  (req: Request, res: Response) => {
      res.send(paymentService.payItemsPaypal(req.body));
  });


export { router as paymentRoutes };
