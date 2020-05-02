'use strict';
import { Request, Response, Router } from 'express';
import { Customer, paymentService } from '../services/payment.service';
import { User } from '../domain/models/user';
import { tokenService } from '../services/token.service';
import { emailService } from '../services/email.service';

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
      try {
          await emailService.sendEmail({
              to: 'garotoseis@gmail.com',
              from: 'garotoseis@gmail.com',
              subject: 'requisição PAGSEGURO',
              body: req.query
          });
          paymentService.updateStatusPagSeguro(req.query.notificationCode);
      } catch (e) {
          throw e;
      }
  });

export { router as paymentRoutes };
