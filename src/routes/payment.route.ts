'use strict';
import { Request, Response, Router } from 'express';
import { Customer, paymentService } from '../services/payment.service';
import { User } from '../domain/models/user';
import { tokenService } from '../services/token.service';
import { responseFunctions } from '../controllers/base/response.functions';

const router = Router();

router.post('/paypal', async (req: Request, res: Response) => {
    res.send(await paymentService.payWithPaypal(req.body));
});

router.post('/mercado-pago', async (req: Request, res: Response) => {
    res.send(await paymentService.payWithMercadoPago());
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
        throw e;
    }
});

router.post(
  '/pag-seguro/notifications',
  async (req: Request, res: Response) => {
      console.log(req, 'REQ');
      console.log(req.query, 'QUERY');
      console.log(req.params, 'PARAM');
      console.log(req.body, 'BODY');
      console.log(req.url, 'URL');
      console.log(req.route, 'ROUTE');
      console.log(req.originalUrl, 'originalUrl');
      console.log((req as any).parameters, 'parameters');
      try {
          await paymentService.updateStatusPagSeguro(req.query.notificationCode);
          return responseFunctions.success(res);
      } catch (e) {
          return responseFunctions.unknown(res, e);
      }
  });

export { router as paymentRoutes };
