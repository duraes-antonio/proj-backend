'use strict';
import { Request, Response, Router } from 'express';
import { Customer, paymentService } from '../services/payment.service';
import { User } from '../domain/models/user';
import { tokenService } from '../services/token.service';
import { responseFunctions } from '../controllers/base/response.functions';

const router = Router();

router.post('/paypal', async (req: Request, res: Response) => {
    try {
        const user: User = tokenService.decodeFromReq(req);
        const codeTransaction = await paymentService.payWithPaypal(user, req.body);
        res.send({ data: codeTransaction });
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
});

router.post(
  '/paypal/notifications',
  async (req: Request, res: Response) => {
      try {
          console.log(req.body);
          await paymentService.updateStatusPaypal(req.body.resource.custom_id);
          return responseFunctions.success(res);
      } catch (e) {
          return res.status(e.code).send(e.message);
      }
  });

router.post('/pag-seguro', async (req: Request, res: Response) => {
    try {
        const user: User = tokenService.decodeFromReq(req);
        const customer: Customer = {
            ...user,
            name: 'Nome Válido',
            email: user.email.split('@')[0] + '@sandbox.pagseguro.com.br'
        };
        const codeTransaction = await paymentService.payWithPagSeguro(customer, req.body);
        res.send({ data: codeTransaction });
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
});

router.post(
  '/pag-seguro/notifications',
  async (req: Request, res: Response) => {
      try {
          await paymentService.updateStatusPagSeguro(req.body.notificationCode);
          return responseFunctions.success(res);
      } catch (e) {
          return res.status(e.code).send(e.message);
      }
  });

export { router as paymentRoutes };
